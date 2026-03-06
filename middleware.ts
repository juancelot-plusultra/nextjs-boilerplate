import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Redirect to login if trying to access /member routes
  if (request.nextUrl.pathname.startsWith('/member')) {
    // The client-side will handle auth check
    // Just allow the request through
  }
  
  return NextResponse.next(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
