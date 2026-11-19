import { NextRequest, NextResponse } from 'next/server';
import { verifySignedLicenseToken } from '@/lib/licenseServer';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';
import { VerifyLicenseSchema } from '@/lib/validations';
import { mockProducts } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  const ip = extractClientIp(request);
  const rl = checkRateLimit(`verify:${ip}`, 40, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { valid: false, error: 'تم تجاوز الحد المسموح لطلبات التحقق، يرجى المحاولة بعد دقيقة.' },
      { status: 429 }
    );
  }

  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json(
      { valid: false, error: 'يرجى تزويد رمز التحقق (token) للتحقق من الترخيص.' },
      { status: 400 }
    );
  }

  const result = verifySignedLicenseToken(token);
  if (!result.valid) {
    return NextResponse.json(
      { valid: false, error: result.error, code: result.code },
      { status: 404 }
    );
  }

  const catalogProduct = mockProducts.find((p) => p.id === result.license.assetId);

  return NextResponse.json({
    valid: true,
    verifiedAt: new Date().toISOString(),
    license: result.license,
    productExistsInCatalog: Boolean(catalogProduct),
    productCategory: catalogProduct?.category || null,
  });
}

export async function POST(request: NextRequest) {
  const ip = extractClientIp(request);
  const rl = checkRateLimit(`verify:${ip}`, 40, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { valid: false, error: 'تم تجاوز الحد المسموح لطلبات التحقق، يرجى المحاولة بعد دقيقة.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = VerifyLicenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { valid: false, error: parsed.error.issues[0]?.message || 'بيانات غير صالحة' },
        { status: 400 }
      );
    }

    if (!parsed.data.token) {
      return NextResponse.json(
        {
          valid: false,
          error: 'يرجى إدخال رمز التوثيق المشفر الكامل الصادر من منصة رَصين.',
        },
        { status: 400 }
      );
    }

    const result = verifySignedLicenseToken(parsed.data.token);
    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error, code: result.code },
        { status: 404 }
      );
    }

    const catalogProduct = mockProducts.find((p) => p.id === result.license.assetId);

    return NextResponse.json({
      valid: true,
      verifiedAt: new Date().toISOString(),
      license: result.license,
      productExistsInCatalog: Boolean(catalogProduct),
      productCategory: catalogProduct?.category || null,
    });
  } catch {
    return NextResponse.json(
      { valid: false, error: 'صيغة الطلب غير صالحة.' },
      { status: 400 }
    );
  }
}
