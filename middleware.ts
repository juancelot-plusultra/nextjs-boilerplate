import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // For now, just pass through the request
  // Add authentication logic here as needed
  return NextResponse.next({
    request,
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
