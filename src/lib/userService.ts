import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/passwords';

export class DatabaseUnavailableError extends Error {
  constructor(message = 'Database service temporarily unavailable') {
    super(message);
    this.name = 'DatabaseUnavailableError';
  }
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'buyer' | 'vendor' | 'admin';
  avatar?: string | null;
  createdAt: string;
  source: 'supabase';
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), timeoutMs)
    ),
  ]);
}

/**
 * Find user by email directly from Supabase PostgreSQL via Prisma.
 * No hardcoded admin credentials or insecure fallback files.
 */
export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const cleanEmail = email.toLowerCase().trim();

  try {
    const dbUser = await withTimeout(
      prisma.user.findUnique({
        where: { email: cleanEmail },
      }),
      4000
    );

    if (dbUser) {
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        password: dbUser.password,
        role: (dbUser.role as any) || 'buyer',
        avatar: dbUser.avatar,
        createdAt: dbUser.createdAt.toISOString(),
        source: 'supabase',
      };
    }
  } catch (err) {
    console.error('Database user lookup error:', (err as Error).message);
    throw new DatabaseUnavailableError((err as Error).message);
  }

  return null;
}

/**
 * Create user in Supabase PostgreSQL via Prisma.
 */
export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  role?: 'buyer' | 'vendor' | 'admin';
  avatar?: string | null;
}): Promise<UserRecord> {
  const cleanEmail = data.email.toLowerCase().trim();
  const assignedRole = data.role || 'buyer';
  const hashedPassword = data.password
    ? (data.password.includes(':') ? data.password : hashPassword(data.password))
    : '';

  const dbUser = await withTimeout(
    prisma.user.create({
      data: {
        name: data.name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: assignedRole,
        avatar: data.avatar || null,
      },
    }),
    5000
  );

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    password: dbUser.password,
    role: (dbUser.role as any) || 'buyer',
    avatar: dbUser.avatar,
    createdAt: dbUser.createdAt.toISOString(),
    source: 'supabase',
  };
}
