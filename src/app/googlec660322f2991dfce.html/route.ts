import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('google-site-verification: googlec660322f2991dfce.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
