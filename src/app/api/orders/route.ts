import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerEmail, items, paymentMethod, currency = 'EGP' } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'قائمة المنتجات فارغة' },
        { status: 400 }
      );
    }

    // 1. Find or create buyer user
    const email = buyerEmail || 'buyer@raseen.com';
    let buyer = await prisma.user.findUnique({
      where: { email },
    });

    if (!buyer) {
      buyer = await prisma.user.create({
        data: {
          name: 'عميل رَصِين',
          email,
          password: 'temp_guest_pass',
          role: 'buyer',
        },
      });
    }

    // 2. Calculate Total Amount
    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity?: number }) =>
        sum + item.price * (item.quantity || 1),
      0
    );

    // 3. Create Order & OrderItems in Database
    const order = await prisma.order.create({
      data: {
        buyerId: buyer.id,
        totalAmount,
        currency,
        status: 'completed',
        paymentMethod: paymentMethod || 'card',
        items: {
          create: items.map((item: { id: string; price: number; quantity?: number }) => ({
            productId: item.id,
            price: item.price,
            quantity: item.quantity || 1,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // 4. Generate Encrypted Download Tokens in Database
    const downloadTokens = [];
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

    for (const item of items) {
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
        downloadUrl: `/api/download?token=${tokenRecord.token}`,
        expiresAt: tokenRecord.expiresAt,
        maxDownloads: 10,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      totalAmount: order.totalAmount,
      currency: order.currency,
      tokens: downloadTokens,
      message: 'تم تسجيل الطلب وتوليد الروابط المشفرة بنجاح',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حفظ الطلب في قاعدة البيانات' },
      { status: 500 }
    );
  }
}
