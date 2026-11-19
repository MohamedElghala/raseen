import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { generateDownloadToken } from '@/lib/storage';
import { hashPassword } from '@/lib/passwords';
import { mockProducts } from '@/lib/mockData';
import { convertPrice, EXCHANGE_RATES } from '@/lib/currency';
import { CreateOrderSchema } from '@/lib/validations';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';
import { issueSignedLicense } from '@/lib/licenseServer';

const catalogProductMap = new Map(mockProducts.map((p) => [p.id, p]));

export async function POST(request: NextRequest) {
  const ip = extractClientIp(request);
  const rl = checkRateLimit(`orders:${ip}`, 20, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'تم إرسال عدد كبير من الطلبات، يرجى الانتظار دقيقة.' },
      { status: 429 }
    );
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'بيانات الطلب غير صالحة' },
        { status: 400 }
      );
    }

    const parsed = CreateOrderSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'بيانات الطلب غير مكتملة',
        },
        { status: 400 }
      );
    }

    const { buyerEmail, buyerContact, items, paymentMethod, currency } = parsed.data;
    const rawContact = (buyerEmail || buyerContact || '').trim();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawContact);
    const email = isEmail
      ? rawContact.toLowerCase()
      : `buyer_${rawContact.replace(/[^0-9]/g, '') || Date.now()}@customer.raseen.me`;

    // Reject unknown product IDs instead of silently treating missing products as free (price 0)
    const verifiedItems: Array<{
      id: string;
      title: string;
      priceEGP: number;
      convertedPrice: number;
      license: 'Commercial' | 'Personal' | 'Enterprise';
      quantity: number;
    }> = [];

    for (const item of items) {
      const product = catalogProductMap.get(item.id);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `المنتج غير موجود في الكتالوج: ${item.id}` },
          { status: 400 }
        );
      }
      verifiedItems.push({
        id: product.id,
        title: product.title,
        priceEGP: product.price,
        convertedPrice: convertPrice(product.price, currency, EXCHANGE_RATES),
        license: product.license === 'commercial' ? 'Commercial' : 'Personal',
        quantity: item.quantity,
      });
    }

    const totalAmountEGP = verifiedItems.reduce(
      (sum, item) => sum + item.priceEGP * item.quantity,
      0
    );
    const totalAmount = convertPrice(totalAmountEGP, currency, EXCHANGE_RATES);

    // Paid manual orders start pending; ONLY genuinely $0 orders are immediately completed with download tokens
    const isFreeOrder = totalAmountEGP === 0;
    const initialStatus = isFreeOrder ? 'completed' : 'pending';

    const generatedOrderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const signedLicenses = isFreeOrder
      ? verifiedItems.map((item) =>
          issueSignedLicense({
            assetId: item.id,
            assetTitle: item.title,
            buyerIdentifier: rawContact,
            licenseType: item.license,
            orderId: generatedOrderId,
          })
        )
      : [];

    // Record order in PostgreSQL via Prisma when reachable
    try {
      let buyer = await prisma.user.findUnique({
        where: { email },
      });

      if (!buyer) {
        const guestRandomSecret = crypto.randomBytes(32).toString('hex');
        buyer = await prisma.user.create({
          data: {
            name: isEmail ? rawContact.split('@')[0] : `عميل (${rawContact})`,
            email,
            password: hashPassword(guestRandomSecret),
            role: 'buyer',
          },
        });
      }

      const order = await prisma.order.create({
        data: {
          id: generatedOrderId,
          buyerId: buyer.id,
          totalAmount,
          currency,
          status: initialStatus,
          paymentMethod,
          items: {
            create: verifiedItems.map((item) => ({
              productId: item.id,
              price: item.convertedPrice,
              quantity: item.quantity,
            })),
          },
        },
      });

      const downloadTokens = [];
      if (isFreeOrder) {
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
        for (const item of verifiedItems) {
          const tokenString = crypto.randomBytes(32).toString('hex');
          const tokenRecord = await prisma.downloadToken.create({
            data: {
              token: tokenString,
              productId: item.id,
              userId: buyer.id,
              maxDownloads: 10,
              downloadCount: 0,
              expiresAt,
            },
          });

          downloadTokens.push({
            productId: item.id,
            token: tokenRecord.token,
            downloadUrl: `/api/vault/${encodeURIComponent(item.id)}?token=${encodeURIComponent(tokenRecord.token)}`,
            verifyUrl: `/api/download?token=${encodeURIComponent(tokenRecord.token)}`,
            expiresAt: tokenRecord.expiresAt,
            maxDownloads: 10,
          });
        }
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        totalAmount: order.totalAmount,
        totalAmountEGP,
        currency: order.currency,
        status: order.status,
        tokens: downloadTokens,
        licenses: signedLicenses,
        message: isFreeOrder
          ? 'تم تفعيل روابط التحميل الفورية بنجاح!'
          : 'تم تسجيل طلبك رقمياً بنجاح! بانتظار تأكيد التحويل لتفعيل روابط التنزيل.',
      });
    } catch (dbErr) {
      console.warn('Prisma order write bypassed:', (dbErr as Error).message);
    }

    // Resilient fallback when DB is paused: issue signed tokens ONLY for free orders; keep paid orders strictly pending
    const downloadTokens = isFreeOrder
      ? verifiedItems.map((item) => {
          const token = generateDownloadToken(item.id, email);
          return {
            productId: item.id,
            token,
            downloadUrl: `/api/vault/${encodeURIComponent(item.id)}?token=${encodeURIComponent(token)}`,
            verifyUrl: `/api/download?token=${encodeURIComponent(token)}`,
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            maxDownloads: 10,
          };
        })
      : [];

    return NextResponse.json({
      success: true,
      orderId: generatedOrderId,
      totalAmount,
      totalAmountEGP,
      currency,
      status: initialStatus,
      tokens: downloadTokens,
      licenses: signedLicenses,
      message: isFreeOrder
        ? 'تم تفعيل روابط التحميل الفورية بنجاح'
        : 'تم تسجيل طلبك رقمياً برقم مرجعي، يرجى إرسال إشعار التحويل لتفعيل روابط التنزيل.',
    });
  } catch (error) {
    console.error('Error creating order in /api/orders:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}
