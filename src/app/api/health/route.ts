import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'connected';
  let latencyMs = 0;

  try {
    // 2.5 second timeout check to prevent thread blocking on paused Supabase free tier
    const dbPromise = prisma.$queryRaw`SELECT 1`;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database ping timeout')), 2500)
    );

    await Promise.race([dbPromise, timeoutPromise]);
    latencyMs = Date.now() - startTime;
  } catch (err: any) {
    dbStatus = 'paused_or_unreachable';
    latencyMs = Date.now() - startTime;
    console.warn('Health check: Remote database is unreachable or paused. Graceful fallback active.', err.message);
  }

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      latencyMs,
      resilience: 'active_in_memory_and_local_storage_fallbacks',
    },
    version: '2.4.0',
    platform: 'Raseen Sovereign Digital Assets',
  });
}
