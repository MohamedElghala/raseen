import crypto from 'crypto';
import { createR2PresignedUrl, isR2Configured } from './r2Signer';

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

interface VaultTicketPayload {
  productId: string;
  userId: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

const tokenRegistry = new Map<string, TokenState>();
const consumedTickets = new Set<string>();

function getSecretKey(): string {
  const key = process.env.DOWNLOAD_TOKEN_SECRET || process.env.NEXTAUTH_SECRET;
  if (key) return key;
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
    throw new Error('DOWNLOAD_TOKEN_SECRET is required in production');
  }
  return 'raseen-dev-signing-key-local-only';
}

const EXPIRY_HOURS = 48;
const MAX_ALLOWED_DOWNLOADS = 10;
const TICKET_TTL_MS = 5 * 60 * 1000;

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
    .createHmac('sha256', getSecretKey())
    .update(payloadString)
    .digest('base64url');

  const fullToken = `${payloadString}.${signature}`;
  tokenRegistry.set(fullToken, { downloadsCount: 0 });
  return fullToken;
}

export function createVaultTicket(productId: string, userId: string): string {
  const now = Date.now();
  const payload: VaultTicketPayload = {
    productId,
    userId,
    issuedAt: now,
    expiresAt: now + TICKET_TTL_MS,
    nonce: crypto.randomBytes(12).toString('hex'),
  };
  const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSecretKey())
    .update(`ticket:${payloadString}`)
    .digest('base64url');
  return `${payloadString}.${signature}`;
}

export function verifyVaultTicket(
  ticket: string,
  expectedProductId: string
): { valid: true; productId: string; userId: string } | { valid: false; error: string } {
  try {
    const parts = (ticket || '').split('.');
    if (parts.length !== 2) {
      return { valid: false, error: 'صيغة تذكرة التنزيل غير صالحة' };
    }
    const [payloadString, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', getSecretKey())
      .update(`ticket:${payloadString}`)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return { valid: false, error: 'تذكرة التنزيل غير موثقة' };
    }

    const payload = JSON.parse(
      Buffer.from(payloadString, 'base64url').toString('utf8')
    ) as VaultTicketPayload;

    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'انتهت صلاحية تذكرة التنزيل' };
    }
    if (payload.productId !== expectedProductId) {
      return { valid: false, error: 'تذكرة التنزيل لا تطابق المنتج المطلوب' };
    }
    if (consumedTickets.has(payload.nonce)) {
      return { valid: false, error: 'تم استخدام تذكرة التنزيل بالفعل' };
    }

    consumedTickets.add(payload.nonce);
    if (consumedTickets.size > 2000) {
      const oldest = consumedTickets.values().next().value;
      if (oldest) consumedTickets.delete(oldest);
    }

    return { valid: true, productId: payload.productId, userId: payload.userId };
  } catch {
    return { valid: false, error: 'تعذر التحقق من تذكرة التنزيل' };
  }
}

export function resolveVaultDeliveryUrl(productId: string, ticketOrToken: string, isTicket = false): string {
  if (isR2Configured()) {
    const signedR2 = createR2PresignedUrl(`products/${productId}.zip`, 300);
    if (signedR2) return signedR2;
  }
  const param = isTicket ? 'ticket' : 'token';
  return `/api/vault/${encodeURIComponent(productId)}?${param}=${encodeURIComponent(ticketOrToken)}`;
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

export function validateDownloadToken(
  token: string,
  options: { increment?: boolean } = {}
): TokenValidation {
  const { increment = true } = options;
  try {
    const parts = (token || '').split('.');
    if (parts.length !== 2) {
      return { valid: false, error: 'صيغة رمز التحميل غير صالحة', code: 'MALFORMED' };
    }

    const [payloadString, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', getSecretKey())
      .update(payloadString)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expectedSigBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expectedSigBuf.length || !crypto.timingSafeEqual(sigBuf, expectedSigBuf)) {
      return { valid: false, error: 'رمز التحميل غير موثق أو تم العبث به', code: 'INVALID_SIGNATURE' };
    }

    const payload: TokenPayload = JSON.parse(
      Buffer.from(payloadString, 'base64url').toString('utf-8')
    );

    const now = Date.now();
    if (now > payload.expiresAt) {
      return { valid: false, error: 'انتهت صلاحية رابط التحميل (48 ساعة)', code: 'EXPIRED' };
    }

    const state = tokenRegistry.get(token) || { downloadsCount: 0 };

    if (state.downloadsCount >= payload.maxDownloads) {
      return {
        valid: false,
        error: `تم استنفاد الحد الأقصى لمرات التنزيل المسموح بها (${payload.maxDownloads} مرات)`,
        code: 'LIMIT_REACHED',
      };
    }

    if (increment) {
      state.downloadsCount += 1;
      state.lastDownloadedAt = now;
      tokenRegistry.set(token, state);
    }

    const remaining = payload.maxDownloads - state.downloadsCount;
    const expiresInHours = Math.max(0, Math.round((payload.expiresAt - now) / (1000 * 60 * 60)));

    const ticket = createVaultTicket(payload.productId, payload.userId);
    const directDownloadUrl = resolveVaultDeliveryUrl(payload.productId, ticket, true);

    return {
      valid: true,
      productId: payload.productId,
      userId: payload.userId,
      remaining,
      expiresInHours,
      directDownloadUrl,
    };
  } catch {
    return { valid: false, error: 'فشل في قراءة رمز التنزيل', code: 'MALFORMED' };
  }
}
