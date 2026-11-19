import crypto from 'crypto';
import {
  DigitalLicense,
  generateDigitalLicense,
  DEFAULT_PROTECTION_TERMS,
} from './licenseEngine';

function getLicenseSecret(): string {
  const secret =
    process.env.LICENSE_SIGNING_SECRET ||
    process.env.DOWNLOAD_TOKEN_SECRET ||
    process.env.NEXTAUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
    throw new Error('LICENSE_SIGNING_SECRET or NEXTAUTH_SECRET is required in production');
  }
  return 'raseen-dev-license-signing-key-local-only';
}

export interface SignedLicensePayload {
  licenseId: string;
  assetId: string;
  assetTitle: string;
  buyerIdentifier: string;
  issuedAt: string;
  licenseType: 'Commercial' | 'Personal' | 'Enterprise';
  verificationHash: string;
  orderId?: string;
}

function signPayloadString(payloadBase64: string): string {
  return crypto
    .createHmac('sha256', getLicenseSecret())
    .update(payloadBase64)
    .digest('base64url');
}

export function issueSignedLicense(params: {
  assetId: string;
  assetTitle: string;
  buyerIdentifier: string;
  licenseType?: 'Commercial' | 'Personal' | 'Enterprise';
  orderId?: string;
}): DigitalLicense {
  const baseLicense = generateDigitalLicense(
    params.assetId,
    params.assetTitle,
    params.buyerIdentifier,
    params.licenseType || 'Commercial'
  );

  const payload: SignedLicensePayload = {
    licenseId: baseLicense.licenseId,
    assetId: baseLicense.assetId,
    assetTitle: baseLicense.assetTitle,
    buyerIdentifier: baseLicense.buyerIdentifier,
    issuedAt: baseLicense.issuedAt,
    licenseType: baseLicense.licenseType,
    verificationHash: baseLicense.verificationHash,
    orderId: params.orderId,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  const signature = signPayloadString(payloadBase64);
  const verificationToken = `${payloadBase64}.${signature}`;

  return {
    ...baseLicense,
    orderId: params.orderId,
    signature,
    verificationToken,
    protectionTerms: [...DEFAULT_PROTECTION_TERMS],
  };
}

export type LicenseVerificationResult =
  | {
      valid: true;
      license: SignedLicensePayload;
      signature: string;
    }
  | {
      valid: false;
      error: string;
      code: 'MALFORMED' | 'INVALID_SIGNATURE';
    };

export function verifySignedLicenseToken(token: string): LicenseVerificationResult {
  try {
    const trimmed = (token || '').trim();
    const parts = trimmed.split('.');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return {
        valid: false,
        error: 'صيغة رمز توثيق الترخيص غير صالحة.',
        code: 'MALFORMED',
      };
    }

    const [payloadBase64, signature] = parts;
    const expectedSig = signPayloadString(payloadBase64);
    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return {
        valid: false,
        error: 'التوقيع الرقمي للترخيص غير صالح أو تم التلاعب بالبيانات.',
        code: 'INVALID_SIGNATURE',
      };
    }

    const decoded = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf-8')
    ) as SignedLicensePayload;

    if (!decoded.licenseId || !decoded.assetId || !decoded.buyerIdentifier || !decoded.issuedAt) {
      return {
        valid: false,
        error: 'بيانات الترخيص غير مكتملة.',
        code: 'MALFORMED',
      };
    }

    return {
      valid: true,
      license: decoded,
      signature,
    };
  } catch {
    return {
      valid: false,
      error: 'تعذر فك تشفير رمز الترخيص.',
      code: 'MALFORMED',
    };
  }
}
