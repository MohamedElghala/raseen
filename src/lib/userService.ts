import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword } from '@/lib/passwords';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'buyer' | 'vendor' | 'admin';
  avatar?: string | null;
  createdAt: string;
  source: 'supabase' | 'resilient_storage';
}

const FALLBACK_DIR = path.join(process.cwd(), 'data');
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'users_fallback.json');

// Ensure fallback directory exists
function ensureFallbackFile(): Record<string, UserRecord> {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    }
    if (!fs.existsSync(FALLBACK_FILE)) {
      // Seed with initial demo accounts
      const initialUsers: Record<string, UserRecord> = {
        'admin@raseen.me': {
          id: 'usr_admin_001',
          name: 'مدير منصة رَصين',
          email: 'admin@raseen.me',
          password: hashPassword('Raseen@Admin2026!'),
          role: 'admin',
          avatar: null,
          createdAt: new Date().toISOString(),
          source: 'resilient_storage',
        },
        'demo.vendor@raseen.me': {
          id: 'usr_vendor_001',
          name: 'م. كريم محمود (بائع معتمد)',
          email: 'demo.vendor@raseen.me',
          password: hashPassword('Vendor@Pass2026!'),
          role: 'vendor',
          avatar: null,
          createdAt: new Date().toISOString(),
          source: 'resilient_storage',
        },
        'demo.buyer@raseen.me': {
          id: 'usr_buyer_001',
          name: 'سلطان القحطاني',
          email: 'demo.buyer@raseen.me',
          password: hashPassword('Buyer@Pass2026!'),
          role: 'buyer',
          avatar: null,
          createdAt: new Date().toISOString(),
          source: 'resilient_storage',
        },
      };
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8');
      return initialUsers;
    }
    const raw = fs.readFileSync(FALLBACK_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Fallback user file read warning:', err);
    return {};
  }
}

function saveFallbackUsers(users: Record<string, UserRecord>): void {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    }
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Fallback user file write warning:', err);
  }
}

// Timeout helper for Prisma calls
function withTimeout<T>(promise: Promise<T>, timeoutMs = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), timeoutMs)
    ),
  ]);
}

/**
 * Resilient lookup: tries Supabase first; if offline, checks fallback storage
 */
export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const cleanEmail = email.toLowerCase().trim();

  // 1. Try Supabase via Prisma
  try {
    const dbUser = await withTimeout(
      prisma.user.findUnique({
        where: { email: cleanEmail },
      }),
      2500
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
    console.warn('Supabase lookup bypassed, checking resilient fallback store:', (err as Error).message);
  }

  // 2. Check local fallback file
  const fallbackUsers = ensureFallbackFile();
  if (fallbackUsers[cleanEmail]) {
    return fallbackUsers[cleanEmail];
  }

  return null;
}

/**
 * Resilient creation: stores in Supabase if reachable, mirrors to fallback file
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
  const hashedPassword = data.password ? (data.password.includes(':') ? data.password : hashPassword(data.password)) : '';

  // 1. Try creating in Supabase
  try {
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
      3000
    );

    const record: UserRecord = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      password: dbUser.password,
      role: (dbUser.role as any) || 'buyer',
      avatar: dbUser.avatar,
      createdAt: dbUser.createdAt.toISOString(),
      source: 'supabase',
    };

    // Mirror to local cache for instant zero-latency future lookups
    const fallbackUsers = ensureFallbackFile();
    fallbackUsers[cleanEmail] = record;
    saveFallbackUsers(fallbackUsers);

    return record;
  } catch (err) {
    console.warn('Supabase write unavailable, creating in resilient storage:', (err as Error).message);
  }

  // 2. Fallback creation
  const fallbackUsers = ensureFallbackFile();
  const newId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  const record: UserRecord = {
    id: newId,
    name: data.name.trim(),
    email: cleanEmail,
    password: hashedPassword,
    role: assignedRole,
    avatar: data.avatar || null,
    createdAt: new Date().toISOString(),
    source: 'resilient_storage',
  };

  fallbackUsers[cleanEmail] = record;
  saveFallbackUsers(fallbackUsers);
  return record;
}
