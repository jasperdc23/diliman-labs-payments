import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth/session";

/**
 * Route protection for the prototype's auth (see src/lib/auth/session.ts).
 * Optimistic check only — reads the session cookie's signature, no DB — per
 * node_modules/next/dist/docs/01-app/02-guides/authentication.md
 * ("Optimistic checks with Proxy"). `middleware.ts` is deprecated as of
 * Next.js 16 and renamed to `proxy.ts`; see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isLoginRoute = pathname === "/login";

  if (!isProtectedRoute && !isLoginRoute) {
    return NextResponse.next();
  }

  const session = await verifySession();

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/login"],
};
