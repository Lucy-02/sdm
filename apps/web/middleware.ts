import { NextRequest, NextResponse } from "next/server";

// 보호할 경로 패턴
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/bookings",
  "/favorites",
  "/simulator/result", // 시뮬레이션 결과는 로그인 필요
];

// 인증 사용자가 접근하면 안 되는 경로
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 세션 쿠키 확인 (DB 조회 없이 쿠키 존재 여부만 확인)
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const hasSession = !!sessionCookie?.value;

  // 보호된 경로 체크
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 인증 경로 체크
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 미인증 상태에서 보호된 경로 접근 시 로그인 페이지로 리다이렉트
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 인증 상태에서 로그인/회원가입 페이지 접근 시 메인으로 리다이렉트
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 다음 경로 제외:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public 폴더의 파일들
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};
