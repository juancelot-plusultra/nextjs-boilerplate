import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/signup', '/onboarding', '/auth', '/get-started'];
const protectedRoutes = ['/member', '/me', '/dashboard', '/payments'];

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Get the auth session cookie (Supabase sets this)
  const sessionCookie = request.cookies.get('sb-session')?.value;

  // If trying to access protected route without auth, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If already logged in and trying to access login/signup, redirect to dashboard
  if ((pathname === '/login' || pathname === '/signup') && sessionCookie) {
    return NextResponse.redirect(new URL('/member/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg).*)',
  ],
};
