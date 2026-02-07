import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // DEV: 개발 환경에서 인증 우회 (테스트용)
  const bypassAuth = process.env.NODE_ENV === "development" && process.env.DEV_BYPASS_AUTH === "true";

  // Protect /admin routes
  if (pathname.startsWith("/admin") && !bypassAuth) {
    if (!req.auth?.user) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    if (req.auth.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
