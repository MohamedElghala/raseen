import { NextResponse } from 'next/server';

interface CurrencyResponse {
  base: string;
  rates: {
    USD: number;
    SAR: number;
    AED: number;
    EGP: number;
    EUR: number;
  };
  timestamp: number;
  cached: boolean;
}

// In-memory cache for 6 hours
let cachedData: CurrencyResponse | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

// High-fidelity fallback rates
const FALLBACK_RATES = {
  USD: 1.0,
  SAR: 3.75,
  AED: 3.67,
  EGP: 48.65,
  EUR: 0.92,
};

export async function GET() {
  const now = Date.now();

  // Return cache if still valid
  if (cachedData && now - lastFetchTime < CACHE_TTL) {
    return NextResponse.json({ ...cachedData, cached: true });
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 21600 }, // 6 hours Next.js cache
      headers: { 'User-Agent': 'Raseen-Platform-Bot/2.0' },
    });

    if (res.ok) {
      const data = await res.json();
      const rates = data.rates || {};

      cachedData = {
        base: 'USD',
        rates: {
          USD: 1.0,
          SAR: rates.SAR || FALLBACK_RATES.SAR,
          AED: rates.AED || FALLBACK_RATES.AED,
          EGP: rates.EGP || FALLBACK_RATES.EGP,
          EUR: rates.EUR || FALLBACK_RATES.EUR,
        },
        timestamp: now,
        cached: false,
      };
      lastFetchTime = now;

      return NextResponse.json(cachedData);
    }
  } catch (error) {
    console.warn('Currency upstream fetch failed, using fallback rates:', error);
  }

  // Fallback response
  const fallbackResponse: CurrencyResponse = {
    base: 'USD',
    rates: FALLBACK_RATES,
    timestamp: now,
    cached: true,
  };

  return NextResponse.json(fallbackResponse);
}
