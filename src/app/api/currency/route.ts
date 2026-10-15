import { NextResponse } from 'next/server';

interface CurrencyResponse {
  base: 'USD';
  rates: {
    USD: number;
    SAR: number;
    AED: number;
    EGP: number;
    EUR: number;
  };
  egpRates: {
    EGP: number;
    SAR: number;
    AED: number;
    USD: number;
  };
  detectedCountry?: string;
  recommendedCurrency?: 'EGP' | 'SAR' | 'AED' | 'USD';
  timestamp: number;
  cached: boolean;
}

// In-memory cache for live rates (1 hour TTL)
let cachedRates: {
  rates: { USD: number; SAR: number; AED: number; EGP: number; EUR: number };
  timestamp: number;
} | null = null;

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// High-fidelity fallback exchange rates (Base: USD)
const FALLBACK_USD_RATES = {
  USD: 1.0,
  SAR: 3.75,
  AED: 3.6725,
  EGP: 48.65,
  EUR: 0.92,
};

const COUNTRY_TO_CURRENCY_MAP: Record<string, 'EGP' | 'SAR' | 'AED' | 'USD'> = {
  EG: 'EGP',
  SA: 'SAR',
  AE: 'AED',
  QA: 'SAR',
  KW: 'SAR',
  BH: 'SAR',
  OM: 'SAR',
  US: 'USD',
  GB: 'USD',
  EU: 'USD',
};

async function fetchLiveExchangeRates(): Promise<{
  USD: number;
  SAR: number;
  AED: number;
  EGP: number;
  EUR: number;
}> {
  const now = Date.now();
  if (cachedRates && now - cachedRates.timestamp < CACHE_TTL) {
    return cachedRates.rates;
  }

  // 1. Primary public API: open.er-api.com
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Raseen-Platform-Bot/2.0' },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const r = data.rates || {};
      const rates = {
        USD: 1.0,
        SAR: Number(r.SAR) || FALLBACK_USD_RATES.SAR,
        AED: Number(r.AED) || FALLBACK_USD_RATES.AED,
        EGP: Number(r.EGP) || FALLBACK_USD_RATES.EGP,
        EUR: Number(r.EUR) || FALLBACK_USD_RATES.EUR,
      };
      cachedRates = { rates, timestamp: now };
      return rates;
    }
  } catch (err) {
    console.warn('Primary currency API fetch failed, trying fallback:', err);
  }

  // 2. Secondary public API: exchangerate-api.com
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: controller.signal,
      headers: { 'User-Agent': 'Raseen-Platform-Bot/2.0' },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const r = data.rates || {};
      const rates = {
        USD: 1.0,
        SAR: Number(r.SAR) || FALLBACK_USD_RATES.SAR,
        AED: Number(r.AED) || FALLBACK_USD_RATES.AED,
        EGP: Number(r.EGP) || FALLBACK_USD_RATES.EGP,
        EUR: Number(r.EUR) || FALLBACK_USD_RATES.EUR,
      };
      cachedRates = { rates, timestamp: now };
      return rates;
    }
  } catch (err) {
    console.warn('Secondary currency API fetch failed, using static fallback:', err);
  }

  return FALLBACK_USD_RATES;
}

async function detectCountryFromIp(
  clientIp?: string | null
): Promise<{ country: string; currency: 'EGP' | 'SAR' | 'AED' | 'USD' }> {
  try {
    const isLocal =
      !clientIp ||
      clientIp === '127.0.0.1' ||
      clientIp === '::1' ||
      clientIp.startsWith('192.168.') ||
      clientIp.startsWith('10.') ||
      clientIp.startsWith('172.');

    const targetUrl = !isLocal
      ? `https://api.country.is/${encodeURIComponent(clientIp!)}`
      : 'https://api.country.is/';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const countryCode = String(data.country || 'EG').toUpperCase();
      const recCurrency = COUNTRY_TO_CURRENCY_MAP[countryCode] || 'SAR';
      return { country: countryCode, currency: recCurrency };
    }
  } catch (err) {
    console.warn('Country detection via api.country.is failed:', err);
  }

  return { country: 'EG', currency: 'EGP' };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = Date.now();

  // Allow explicit query override for testing/auditing: ?country=SA or ?ip=8.8.8.8
  const queryCountry = searchParams.get('country')?.toUpperCase();
  const queryIp = searchParams.get('ip');

  // Extract client IP from standard reverse proxy headers
  const forwardedFor = request?.headers?.get ? request.headers.get('x-forwarded-for') : null;
  const realIp = request?.headers?.get ? request.headers.get('x-real-ip') : null;
  const cfConnectingIp = request?.headers?.get ? request.headers.get('cf-connecting-ip') : null;
  const clientIp =
    queryIp ||
    (forwardedFor ? forwardedFor.split(',')[0].trim() : '') ||
    realIp ||
    cfConnectingIp ||
    null;

  // Run exchange rates fetch and IP country detection in parallel
  const isRatesCached = !!cachedRates && now - cachedRates.timestamp < CACHE_TTL;
  const [rates, geo] = await Promise.all([
    fetchLiveExchangeRates(),
    queryCountry
      ? Promise.resolve({
          country: queryCountry,
          currency: COUNTRY_TO_CURRENCY_MAP[queryCountry] || 'USD',
        })
      : detectCountryFromIp(clientIp),
  ]);

  // Compute conversion factors relative to EGP (1 EGP = x Currency)
  const usdToEgp = rates.EGP || FALLBACK_USD_RATES.EGP;
  const egpRates = {
    EGP: 1,
    SAR: Number(((rates.SAR || 3.75) / usdToEgp).toFixed(4)),
    AED: Number(((rates.AED || 3.6725) / usdToEgp).toFixed(4)),
    USD: Number((1 / usdToEgp).toFixed(4)),
  };

  const response: CurrencyResponse = {
    base: 'USD',
    rates,
    egpRates,
    detectedCountry: geo.country,
    recommendedCurrency: geo.currency,
    timestamp: now,
    cached: isRatesCached,
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
