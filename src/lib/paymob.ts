import crypto from 'crypto';

export interface CommissionBreakdown {
  totalAmountEGP: number;
  platformFeeEGP: number; // 15%
  vendorNetEGP: number;   // 85%
  estimatedGatewayFeeEGP: number; // ~2.75% + 3 EGP
  netPlatformProfitEGP: number;
}

/**
 * Calculates marketplace 15%/85% commission split and estimated gateway fees
 */
export function calculateMarketplaceSplit(totalAmountEGP: number): CommissionBreakdown {
  const platformFee = Math.round(totalAmountEGP * 0.15 * 100) / 100;
  const vendorNet = Math.round((totalAmountEGP - platformFee) * 100) / 100;

  // Paymob standard tier: 2.75% + 3 EGP per transaction
  const estimatedGatewayFee = Math.round((totalAmountEGP * 0.0275 + 3) * 100) / 100;
  const netPlatformProfit = Math.round((platformFee - estimatedGatewayFee) * 100) / 100;

  return {
    totalAmountEGP,
    platformFeeEGP: platformFee,
    vendorNetEGP: vendorNet,
    estimatedGatewayFeeEGP: estimatedGatewayFee,
    netPlatformProfitEGP: Math.max(0, netPlatformProfit),
  };
}

/**
 * Validates Paymob Webhook transaction HMAC signature
 */
export function verifyPaymobHMAC(queryObj: Record<string, any>, hmacSecret: string): boolean {
  try {
    const receivedHmac = queryObj.hmac;
    if (!receivedHmac) return false;

    // Keys mandated by Paymob documentation in exact order
    const keys = [
      'amount_cents',
      'created_at',
      'currency',
      'error_occured',
      'has_parent_transaction',
      'id',
      'integration_id',
      'is_3d_secure',
      'is_auth',
      'is_capture',
      'is_refunded',
      'is_standalone_payment',
      'is_voided',
      'order',
      'owner',
      'pending',
      'source_data_pan',
      'source_data_sub_type',
      'source_data_type',
      'success',
    ];

    const concatenatedString = keys.map((k) => queryObj[k] ?? '').join('');

    const calculatedHmac = crypto
      .createHmac('sha512', hmacSecret)
      .update(concatenatedString)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(receivedHmac), Buffer.from(calculatedHmac));
  } catch (err) {
    return false;
  }
}
