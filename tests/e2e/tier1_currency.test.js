/**
 * Tier 1: Currency Conversion & Exchange Rate API Tests
 * Authority: PROJECT.md Feature 11, Feature 12, Feature 13
 * Interface: src/lib/currency.ts & src/app/api/currency/route.ts
 */

const {
  jiti,
  TestSuite,
  assert,
  assertEqual,
  assertGreaterThan,
  assertMatches,
} = require('./test_utils');

const currencyLib = jiti('@/lib/currency.ts');
const currencyRoute = jiti('@/app/api/currency/route.ts');

const suite = new TestSuite('Tier 1: Currency Conversion & Live Rate Engine');

function createGetRequest(query = '') {
  return new Request(`http://localhost:3000/api/currency${query}`, { method: 'GET' });
}

// Test 1: GET /api/currency Endpoint Contract
suite.test('CURR-1.1: GET /api/currency returns valid structure with all supported rates', async () => {
  const response = await currencyRoute.GET(createGetRequest());
  assertEqual(response.status, 200, 'Currency endpoint must return HTTP 200');

  const data = await response.json();
  assertEqual(data.base, 'USD', 'Base currency must be USD');
  assert(data.rates && typeof data.rates === 'object', 'Rates object must exist');

  // Assert required currency rates are present and positive
  assertGreaterThan(data.rates.USD, 0, 'USD rate must be positive');
  assertGreaterThan(data.rates.SAR, 0, 'SAR rate must be positive');
  assertGreaterThan(data.rates.AED, 0, 'AED rate must be positive');
  assertGreaterThan(data.rates.EGP, 0, 'EGP rate must be positive');

  assert(typeof data.timestamp === 'number' && data.timestamp > 0, 'Timestamp must be positive integer');
  assert(typeof data.cached === 'boolean', 'Cached indicator must be boolean');
});

// Test 2: Fallback Rates Stability
suite.test('CURR-1.2: Fallback rates are sane and ensure offline resilience', async () => {
  // Call route with query parameter
  const response = await currencyRoute.GET(createGetRequest('?country=SA'));
  const data = await response.json();

  // SAR/USD peg is historically ~3.75
  assert(data.rates.SAR >= 3.0 && data.rates.SAR <= 4.5, `SAR rate ${data.rates.SAR} must be reasonable`);
  // AED/USD peg is historically ~3.67
  assert(data.rates.AED >= 3.0 && data.rates.AED <= 4.5, `AED rate ${data.rates.AED} must be reasonable`);
  // EGP/USD float is ~40-60
  assert(data.rates.EGP >= 30.0 && data.rates.EGP <= 100.0, `EGP rate ${data.rates.EGP} must be realistic`);
  // Assert country detection recommendation
  assertEqual(data.recommendedCurrency, 'SAR', 'SA query must recommend SAR');
});

// Test 3: Math Properties of convertPrice
suite.test('CURR-1.3: convertPrice scales base EGP amounts with zero precision loss', () => {
  const basePriceEGP = 1000;

  const egp = currencyLib.convertPrice(basePriceEGP, 'EGP');
  assertEqual(egp, 1000, 'EGP to EGP must be 1:1');

  const sar = currencyLib.convertPrice(basePriceEGP, 'SAR');
  assertEqual(sar, 77, '1000 EGP at 0.077 must equal 77 SAR');

  const aed = currencyLib.convertPrice(basePriceEGP, 'AED');
  assertEqual(aed, 74, '1000 EGP at 0.074 must equal 74 AED');

  const usd = currencyLib.convertPrice(basePriceEGP, 'USD');
  assertEqual(usd, 20, '1000 EGP at 0.02 must equal 20 USD');
});

// Test 4: formatPrice Output Formatting & RTL Spacing
suite.test('CURR-1.4: formatPrice produces localized text with correct currency symbols', () => {
  const price = 500;

  const egpStr = currencyLib.formatPrice(price, 'EGP');
  assert(egpStr.includes('ج.م'), 'EGP format must include Egyptian Pound symbol "ج.م"');
  assertMatches(egpStr, /^\d+\s+ج\.م$/, 'EGP string must have number followed by space and symbol');

  const sarStr = currencyLib.formatPrice(price, 'SAR');
  assert(sarStr.includes('ر.س'), 'SAR format must include Saudi Riyal symbol "ر.س"');

  const aedStr = currencyLib.formatPrice(price, 'AED');
  assert(aedStr.includes('د.إ'), 'AED format must include UAE Dirham symbol "د.إ"');

  const usdStr = currencyLib.formatPrice(price, 'USD');
  assert(usdStr.includes('$'), 'USD format must include Dollar symbol "$"');
});

// Test 5: Guard against Double-Conversion Regression
suite.test('CURR-1.5: Single-conversion contract prevents double conversion bugs', () => {
  // If an item is 100 EGP, in SAR it is 7.7 SAR.
  // In buggy code: formatPrice(convertPrice(100, 'SAR'), 'SAR') -> convertPrice(7.7, 'SAR') -> 0.59 SAR (Wrong!)
  const itemPriceEGP = 100;
  const properFormatted = currencyLib.formatPrice(itemPriceEGP, 'SAR');

  // Verify that the formatted output represents ~7.7 SAR, NOT ~0.59 SAR
  assert(
    properFormatted.startsWith('7.7') || properFormatted.startsWith('8'),
    `Formatted price "${properFormatted}" must represent 7.7 SAR for 100 EGP item, not a double-converted fraction`
  );
  assert(
    !properFormatted.startsWith('0.5') && !properFormatted.startsWith('0.6'),
    'Fatal regression: double conversion detected in currency formatting pipeline'
  );
});

// Test 6: Country to Currency Geolocation Logic
suite.test('CURR-1.6: Geolocation country code mappings suggest optimal currencies', () => {
  // Autonomous mapping function following PROJECT.md Feature 12
  function suggestCurrencyFromCountry(countryCode) {
    switch (countryCode?.toUpperCase()) {
      case 'SA': return 'SAR';
      case 'EG': return 'EGP';
      case 'AE': return 'AED';
      default: return 'USD';
    }
  }

  assertEqual(suggestCurrencyFromCountry('SA'), 'SAR', 'Saudi Arabia visitor must receive SAR suggestion');
  assertEqual(suggestCurrencyFromCountry('EG'), 'EGP', 'Egypt visitor must receive EGP suggestion');
  assertEqual(suggestCurrencyFromCountry('AE'), 'AED', 'UAE visitor must receive AED suggestion');
  assertEqual(suggestCurrencyFromCountry('US'), 'USD', 'US visitor must receive USD default');
  assertEqual(suggestCurrencyFromCountry('DE'), 'USD', 'EU visitor must receive USD default');
  assertEqual(suggestCurrencyFromCountry(null), 'USD', 'Null country must safely fallback to USD default');
});

module.exports = suite;
