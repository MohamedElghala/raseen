import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pass-through middleware for headers / logging
  // Route authentication is gracefully handled in client dashboard & vendor pages
  const response = NextResponse.next();
  response.headers.set('x-rawnaq-platform', 'v2');
  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/vendor/:path*',
  ],
};
