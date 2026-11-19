import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  validateDownloadToken,
  verifyVaultTicket,
} from '@/lib/storage';
import { createR2PresignedUrl, isR2Configured } from '@/lib/r2Signer';
import { generateProductAssetFile } from '@/lib/assetVaultGenerator';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const ip = extractClientIp(request);
  const rl = checkRateLimit(`vault:${ip}`, 30, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'تم تجاوز الحد المسموح لمحاولات التحميل، يرجى الانتظار دقيقة.' },
      { status: 429 }
    );
  }

  const { productId } = await context.params;
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const ticket = searchParams.get('ticket');

  if (!productId) {
    return NextResponse.json({ error: 'معرف المنتج غير صالح' }, { status: 400 });
  }

  if (!token && !ticket) {
    return NextResponse.json(
      { error: 'يلزم رمز أو تذكرة تحميل صالحة للوصول إلى الملف' },
      { status: 401 }
    );
  }

  let authorizedUserId = 'عميل رَصين';

  if (ticket) {
    const ticketCheck = verifyVaultTicket(ticket, productId);
    if (!ticketCheck.valid) {
      return NextResponse.json({ error: ticketCheck.error }, { status: 403 });
    }
    authorizedUserId = ticketCheck.userId;
  } else if (token) {
    let dbValidated = false;

    try {
      const dbToken = await prisma.downloadToken.findUnique({
        where: { token },
      });

      if (dbToken) {
        if (dbToken.productId !== productId) {
          return NextResponse.json(
            { error: 'الرمز لا يطابق المنتج المطلوب' },
            { status: 403 }
          );
        }
        if (new Date() > dbToken.expiresAt) {
          return NextResponse.json(
            { error: 'انتهت صلاحية رابط التنزيل (أكثر من 48 ساعة)' },
            { status: 403 }
          );
        }
        if (dbToken.downloadCount >= dbToken.maxDownloads) {
          return NextResponse.json(
            { error: 'تم استنفاد الحد الأقصى المسموح به للتنزيل (10 مرات)' },
            { status: 403 }
          );
        }

        const updated = await prisma.downloadToken.update({
          where: { token },
          data: { downloadCount: { increment: 1 } },
        });
        authorizedUserId = updated.userId;
        dbValidated = true;
      }
    } catch {
      // Fall back to stateless HMAC token validation below
    }

    if (!dbValidated) {
      const hmacCheck = validateDownloadToken(token, { increment: true });
      if (!hmacCheck.valid) {
        return NextResponse.json(
          { error: hmacCheck.error, code: hmacCheck.code },
          { status: 403 }
        );
      }
      if (hmacCheck.productId !== productId) {
        return NextResponse.json(
          { error: 'الرمز لا يطابق المنتج المطلوب' },
          { status: 403 }
        );
      }
      authorizedUserId = hmacCheck.userId;
    }
  }

  // Optional Cloudflare R2 $0-egress presigned redirect when configured
  if (isR2Configured()) {
    const r2Url = createR2PresignedUrl(`products/${productId}.zip`, 300);
    if (r2Url) {
      return NextResponse.redirect(r2Url, { status: 302 });
    }
  }

  const generatedFile = generateProductAssetFile(productId, authorizedUserId);
  if (!generatedFile) {
    return NextResponse.json(
      { error: 'الأصل الرقمي المطلوب غير موجود في المستودع' },
      { status: 404 }
    );
  }

  return new NextResponse(new Uint8Array(generatedFile.buffer), {
    status: 200,
    headers: {
      'Content-Type': generatedFile.contentType,
      'Content-Disposition': `attachment; filename="${generatedFile.filename}"`,
      'Content-Length': String(generatedFile.buffer.length),
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
