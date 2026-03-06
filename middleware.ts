import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Client-side handles auth check in dashboard
  // Just allow all requests through
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
