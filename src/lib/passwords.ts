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
  if (!password || password.length < 10) {
    return {
      score: 0,
      label: 'ضعيفة جداً',
      color: '#ef4444',
      isValid: false,
      message: 'يجب أن تكون كلمة المرور 10 أحرف على الأقل',
    };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  let score = 0;
  if (password.length >= 10) score += 1;
  if (hasLower && hasUpper) score += 1;
  if (hasDigit) score += 1;
  if (hasSpecial) score += 1;

  if (!hasLower || !hasUpper || !hasDigit || !hasSpecial) {
    return {
      score: Math.min(score, 2),
      label: score <= 1 ? 'ضعيفة' : 'متوسطة',
      color: score <= 1 ? '#f87171' : '#fbbf24',
      isValid: false,
      message: 'يجب أن تحتوي كلمة المرور على حرف كبير، حرف صغير، رقم، ورمز خاص (!@#$)',
    };
  }

  if (password.length >= 14) {
    return { score: 4, label: 'قوية جداً', color: '#10b981', isValid: true };
  }

  return { score: 3, label: 'قوية', color: '#34d399', isValid: true };
}
