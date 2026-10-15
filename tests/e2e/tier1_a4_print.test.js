/**
 * Tier 1: A4 PDF Print Template & Layout Isolation Tests
 * Authority: PROJECT.md Feature 5, ORIGINAL_REQUEST.md R2
 * Interface: src/components/tools/InvoiceGenerator.tsx
 */

const {
  jiti,
  TestSuite,
  assert,
  renderComponent,
} = require('./test_utils');

const InvoiceGenerator = jiti('@/components/tools/InvoiceGenerator.tsx').default;

const suite = new TestSuite('Tier 1: A4 Print Template Isolation & ZATCA PDF Canvas');

// Test 1: Printable Canvas Isolation Classes
suite.test('PRINT-1.1: Printable template canvas has strict "hidden print:block" isolation', () => {
  const html = renderComponent(InvoiceGenerator);

  assert(html.includes('id="printable-template-canvas"'), 'Canvas must have id="printable-template-canvas"');
  assert(
    html.includes('hidden print:block'),
    'Canvas must be hidden on screen and displayed exclusively during print (@media print)'
  );
  assert(html.includes('bg-white'), 'Printable canvas must enforce crisp white background');
  assert(html.includes('text-slate-950'), 'Printable canvas must enforce high-contrast dark text');
});

// Test 2: Screen Controls Suppressed during Print
suite.test('PRINT-1.2: Screen interactive form elements are hidden during print via print:hidden', () => {
  const html = renderComponent(InvoiceGenerator);

  // Form container must have print:hidden
  assert(
    html.includes('print:hidden'),
    'Form controls and interactive inputs must have print:hidden class'
  );
  assert(
    html.includes('print:bg-white print:text-black print:border-none print:shadow-none print:p-0'),
    'Outer container must clear shadows, dark backgrounds, and borders in print mode'
  );
});

// Test 3: Mandatory ZATCA Invoice Legal Fields
suite.test('PRINT-1.3: Printable canvas contains all mandatory ZATCA e-invoicing fields', () => {
  const html = renderComponent(InvoiceGenerator);

  // Extract content of printable canvas
  const canvasIdx = html.indexOf('id="printable-template-canvas"');
  assert(canvasIdx !== -1, 'Printable canvas must exist');
  const canvasHtml = html.substring(canvasIdx);

  // Verify mandatory ZATCA header & seller details
  assert(canvasHtml.includes('فاتورة ضريبية إلكترونية مبسطة'), 'Print header must state simplified tax invoice');
  assert(canvasHtml.includes('الرقم الضريبي:'), 'Seller VAT number label must be present');
  assert(canvasHtml.includes('31024589200003'), 'Default ZATCA tax number must be rendered');
  assert(canvasHtml.includes('رقم الفاتورة:'), 'Invoice number must be present');
  assert(canvasHtml.includes('التاريخ:'), 'Invoice date must be present');

  // Verify buyer details
  assert(canvasHtml.includes('بيانات العميل / المشتري:'), 'Buyer section must be present');
  assert(canvasHtml.includes('مؤسسة الأفق المتقدمة'), 'Default client name must be rendered');

  // Verify items table & totals
  assert(canvasHtml.includes('البند / الخدمة'), 'Table must have item description column');
  assert(canvasHtml.includes('سعر الوحدة'), 'Table must have unit price column');
  assert(canvasHtml.includes('المجموع الخاضع للضريبة:'), 'Taxable amount summary must be present');
  assert(canvasHtml.includes('ضريبة القيمة المضافة'), 'VAT amount summary must be present');
  assert(canvasHtml.includes('الإجمالي الكلي المستحق:'), 'Grand total line must be present');
});

// Test 4: ZATCA QR Code Embedded in Print Layout
suite.test('PRINT-1.4: Authentic ZATCA QR Code SVG is embedded inside print canvas', () => {
  const html = renderComponent(InvoiceGenerator);

  const canvasIdx = html.indexOf('id="printable-template-canvas"');
  const canvasHtml = html.substring(canvasIdx);

  assert(canvasHtml.includes('<svg'), 'Printable canvas must embed <svg> element for QR code');
  assert(canvasHtml.includes('viewBox="0 0'), 'Print QR code must use standard viewBox attribute');
});

// Test 5: Typography & RTL Preservation
suite.test('PRINT-1.5: Print layout preserves native Cairo font and right-to-left orientation', () => {
  const html = renderComponent(InvoiceGenerator);

  const canvasIdx = html.indexOf('id="printable-template-canvas"');
  const canvasHtml = html.substring(canvasIdx);

  assert(canvasHtml.includes('font-cairo'), 'Canvas must specify Cairo font for Arabic rendering');
  assert(canvasHtml.includes('text-right'), 'Items table must be right-aligned for Arabic text');
});

// Test 6: Platform Attribution & Footnote
suite.test('PRINT-1.6: Professional platform watermark footnote rendered at bottom of invoice', () => {
  const html = renderComponent(InvoiceGenerator);

  const canvasIdx = html.indexOf('id="printable-template-canvas"');
  const canvasHtml = html.substring(canvasIdx);

  assert(
    canvasHtml.includes('تم إنشاء هذه الفاتورة إلكترونياً بواسطة منصة رَصين للأصول وإدارة الأعمال (raseen.me)'),
    'Footer watermark must be present on print invoice'
  );
});

module.exports = suite;
