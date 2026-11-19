import { mockProducts } from './mockData';
import { ProductItem } from './types';
import { buildZipBuffer } from './ooxmlZip';

export interface GeneratedAssetFile {
  buffer: Buffer;
  filename: string;
  contentType: string;
}

function escapeXml(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function colLetter(colIdx: number): string {
  let s = '';
  let n = colIdx + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

interface SheetCell {
  v?: string | number;
  f?: string;
}

function buildWorksheetXml(rows: SheetCell[][], rtl = true): string {
  const rowsXml = rows
    .map((row, rIdx) => {
      const rowNum = rIdx + 1;
      const cellsXml = row
        .map((cell, cIdx) => {
          const ref = `${colLetter(cIdx)}${rowNum}`;
          if (cell.f) {
            return `<c r="${ref}"><f>${escapeXml(cell.f)}</f></c>`;
          }
          if (typeof cell.v === 'number') {
            return `<c r="${ref}"><v>${cell.v}</v></c>`;
          }
          const text = escapeXml(cell.v ?? '');
          return `<c r="${ref}" t="inlineStr"><is><t>${text}</t></is></c>`;
        })
        .join('');
      return `<row r="${rowNum}">${cellsXml}</row>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews>
    <sheetView workbookViewId="0"${rtl ? ' rightToLeft="1"' : ''}/>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  <sheetData>${rowsXml}</sheetData>
</worksheet>`;
}

function buildXlsxAsset(product: ProductItem, buyerId: string): GeneratedAssetFile {
  const isEng = product.category === 'engineering' || product.id.includes('boq') || product.id === 'free-p2';
  const sheet1Title = isEng ? 'جدول الكميات والمقايسة' : 'السجل المالي الرئيسي';
  const sheet2Title = 'دليل الاستخدام والمواصفات';

  const sheet1Rows: SheetCell[][] = isEng
    ? [
        [{ v: `منصة رَصين — ${product.title}` }],
        [{ v: `المرخص له: ${buyerId}` }, { v: `المعرف: ${product.id}` }],
        [],
        [
          { v: 'البند / الكود' },
          { v: 'وصف الأعمال الهندسية' },
          { v: 'الوحدة' },
          { v: 'الكمية' },
          { v: 'سعر الوحدة' },
          { v: 'الإجمالي' },
        ],
        [
          { v: '03-300' },
          { v: 'أعمال الخرسانة المسلحة للأساسات والأعمدة (C35)' },
          { v: 'م3' },
          { v: 185 },
          { v: 2650 },
          { f: 'D5*E5' },
        ],
        [
          { v: '03-200' },
          { v: 'توريد وتشكيل وتركيب حديد التسليح عالي المقاومة' },
          { v: 'طن' },
          { v: 24 },
          { v: 39500 },
          { f: 'D6*E6' },
        ],
        [
          { v: '04-200' },
          { v: 'مباني طوب أسمنتي معزول سماكة 20 سم' },
          { v: 'م2' },
          { v: 640 },
          { v: 320 },
          { f: 'D7*E7' },
        ],
        [
          { v: '09-300' },
          { v: 'أعمال الأرضيات البورسلين والسيراميك والوزرات' },
          { v: 'م2' },
          { v: 420 },
          { v: 480 },
          { f: 'D8*E8' },
        ],
        [
          { v: '09-900' },
          { v: 'دهانات بلاستيك داخلي 3 أوجه مع المعجون' },
          { v: 'م2' },
          { v: 1450 },
          { v: 115 },
          { f: 'D9*E9' },
        ],
        [
          { v: '' },
          { v: 'إجمالي التكلفة قبل الضريبة' },
          { v: '' },
          { v: '' },
          { v: '' },
          { f: 'SUM(F5:F9)' },
        ],
        [
          { v: '' },
          { v: 'ضريبة القيمة المضافة (15%)' },
          { v: '' },
          { v: '' },
          { v: '' },
          { f: 'F10*0.15' },
        ],
        [
          { v: '' },
          { v: 'الإجمالي النهائي للمقايسة' },
          { v: '' },
          { v: '' },
          { v: '' },
          { f: 'F10+F11' },
        ],
      ]
    : [
        [{ v: `منصة رَصين — ${product.title}` }],
        [{ v: `المرخص له: ${buyerId}` }, { v: `المعرف: ${product.id}` }],
        [],
        [
          { v: 'الشهر / الفترة' },
          { v: 'الإيرادات التشغيلية' },
          { v: 'التكاليف المباشرة' },
          { v: 'المصروفات الإدارية' },
          { v: 'صافي التدفق / الربح' },
          { v: 'هامش الربح' },
        ],
        [{ v: 'يناير 2026' }, { v: 120000 }, { v: 45000 }, { v: 22000 }, { f: 'B5-C5-D5' }, { f: 'E5/B5' }],
        [{ v: 'فبراير 2026' }, { v: 138000 }, { v: 49000 }, { v: 23000 }, { f: 'B6-C6-D6' }, { f: 'E6/B6' }],
        [{ v: 'مارس 2026' }, { v: 152000 }, { v: 53000 }, { v: 24500 }, { f: 'B7-C7-D7' }, { f: 'E7/B7' }],
        [{ v: 'أبريل 2026' }, { v: 165000 }, { v: 58000 }, { v: 25000 }, { f: 'B8-C8-D8' }, { f: 'E8/B8' }],
        [{ v: 'مايو 2026' }, { v: 179000 }, { v: 61000 }, { v: 26000 }, { f: 'B9-C9-D9' }, { f: 'E9/B9' }],
        [{ v: 'يونيو 2026' }, { v: 195000 }, { v: 66000 }, { v: 27000 }, { f: 'B10-C10-D10' }, { f: 'E10/B10' }],
        [
          { v: 'الإجمالي النصف سنوي' },
          { f: 'SUM(B5:B10)' },
          { f: 'SUM(C5:C10)' },
          { f: 'SUM(D5:D10)' },
          { f: 'SUM(E5:E10)' },
          { f: 'E11/B11' },
        ],
      ];

  const sheet2Rows: SheetCell[][] = [
    [{ v: 'بطاقة الأصل الرقمي من منصة رَصين' }],
    [{ v: 'اسم المنتج' }, { v: product.title }],
    [{ v: 'الوصف' }, { v: product.description }],
    [{ v: 'التوافق' }, { v: product.technicalSpecs?.compatibility?.join(' | ') || 'Excel 2016+ / Google Sheets' }],
    [{ v: 'الترخيص' }, { v: product.license === 'commercial' ? 'ترخيص تجاري' : 'ترخيص شخصي' }],
    [{ v: 'المرخص له' }, { v: buyerId }],
    [{ v: 'الموقع الرسمي' }, { v: 'https://raseen.me' }],
  ];

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${escapeXml(sheet1Title)}" sheetId="1" r:id="rId1"/>
    <sheet name="${escapeXml(sheet2Title)}" sheetId="2" r:id="rId2"/>
  </sheets>
</workbook>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
</Relationships>`;

  const buffer = buildZipBuffer([
    { name: '[Content_Types].xml', content: contentTypesXml },
    { name: '_rels/.rels', content: rootRelsXml },
    { name: 'xl/workbook.xml', content: workbookXml },
    { name: 'xl/_rels/workbook.xml.rels', content: workbookRelsXml },
    { name: 'xl/worksheets/sheet1.xml', content: buildWorksheetXml(sheet1Rows, true) },
    { name: 'xl/worksheets/sheet2.xml', content: buildWorksheetXml(sheet2Rows, true) },
  ]);

  return {
    buffer,
    filename: `raseen-${product.id}.xlsx`,
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
}

function buildDocxParagraph(text: string, bold = false): string {
  const rPr = bold ? '<w:rPr><w:b/><w:rtl/></w:rPr>' : '<w:rPr><w:rtl/></w:rPr>';
  return `<w:p><w:pPr><w:bidi/></w:pPr><w:r>${rPr}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function buildDocxAsset(product: ProductItem, buyerId: string): GeneratedAssetFile {
  const isResume = product.tags.some((t) => t.includes('سيرة') || t.includes('CV') || t.includes('ATS')) || product.category === 'students';

  const paragraphs: string[] = isResume
    ? [
        buildDocxParagraph(`منصة رَصين — ${product.title}`, true),
        buildDocxParagraph(`النسخة المرخصة للمستخدم: ${buyerId}`),
        buildDocxParagraph('=================================================='),
        buildDocxParagraph('الاسم الكامل: [الاسم الثلاثي هنا]', true),
        buildDocxParagraph('المسمى الوظيفي المستهدف: [مثال: مدير مالي / مهندس برمجيات / مستشار أعمال]'),
        buildDocxParagraph('بيانات التواصل: [البريد الإلكتروني] | [رقم الجوال] | [المدينة - الدولة]'),
        buildDocxParagraph(''),
        buildDocxParagraph('الملخص المهني (Professional Summary)', true),
        buildDocxParagraph('خبير متخصص يتمتع بخبرة عملية في قيادة المشاريع وتحسين كفاءة العمليات وتحقيق أهداف النمو وفق مؤشرات أداء واضحة.'),
        buildDocxParagraph(''),
        buildDocxParagraph('الخبرات العملية (Experience)', true),
        buildDocxParagraph('• المسمى الوظيفي — اسم الشركة (2023 - حتى الآن): قيادة مبادرات التحول التشغيلي ورفع الإنتاجية بنسبة 30%.'),
        buildDocxParagraph('• المسمى الوظيفي السابق — اسم الشركة (2020 - 2023): إدارة المشاريع والملفات التعاقدية والميزانيات الدورية.'),
        buildDocxParagraph(''),
        buildDocxParagraph('المؤهلات العلمية والمهارات (Education & Skills)', true),
        buildDocxParagraph('• الدرجة العلمية — اسم الجامعة — التقدير وسنة التخرج.'),
        buildDocxParagraph('• المهارات التقنية والإدارية المتوافقة مع أنظمة الفرز الآلي ATS.'),
      ]
    : [
        buildDocxParagraph(`منصة رَصين — ${product.title}`, true),
        buildDocxParagraph(`مرجع الترخيص: ${product.id} | المرخص له: ${buyerId}`),
        buildDocxParagraph('=================================================='),
        buildDocxParagraph('تمهيد ونطاق الاتفاقية:', true),
        buildDocxParagraph(`تم تحرير هذا النموذج للاستخدام العملي بناءً على "${product.title}". ${product.description}`),
        buildDocxParagraph(''),
        buildDocxParagraph('البند الأول: نطاق العمل والتسليمات (Scope of Work)', true),
        buildDocxParagraph('يلتزم الطرف الثاني بتنفيذ المهام والمخرجات المحددة في جدول المواصفات الملحق بهذا العقد وفق المعايير الفنية والجدول الزمني المتفق عليه.'),
        buildDocxParagraph(''),
        buildDocxParagraph('البند الثاني: المقابل المالي وجدول الدفعات', true),
        buildDocxParagraph('يستحق الطرف الثاني المقابل المالي المتفق عليه على مراحل واضحة: (30% دفعة مقدمة عند التوقيع، 40% عند تسليم المسودة الأولى، 30% عند الاعتماد النهائي).'),
        buildDocxParagraph(''),
        buildDocxParagraph('البند الثالث: سرية المعلومات وحماية البيانات (NDA)', true),
        buildDocxParagraph('يلتزم الطرفان بعدم إفشاء أو استغلال أي معلومات تقنية أو تجارية أو مالية أو قوائم عملاء تم الاطلاع عليها خلال سريان هذا العقد أو بعد انتهائه.'),
        buildDocxParagraph(''),
        buildDocxParagraph('البند الرابع: حقوق الملكية الفكرية وتسوية النزاعات', true),
        buildDocxParagraph('تنتقل حقوق الملكية الفكرية للمخرجات المسددة بالكامل للطرف الأول فور استيفاء الدفعات، ويخضع أي خلاف للحل الودي ثم الاختصاص القضائي المتفق عليه.'),
        buildDocxParagraph(''),
        buildDocxParagraph('توقيع الطرف الأول: ___________________    توقيع الطرف الثاني: ___________________', true),
        buildDocxParagraph('ملاحظة: يوصى بمراجعة البنود الخاصة بالحالات التعاقدية الكبرى مع مستشار قانوني مختص في نطاق دولتك.'),
      ];

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphs.join('\n    ')}
    <w:sectPr><w:bidi/></w:sectPr>
  </w:body>
</w:document>`;

  const buffer = buildZipBuffer([
    { name: '[Content_Types].xml', content: contentTypesXml },
    { name: '_rels/.rels', content: rootRelsXml },
    { name: 'word/document.xml', content: documentXml },
  ]);

  return {
    buffer,
    filename: `raseen-${product.id}.docx`,
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
}

function buildDxfDrawingText(product: ProductItem, buyerId: string): string {
  // Valid ASCII AutoCAD DXF (AC1009 / R12 compatible for universal AutoCAD & Revit import)
  return [
    '0', 'SECTION',
    '2', 'HEADER',
    '9', '$ACADVER', '1', 'AC1009',
    '0', 'ENDSEC',
    '0', 'SECTION',
    '2', 'TABLES',
    '0', 'TABLE', '2', 'LAYER', '70', '3',
    '0', 'LAYER', '2', 'A-WALL', '70', '0', '62', '7', '6', 'CONTINUOUS',
    '0', 'LAYER', '2', 'A-GRID', '70', '0', '62', '8', '6', 'CONTINUOUS',
    '0', 'LAYER', '2', 'A-FURN', '70', '0', '62', '3', '6', 'CONTINUOUS',
    '0', 'ENDTAB',
    '0', 'ENDSEC',
    '0', 'SECTION',
    '2', 'ENTITIES',
    // Structural outer room boundary 6000x4500 mm on layer A-WALL
    '0', 'LINE', '8', 'A-WALL', '10', '0.0', '20', '0.0', '11', '6000.0', '21', '0.0',
    '0', 'LINE', '8', 'A-WALL', '10', '6000.0', '20', '0.0', '11', '6000.0', '21', '4500.0',
    '0', 'LINE', '8', 'A-WALL', '10', '6000.0', '20', '4500.0', '11', '0.0', '21', '4500.0',
    '0', 'LINE', '8', 'A-WALL', '10', '0.0', '20', '4500.0', '11', '0.0', '21', '0.0',
    // Architectural gridlines on A-GRID
    '0', 'LINE', '8', 'A-GRID', '10', '-500.0', '20', '2250.0', '11', '6500.0', '21', '2250.0',
    '0', 'LINE', '8', 'A-GRID', '10', '3000.0', '20', '-500.0', '11', '3000.0', '21', '5000.0',
    // Standard dining/conference table circle block on A-FURN
    '0', 'CIRCLE', '8', 'A-FURN', '10', '3000.0', '20', '2250.0', '40', '750.0',
    // Title annotation
    '0', 'TEXT', '8', 'A-WALL', '10', '200.0', '20', '4100.0', '40', '180.0',
    '1', `RASEEN BIM/CAD MODULE - ${product.id.toUpperCase()} - ${buyerId}`,
    '0', 'ENDSEC',
    '0', 'EOF',
  ].join('\n');
}

function buildCadZipAsset(product: ProductItem, buyerId: string): GeneratedAssetFile {
  const dxf = buildDxfDrawingText(product, buyerId);
  const specJson = JSON.stringify(
    {
      platform: 'Raseen Digital Assets',
      productId: product.id,
      title: product.title,
      licensedTo: buyerId,
      lodStandard: product.technicalSpecs?.lodStandard || 'LOD 300 / Standard Layering',
      layers: ['A-WALL', 'A-GRID', 'A-FURN'],
      units: 'Millimeters (mm)',
      compatibleWith: product.technicalSpecs?.compatibility || ['AutoCAD 2018-2026', 'Autodesk Revit', 'LibreCAD'],
    },
    null,
    2
  );

  const buffer = buildZipBuffer([
    { name: `raseen-${product.id}-plan.dxf`, content: dxf },
    { name: `raseen-${product.id}-bim-specs.json`, content: specJson },
  ]);

  return {
    buffer,
    filename: `raseen-${product.id}-cad-bim.zip`,
    contentType: 'application/zip',
  };
}

function buildCanvaDeckZipAsset(product: ProductItem, buyerId: string): GeneratedAssetFile {
  const htmlDeck = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>${escapeXml(product.title)} — رَصين</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0B0F17; color: #F8FAFC; margin: 0; padding: 32px; }
    .slide { max-width: 900px; margin: 0 auto 24px; padding: 40px; border-radius: 20px; background: linear-gradient(135deg, #0F172A, #1E293B); border: 1px solid #334155; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 999px; background: #F5B731; color: #0B0F17; font-weight: 800; font-size: 12px; }
    h1 { color: #F5B731; margin-top: 16px; }
    .palette { display: flex; gap: 12px; margin-top: 20px; }
    .swatch { padding: 12px 18px; border-radius: 10px; font-family: monospace; font-size: 12px; color: #fff; }
  </style>
</head>
<body>
  <section class="slide">
    <span class="badge">RASEEN STUDIO KIT • ${escapeXml(product.id.toUpperCase())}</span>
    <h1>${escapeXml(product.title)}</h1>
    <p>${escapeXml(product.description)}</p>
    <p><strong>المرخص له:</strong> ${escapeXml(buyerId)}</p>
    <div class="palette">
      <div class="swatch" style="background:#0B0F17;border:1px solid #334155">#0B0F17 Obsidian</div>
      <div class="swatch" style="background:#F5B731;color:#0B0F17">#F5B731 Raseen Gold</div>
      <div class="swatch" style="background:#10B981">#10B981 Emerald</div>
      <div class="swatch" style="background:#06B6D4">#06B6D4 Cyan</div>
    </div>
  </section>
  <section class="slide">
    <h2>قوالب المحتوى والعناوين الجاهزة</h2>
    <ul>
      <li>الشريحة 1: العنوان الرئيسي وقيمة العرض (Value Proposition)</li>
      <li>الشريحة 2: المشكلة وحجم السوق المستهدف</li>
      <li>الشريحة 3: الحل، آلية التنفيذ، وخطة الإيرادات</li>
      <li>الشريحة 4: خطة العمل وتوزيع القنوات التسويقية</li>
    </ul>
  </section>
</body>
</html>`;

  const buffer = buildZipBuffer([
    { name: `raseen-${product.id}-template.html`, content: htmlDeck },
    {
      name: 'brand-tokens.json',
      content: JSON.stringify(
        {
          productId: product.id,
          title: product.title,
          licensedTo: buyerId,
          colors: ['#0B0F17', '#1E293B', '#F5B731', '#10B981', '#06B6D4'],
          fonts: ['Cairo', 'IBM Plex Sans Arabic', 'Inter'],
        },
        null,
        2
      ),
    },
  ]);

  return {
    buffer,
    filename: `raseen-${product.id}-studio-kit.zip`,
    contentType: 'application/zip',
  };
}

function buildKnowledgeBundleAsset(product: ProductItem, buyerId: string): GeneratedAssetFile {
  const markdownGuide = [
    `# ${product.title}`,
    ``,
    `- **معرف الأصل:** \`${product.id}\``,
    `- **المرخص له:** ${buyerId}`,
    `- **التصنيف:** ${product.category} (${product.fileType})`,
    ``,
    `## الوصف التنفيذي`,
    product.description,
    ``,
    `## قوالب وهيكلة جاهزة للنسخ والاستخدام المباشر`,
    ``,
    `### 1. موجه / هيكل التحليل الاستراتيجي`,
    `\`\`\`text`,
    `الدور: مستشار أول متخصص في (${product.tags.join(' / ')}).`,
    `المهمة: إعداد خطة تنفيذية مخصصة لـ ${product.title} مع مؤشرات قياس واضحة ومراحل تسليم أسبوعية.`,
    `المخرجات: جدول مهام، مصفوفة مخاطر، وتوصيات عملية قابلة للتنفيذ الفوري.`,
    `\`\`\``,
    ``,
    `### 2. مصفوفة المتابعة (Notion / Workflow CSV Compatible)`,
    `- المرحلة 1: التأسيس وتحديد الأهداف (الأسبوع 1)`,
    `- المرحلة 2: الإطلاق وقياس الأداء (الأسبوع 2-3)`,
    `- المرحلة 3: التحسين والتوسع (الأسبوع 4+)`,
  ].join('\n');

  const jsonPayload = JSON.stringify(
    {
      platform: 'Raseen Digital Assets',
      productId: product.id,
      title: product.title,
      licensedTo: buyerId,
      tags: product.tags,
      promptsAndTemplates: [
        {
          id: `${product.id}-tpl-1`,
          title: 'إعداد خطة التشغيل والتحليل',
          body: `قم ببناء خطة متكاملة اعتماداً على ${product.title} تتضمن جدول الأهداف، الميزانية، ومعايير النجاح.`,
        },
        {
          id: `${product.id}-tpl-2`,
          title: 'مراجعة الأداء وتقليل التكاليف',
          body: 'حلل مؤشرات الأداء الحالية واقترح 5 تحسينات فورية لرفع العائد وتقليل الهدر.',
        },
      ],
    },
    null,
    2
  );

  const buffer = buildZipBuffer([
    { name: `raseen-${product.id}-guide.md`, content: markdownGuide },
    { name: `raseen-${product.id}-templates.json`, content: jsonPayload },
  ]);

  return {
    buffer,
    filename: `raseen-${product.id}-bundle.zip`,
    contentType: 'application/zip',
  };
}

export function generateProductAssetFile(
  productId: string,
  buyerIdentifier = 'عميل رَصين'
): GeneratedAssetFile | null {
  const product = mockProducts.find((p) => p.id === productId);
  if (!product) {
    return null;
  }

  switch (product.fileType) {
    case 'excel':
      return buildXlsxAsset(product, buyerIdentifier);
    case 'word-pdf':
      return buildDocxAsset(product, buyerIdentifier);
    case 'cad-revit':
      return buildCadZipAsset(product, buyerIdentifier);
    case 'canva':
    case 'powerpoint':
      return buildCanvaDeckZipAsset(product, buyerIdentifier);
    case 'notion':
    case 'ai-prompts':
    default:
      return buildKnowledgeBundleAsset(product, buyerIdentifier);
  }
}
