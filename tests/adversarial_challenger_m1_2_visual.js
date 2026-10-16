/**
 * Adversarial Challenger M1-2: Visual Consistency, WCAG Contrast & Print Layout Stress Harness
 * 
 * Verifies:
 * 1. WCAG 2.1 AA & AAA relative luminance contrast ratios for all dark/light palette combinations
 * 2. Cross-engine CSS gradient compatibility (-webkit-background-clip, background-clip, -webkit-text-fill-color)
 * 3. Print layout isolation (@media print rules, ancestor DOM trees, non-collision)
 * 4. Typography vertical metrics and Cairo font Arabic glyph clearance
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// --- Color & Contrast Utilities (W3C WCAG 2.1 Specification) ---

function hexToRgb(hex) {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function alphaBlend(fgRgb, fgAlpha, bgRgb) {
  return {
    r: Math.round(fgAlpha * fgRgb.r + (1 - fgAlpha) * bgRgb.r),
    g: Math.round(fgAlpha * fgRgb.g + (1 - fgAlpha) * bgRgb.g),
    b: Math.round(fgAlpha * fgRgb.b + (1 - fgAlpha) * bgRgb.b),
  };
}

function sRgbLuminance(rgb) {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hexFg, hexBg, fgAlpha = 1.0, bgAlpha = 1.0, baseBgHex = '#000000') {
  let bgRgb = hexToRgb(hexBg);
  if (bgAlpha < 1.0) {
    bgRgb = alphaBlend(bgRgb, bgAlpha, hexToRgb(baseBgHex));
  }
  let fgRgb = hexToRgb(hexFg);
  if (fgAlpha < 1.0) {
    fgRgb = alphaBlend(fgRgb, fgAlpha, bgRgb);
  }
  const l1 = sRgbLuminance(fgRgb);
  const l2 = sRgbLuminance(bgRgb);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
}

// --- Test Suite Execution ---

let passedCount = 0;
let failedCount = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    passedCount++;
    results.push({ name, status: 'PASS' });
    console.log(`  ✔ PASS: ${name}`);
  } catch (err) {
    failedCount++;
    results.push({ name, status: 'FAIL', error: err.message });
    console.error(`  ❌ FAIL: ${name} -> ${err.message}`);
  }
}

console.log('\n======================================================================');
console.log('   CHALLENGER M1-2: EMPIRICAL VISUAL & PRINT HARNESS');
console.log('======================================================================\n');

// ==========================================================================
// 1. WCAG 2.1 Contrast Ratios
// ==========================================================================
console.log('▶ Suite 1: Mathematical WCAG 2.1 Contrast Ratio Verification');

test('WCAG-1.1: H1 text-slate-100 on dark obsidian (#0B0F17) passes WCAG AAA', () => {
  const ratio = contrastRatio('#f1f5f9', '#0B0F17');
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 7.0:1 AAA)`);
  assert(ratio >= 7.0, `Contrast ratio ${ratio.toFixed(2)} is less than AAA threshold 7.0:1`);
});

test('WCAG-1.2: H1 text-slate-100 on slate-950 (#020617) passes WCAG AAA', () => {
  const ratio = contrastRatio('#f1f5f9', '#020617');
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 7.0:1 AAA)`);
  assert(ratio >= 7.0, `Contrast ratio ${ratio.toFixed(2)} is less than AAA threshold 7.0:1`);
});

test('WCAG-1.3: Gold gradient stop #1 (#fef3c7) on #0B0F17 passes WCAG AAA', () => {
  const ratio = contrastRatio('#fef3c7', '#0B0F17');
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 4.5:1 AA, >= 7.0:1 AAA)`);
  assert(ratio >= 7.0, `Stop 1 contrast ratio ${ratio.toFixed(2)} failed AAA standard`);
});

test('WCAG-1.4: Gold gradient stop #2 (#fcd34d) on #0B0F17 passes WCAG AAA', () => {
  const ratio = contrastRatio('#fcd34d', '#0B0F17');
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 7.0:1 AAA)`);
  assert(ratio >= 7.0, `Stop 2 contrast ratio ${ratio.toFixed(2)} failed AAA standard`);
});

test('WCAG-1.5: Gold gradient stop #3 (#f59e0b) [darkest stop] on #0B0F17 passes WCAG AAA', () => {
  const ratio = contrastRatio('#f59e0b', '#0B0F17');
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 7.0:1 AAA)`);
  assert(ratio >= 7.0, `Stop 3 contrast ratio ${ratio.toFixed(2)} failed AAA standard`);
});

test('WCAG-1.6: Subtitle text-slate-300 with 90% opacity over #0B0F17 passes WCAG AAA', () => {
  const ratio = contrastRatio('#cbd5e1', '#0B0F17', 0.9);
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 7.0:1 AAA)`);
  assert(ratio >= 7.0, `Blended text-slate-300/90 ratio ${ratio.toFixed(2)} failed AAA standard`);
});

test('WCAG-1.7: Cloud update badge text-cyan-300 on bg-slate-900/90 passes WCAG AAA', () => {
  const ratio = contrastRatio('#67e8f9', '#0f172a', 1.0, 0.9, '#0B0F17');
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 7.0:1 AAA)`);
  assert(ratio >= 7.0, `Badge contrast ratio ${ratio.toFixed(2)} failed AAA standard`);
});

test('WCAG-1.8: Active tab pill text-white on bg-slate-800/90 passes WCAG AAA', () => {
  const ratio = contrastRatio('#ffffff', '#1e293b', 1.0, 0.9, '#020617');
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 7.0:1 AAA)`);
  assert(ratio >= 7.0, `Active tab contrast ratio ${ratio.toFixed(2)} failed AAA standard`);
});

test('WCAG-1.9: Inactive tab text-slate-400 on bg-slate-950/80 passes WCAG AA', () => {
  const ratio = contrastRatio('#94a3b8', '#020617', 1.0, 0.8, '#0B0F17');
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 4.5:1 AA)`);
  assert(ratio >= 4.5, `Inactive tab contrast ratio ${ratio.toFixed(2)} failed AA standard`);
});

test('WCAG-1.10: FilterBar active pill text-amber-300 on bg-slate-800 passes WCAG AAA', () => {
  const ratio = contrastRatio('#fcd34d', '#1e293b');
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 7.0:1 AAA)`);
  assert(ratio >= 7.0, `FilterBar active button ratio ${ratio.toFixed(2)} failed AAA standard`);
});

test('WCAG-1.11: FilterBar inactive button text-slate-300 on raseen.surface (#0f1a33) passes WCAG AAA', () => {
  const ratio = contrastRatio('#cbd5e1', '#0f1a33');
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 7.0:1 AAA)`);
  assert(ratio >= 7.0, `FilterBar inactive button ratio ${ratio.toFixed(2)} failed AAA standard`);
});

test('WCAG-1.12: Navbar links text-slate-300 on bg-slate-950/85 passes WCAG AAA', () => {
  const ratio = contrastRatio('#cbd5e1', '#020617', 1.0, 0.85, '#0B0F17');
  console.log(`    Calculated ratio: ${ratio.toFixed(2)}:1 (Required: >= 7.0:1 AAA)`);
  assert(ratio >= 7.0, `Navbar link ratio ${ratio.toFixed(2)} failed AAA standard`);
});

// ==========================================================================
// 2. Cross-Engine Gradient CSS Rules & Typography
// ==========================================================================
console.log('\n▶ Suite 2: Cross-Engine Gradient Rendering & Typography Integrity');

const globalsCss = fs.readFileSync(path.join(__dirname, '../src/app/globals.css'), 'utf-8');
const heroTsx = fs.readFileSync(path.join(__dirname, '../src/components/storefront/Hero.tsx'), 'utf-8');
const navbarTsx = fs.readFileSync(path.join(__dirname, '../src/components/layout/Navbar.tsx'), 'utf-8');

test('GRAD-2.1: .gold-gradient-text has complete cross-browser prefix declarations', () => {
  const match = globalsCss.match(/\.gold-gradient-text\s*\{([^}]+)\}/);
  assert(match, 'Class .gold-gradient-text must exist in globals.css');
  const body = match[1];

  assert(body.includes('linear-gradient'), 'Must specify linear-gradient background');
  assert(body.includes('-webkit-background-clip: text'), 'Must specify -webkit-background-clip: text for WebKit/Blink');
  assert(body.includes('background-clip: text'), 'Must specify standard background-clip: text for Gecko/Firefox');
  assert(body.includes('-webkit-text-fill-color: transparent'), 'Must specify -webkit-text-fill-color: transparent');
});

test('GRAD-2.2: .gold-gradient-text color stops adhere to refined champagne palette', () => {
  const match = globalsCss.match(/\.gold-gradient-text\s*\{([^}]+)\}/);
  const body = match[1];
  assert(body.includes('#fef3c7'), 'Must include light champagne #fef3c7 at start');
  assert(body.includes('#fcd34d'), 'Must include warm amber #fcd34d in mid-stop');
  assert(body.includes('#f59e0b'), 'Must include rich amber #f59e0b at end');
});

test('GRAD-2.3: Hero subtitle has comfortable line-height to prevent Arabic glyph clipping', () => {
  assert(heroTsx.includes('gold-gradient-text'), 'Hero must apply gold-gradient-text');
  assert(heroTsx.includes('leading-relaxed'), 'Hero subtitle must use leading-relaxed for Arabic font Cairo vertical breathing room');
  assert(!heroTsx.includes('overflow-hidden') || !heroTsx.includes('gold-gradient-text overflow-hidden'), 'Subtitle element must not restrict overflow');
});

test('GRAD-2.4: Cairo font family imported with comprehensive weights (300-900)', () => {
  assert(globalsCss.includes('fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900'), 'Cairo Google font import must cover full weight spectrum');
});

// ==========================================================================
// 3. Print Isolation & DOM Structure Integrity
// ==========================================================================
console.log('\n▶ Suite 3: Print Isolation & DOM Architecture Integrity');

const invoiceTsx = fs.readFileSync(path.join(__dirname, '../src/components/tools/InvoiceGenerator.tsx'), 'utf-8');

test('PRINT-3.1: #printable-template-canvas is strictly separated from interactive form DOM', () => {
  const formEndIdx = invoiceTsx.indexOf('</form>');
  const canvasIdx = invoiceTsx.indexOf('id="printable-template-canvas"');
  assert(formEndIdx !== -1, 'InvoiceGenerator must have </form>');
  assert(canvasIdx !== -1, 'InvoiceGenerator must have #printable-template-canvas');
  assert(canvasIdx > formEndIdx, '#printable-template-canvas MUST NOT be a child of <form> (which has display:none in print)');
});

test('PRINT-3.2: #interactive-suite closes before tab content containers', () => {
  const suiteCloseIdx = heroTsx.indexOf('id="interactive-suite"');
  const tabContentIdx = heroTsx.indexOf('{/* Tab Content Display Area */}');
  assert(suiteCloseIdx !== -1, 'Hero must have #interactive-suite');
  assert(tabContentIdx !== -1, 'Hero must have Tab Content Display Area');
  assert(tabContentIdx > suiteCloseIdx, 'Tab content must not be enclosed inside #interactive-suite');
});

test('PRINT-3.3: globals.css @media print specifies strict high-DPI rules', () => {
  const printBlock = globalsCss.match(/@media\s+print\s*\{([\s\S]+)$/);
  assert(printBlock, '@media print block must exist');
  const css = printBlock[1];

  assert(css.includes('size: A4 portrait;'), 'Must define A4 portrait page size');
  assert(css.includes('margin: 8mm 10mm;'), 'Must define balanced print margins');
  assert(css.includes('-webkit-print-color-adjust: exact !important;'), 'Must preserve exact print colors');
  assert(css.includes('shape-rendering: crispEdges !important;'), 'Must render crisp SVG QR code matrix in print');
  assert(css.includes('body * {\n    visibility: hidden;\n  }'), 'Must hide ambient elements using visibility:hidden');
  assert(css.includes('#printable-template-canvas,\n  #printable-template-canvas * {\n    visibility: visible;\n  }'), 'Must re-enable visibility on printable canvas');
});

test('PRINT-3.4: Ambient chrome (Hero headlines, badge, description) suppress in print mode', () => {
  assert(heroTsx.includes('print:hidden'), 'Hero elements must explicitly specify print:hidden');
  // Check H1 headline wrapper has print:hidden
  assert(heroTsx.includes('mb-4 sm:mb-6 print:hidden'), 'Headline container must have print:hidden');
  // Check description paragraph has print:hidden
  assert(heroTsx.includes('leading-7 sm:leading-8 font-normal print:hidden'), 'Description paragraph must have print:hidden');
  // Check #interactive-suite has print:hidden
  assert(heroTsx.includes('id="interactive-suite" className="w-full max-w-4xl mb-6 print:hidden"'), 'Interactive suite bar must have print:hidden');
});

// ==========================================================================
// Summary
// ==========================================================================
console.log('\n======================================================================');
console.log(`TOTAL TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
console.log('======================================================================\n');

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
