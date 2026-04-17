import { NextRequest, NextResponse } from "next/server";

const ADMIN_HOST = "admin.pskim.biz";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const isAdminDomain = hostname.startsWith("admin.");

  // admin.pskim.biz 서브도메인 처리
  if (isAdminDomain) {
    const authCookie = request.cookies.get("admin_auth");
    const isAuthenticated = authCookie?.value === "authenticated";

    // 루트 → 대시보드 또는 로그인으로 리다이렉트
    if (pathname === "/") {
      const target = isAuthenticated ? "/dashboard" : "/admin-login";
      return NextResponse.redirect(new URL(target, request.url));
    }

    // /dashboard 보호
    if (pathname.startsWith("/dashboard") && !isAuthenticated) {
      const loginUrl = new URL("/admin-login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // admin-login, dashboard, api는 허용, 나머지 공개 페이지는 메인 도메인으로
    if (
      !pathname.startsWith("/admin-login") &&
      !pathname.startsWith("/dashboard") &&
      !pathname.startsWith("/api/") &&
      !pathname.startsWith("/_next")
    ) {
      return NextResponse.redirect(new URL(pathname, `https://pskim.biz`));
    }

    return NextResponse.next();
  }

  // 메인 도메인: /dashboard 보호
  if (pathname.startsWith("/dashboard")) {
    const authCookie = request.cookies.get("admin_auth");
    if (authCookie?.value !== "authenticated") {
      const loginUrl = new URL("/admin-login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/admin-login",
    "/board/:path*",
    "/company",
    "/fund",
    "/mkt",
    "/pro",
    "/process",
  ],
};
