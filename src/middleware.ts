import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Sensitive Leads API GET protection: strict JSON 401 for unauthenticated or non-admin callers
    if (pathname === '/api/leads' && req.method === 'GET' && token?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح بالوصول إلى بيانات العملاء' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Handle authorization explicitly in middleware above so API routes return JSON 401 instead of HTML 307 redirects
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/api/leads'],
};
