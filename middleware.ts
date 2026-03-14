import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Just pass through all requests
  // Auth is handled client-side and in API routes
  return NextResponse.next({
    request,
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
