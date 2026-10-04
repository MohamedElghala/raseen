import { Currency } from './types';

const EXCHANGE_RATES: Record<Currency, number> = {
  EGP: 1,
  SAR: 0.077,
  AED: 0.074,
  USD: 0.02
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EGP: 'ج.م',
  SAR: 'ر.س',
  AED: 'د.إ',
  USD: '$'
};

export const convertPrice = (priceEGP: number, targetCurrency: Currency): number => {
  return priceEGP * EXCHANGE_RATES[targetCurrency];
};

export const formatPrice = (priceEGP: number, currency: Currency): string => {
  const converted = convertPrice(priceEGP, currency);
  
  // Format with 2 decimal places if it's not EGP and has fractions
  const formatted = currency === 'EGP' 
    ? Math.round(converted).toString() 
    : converted.toFixed(2).replace(/\.00$/, '');
    
  // Support RTL rendering properly by putting space between amount and symbol
  return `${formatted} ${CURRENCY_SYMBOLS[currency]}`;
};
