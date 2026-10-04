import crypto from 'crypto';

interface TokenPayload {
  productId: string;
  userId: string;
  issuedAt: number;
  expiresAt: number;
  maxDownloads: number;
}

interface TokenState {
  downloadsCount: number;
  lastDownloadedAt?: number;
}

// In-memory token tracker (in production, syncs with Redis or Supabase)
const tokenRegistry = new Map<string, TokenState>();

const SECRET_KEY = process.env.DOWNLOAD_TOKEN_SECRET || 'rawnaq-secure-jwt-signing-key-2026';
const EXPIRY_HOURS = 48;
const MAX_ALLOWED_DOWNLOADS = 10;

/**
 * Generates a tamper-proof signed download token
 */
export function generateDownloadToken(productId: string, userId: string = 'guest-buyer'): string {
  const now = Date.now();
  const payload: TokenPayload = {
    productId,
    userId,
    issuedAt: now,
    expiresAt: now + EXPIRY_HOURS * 60 * 60 * 1000,
    maxDownloads: MAX_ALLOWED_DOWNLOADS,
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payloadString)
    .digest('base64url');

  const fullToken = `${payloadString}.${signature}`;

  // Initialize registry entry
  tokenRegistry.set(fullToken, {
    downloadsCount: 0,
  });

  return fullToken;
}

export type TokenValidation =
  | {
      valid: true;
      productId: string;
      userId: string;
      remaining: number;
      expiresInHours: number;
      directDownloadUrl: string;
    }
  | {
      valid: false;
      error: string;
      code: 'EXPIRED' | 'LIMIT_REACHED' | 'INVALID_SIGNATURE' | 'MALFORMED';
    };

/**
 * Validates a signed download token and enforces quota limits
 */
export function validateDownloadToken(token: string): TokenValidation {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false, error: 'صيغة رمز التحميل غير صالحة', code: 'MALFORMED' };
    }

    const [payloadString, signature] = parts;

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payloadString)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return { valid: false, error: 'رمز التحميل غير موثق أو تم العبث به', code: 'INVALID_SIGNATURE' };
    }

    const payload: TokenPayload = JSON.parse(
      Buffer.from(payloadString, 'base64url').toString('utf-8')
    );

    const now = Date.now();
    if (now > payload.expiresAt) {
      return { valid: false, error: 'انتهت صلاحية رابط التحميل (48 ساعة)', code: 'EXPIRED' };
    }

    // Check registry download count
    const state = tokenRegistry.get(token) || { downloadsCount: 0 };

    if (state.downloadsCount >= payload.maxDownloads) {
      return {
        valid: false,
        error: `تم استنفاد الحد الأقصى لمرات التنزيل المسموح بها (${payload.maxDownloads} مرات)`,
        code: 'LIMIT_REACHED',
      };
    }

    // Increment download count
    state.downloadsCount += 1;
    state.lastDownloadedAt = now;
    tokenRegistry.set(token, state);

    const remaining = payload.maxDownloads - state.downloadsCount;
    const expiresInHours = Math.round((payload.expiresAt - now) / (1000 * 60 * 60));

    // Simulated Cloudflare R2 / S3 Pre-signed URL
    const directDownloadUrl = `https://storage.rawnaq.store/vault/${payload.productId}/${payload.userId}.zip?signed=${signature}`;

    return {
      valid: true,
      productId: payload.productId,
      userId: payload.userId,
      remaining,
      expiresInHours,
      directDownloadUrl,
    };
  } catch (err) {
    return { valid: false, error: 'فشل في قراءة رمز التنزيل', code: 'MALFORMED' };
  }
}
