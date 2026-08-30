import { NextResponse, type NextRequest } from 'next/server'

// Auth is handled client-side by AdminGuard (components/admin/AdminGuard.tsx).
// Supabase stores sessions in localStorage on the browser, which is not
// accessible server-side via cookies, so proxy-level auth checks would
// always see "no session" and redirect in a loop.
export function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
