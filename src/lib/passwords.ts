import crypto from 'crypto';

/**
 * Hash a password using native crypto.scrypt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a password against a salt:hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, key] = storedHash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

/**
 * Validate password strength
 */
export function checkPasswordStrength(password: string): {
  score: number; // 0 to 4
  label: 'ضعيفة جداً' | 'ضعيفة' | 'متوسطة' | 'قوية' | 'قوية جداً';
  color: string;
  isValid: boolean;
  message?: string;
} {
  if (!password || password.length < 6) {
    return { score: 0, label: 'ضعيفة جداً', color: '#ef4444', isValid: false, message: 'يجب أن تكون 6 أحرف على الأقل' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[a-zA-Z]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { score: 1, label: 'ضعيفة', color: '#f87171', isValid: false, message: 'يُفضل إضافة أرقام وحروف كبيرة' };
  } else if (score === 2) {
    return { score: 2, label: 'متوسطة', color: '#fbbf24', isValid: true };
  } else if (score === 3) {
    return { score: 3, label: 'قوية', color: '#34d399', isValid: true };
  } else {
    return { score: 4, label: 'قوية جداً', color: '#10b981', isValid: true };
  }
}
