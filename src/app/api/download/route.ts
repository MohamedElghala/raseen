import { NextRequest, NextResponse } from 'next/server';
import {
  createVaultTicket,
  resolveVaultDeliveryUrl,
  validateDownloadToken,
} from '@/lib/storage';
import prisma from '@/lib/prisma';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  const ip = extractClientIp(request);
  const rl = checkRateLimit(`download:${ip}`, 30, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'تم تجاوز الحد المسموح للطلبات، يرجى الانتظار دقيقة.' },
      { status: 429 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'الرابط غير صحيح أو مفقود (Missing token)' },
        { status: 400 }
      );
    }

    // 1. Check in Database (DownloadToken table)
    try {
      const dbToken = await prisma.downloadToken.findUnique({
        where: { token },
      });

      if (dbToken) {
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

        const remaining = updated.maxDownloads - updated.downloadCount;
        const ticket = createVaultTicket(updated.productId, updated.userId);
        const directDownloadUrl = resolveVaultDeliveryUrl(updated.productId, ticket, true);

        return NextResponse.json({
          success: true,
          message: 'تم التحقق من رخصة التنزيل من قاعدة البيانات بنجاح',
          productId: updated.productId,
          userId: updated.userId,
          downloadCount: updated.downloadCount,
          remainingDownloads: remaining,
          expiresAt: updated.expiresAt,
          directDownloadUrl,
        });
      }
    } catch (dbErr) {
      console.warn('Database token check fallback:', dbErr);
    }

    // 2. Fallback to Cryptographic HMAC Token
    const result = validateDownloadToken(token, { increment: true });

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error, code: result.code },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم التحقق من صلاحية التنزيل المشفر بنجاح',
      productId: result.productId,
      userId: result.userId,
      remainingDownloads: result.remaining,
      expiresInHours: result.expiresInHours,
      directDownloadUrl: result.directDownloadUrl,
    });
  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع أثناء فحص صلاحية التنزيل' },
      { status: 500 }
    );
  }
}
