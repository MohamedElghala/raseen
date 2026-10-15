import { Currency } from './types';

export type { Currency };

export const EXCHANGE_RATES: Record<Currency, number> = {
  EGP: 1,
  SAR: 0.077,
  AED: 0.074,
  USD: 0.02,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EGP: 'ج.م',
  SAR: 'ر.س',
  AED: 'د.إ',
  USD: '$',
};

export const COUNTRY_TO_CURRENCY_MAP: Record<string, Currency> = {
  EG: 'EGP',
  SA: 'SAR',
  AE: 'AED',
  QA: 'SAR',
  KW: 'SAR',
  BH: 'SAR',
  OM: 'SAR',
  US: 'USD',
  GB: 'USD',
};

// In-memory active rates (initialized to defaults, updateable at runtime)
let activeRates: Record<Currency, number> = { ...EXCHANGE_RATES };

export function getActiveRates(): Record<Currency, number> {
  return { ...activeRates };
}

export function updateExchangeRates(newRates: Partial<Record<Currency, number>>): void {
  activeRates = { ...activeRates, ...newRates };
}

/**
 * Converts price in EGP to target currency based on exchange rates.
 */
export const convertPrice = (
  priceEGP: number,
  targetCurrency: Currency,
  rates: Record<Currency, number> = activeRates
): number => {
  const rate = rates[targetCurrency] ?? EXCHANGE_RATES[targetCurrency] ?? 1;
  return priceEGP * rate;
};

/**
 * Formats an EGP price in the target currency with its appropriate symbol.
 * Does NOT perform double conversion: takes base EGP amount, converts once, and appends symbol.
 */
export const formatPrice = (
  priceEGP: number,
  currency: Currency,
  rates: Record<Currency, number> = activeRates
): string => {
  const converted = convertPrice(priceEGP, currency, rates);

  // EGP is displayed rounded, foreign currencies with 2 decimals
  const formatted =
    currency === 'EGP'
      ? Math.round(converted).toString()
      : converted.toFixed(2).replace(/\.00$/, '');

  // Support RTL rendering properly by putting space between amount and symbol
  return `${formatted} ${CURRENCY_SYMBOLS[currency] || currency}`;
};

/**
 * Detects visitor country and recommended currency via https://api.country.is/
 */
export async function detectUserCurrency(
  ip?: string
): Promise<{ country: string; currency: Currency }> {
  try {
    const url = ip
      ? `https://api.country.is/${encodeURIComponent(ip)}`
      : 'https://api.country.is/';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const country = String(data.country || 'EG').toUpperCase();
      const currency = COUNTRY_TO_CURRENCY_MAP[country] || 'SAR';
      return { country, currency };
    }
  } catch (err) {
    console.warn('Country detection via api.country.is failed:', err);
  }

  return { country: 'EG', currency: 'EGP' };
}

/**
 * Fetches live exchange rates from the /api/currency endpoint and updates in-memory rates.
 */
export async function fetchLiveExchangeRates(): Promise<Record<Currency, number>> {
  try {
    const res = await fetch('/api/currency', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.egpRates) {
        updateExchangeRates(data.egpRates);
        return getActiveRates();
      }
    }
  } catch (err) {
    console.warn('Failed to fetch live currency rates, using fallback:', err);
  }

  return getActiveRates();
}
