import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { verifyPaymobHMAC } from '@/lib/paymob';

export async function POST(request: NextRequest) {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (!hmacSecret) {
    return NextResponse.json(
      { success: false, error: 'Paymob gateway is not configured on this environment.' },
      { status: 503 }
    );
  }

  try {
    const queryHmac = request.nextUrl.searchParams.get('hmac');
    const body = await request.json();
    const obj = body?.obj;

    if (!obj || typeof obj !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid Paymob payload' }, { status: 400 });
    }

    const flattened = {
      amount_cents: obj.amount_cents,
      created_at: obj.created_at,
      currency: obj.currency,
      error_occured: obj.error_occured,
      has_parent_transaction: obj.has_parent_transaction,
      id: obj.id,
      integration_id: obj.integration_id,
      is_3d_secure: obj.is_3d_secure,
      is_auth: obj.is_auth,
      is_capture: obj.is_capture,
      is_refunded: obj.is_refunded,
      is_standalone_payment: obj.is_standalone_payment,
      is_voided: obj.is_voided,
      order: obj.order?.id ?? obj.order,
      owner: obj.owner,
      pending: obj.pending,
      source_data_pan: obj.source_data?.pan ?? '',
      source_data_sub_type: obj.source_data?.sub_type ?? '',
      source_data_type: obj.source_data?.type ?? '',
      success: obj.success,
      hmac: queryHmac || body?.hmac,
    };

    if (!verifyPaymobHMAC(flattened, hmacSecret)) {
      return NextResponse.json({ success: false, error: 'Invalid HMAC signature' }, { status: 401 });
    }

    const merchantOrderId = obj.order?.merchant_order_id;
    const isPaid = Boolean(obj.success) && !obj.pending && !obj.is_voided && !obj.is_refunded;

    if (merchantOrderId && isPaid) {
      const order = await prisma.order.findUnique({
        where: { id: String(merchantOrderId) },
        include: { items: true },
      });

      if (order && order.status !== 'completed') {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'completed', paymentMethod: 'paymob' },
        });

        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
        for (const item of order.items) {
          await prisma.downloadToken.create({
            data: {
              token: crypto.randomBytes(32).toString('hex'),
              productId: item.productId,
              userId: order.buyerId,
              maxDownloads: 10,
              downloadCount: 0,
              expiresAt,
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Paymob webhook error:', err);
    return NextResponse.json({ success: false, error: 'Webhook processing error' }, { status: 500 });
  }
}
