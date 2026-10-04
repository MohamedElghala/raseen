import { NextRequest, NextResponse } from 'next/server';
import { validateDownloadToken } from '@/lib/storage';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

        // Increment count
        const updated = await prisma.downloadToken.update({
          where: { token },
          data: { downloadCount: { increment: 1 } },
        });

        const remaining = updated.maxDownloads - updated.downloadCount;

        return NextResponse.json({
          success: true,
          message: 'تم التحقق من رخصة التنزيل من قاعدة البيانات بنجاح',
          productId: updated.productId,
          userId: updated.userId,
          downloadCount: updated.downloadCount,
          remainingDownloads: remaining,
          expiresAt: updated.expiresAt,
          directDownloadUrl: `https://storage.raseen.store/vault/${updated.productId}.zip?vault_auth=granted`,
        });
      }
    } catch (dbErr) {
      console.warn('Database token check fallback:', dbErr);
    }

    // 2. Fallback to Cryptographic HMAC Token
    const result = validateDownloadToken(token);

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
