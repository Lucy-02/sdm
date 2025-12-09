# 012 - Phase 3: Better Auth 구현 계획

> **생성일**: 2025-12-09
> **상태**: 계획 수립됨
> **관련 문서**: [010_auth_system_plan.md](010_auth_system_plan.md), [011_better_auth_guide.md](../DKB/011_better_auth_guide.md)

## 📋 개요

Phase 2(패키지 설치, 환경 변수, Prisma 스키마)가 완료되었습니다.
Phase 3에서는 Better Auth 서버/클라이언트 설정과 API 핸들러를 구현합니다.

## 🎯 Phase 3 목표

1. Better Auth 서버 인스턴스 설정 (`lib/auth.ts`)
2. Better Auth 클라이언트 설정 (`lib/auth-client.ts`)
3. API 라우트 핸들러 생성 (`app/api/auth/[...all]/route.ts`)
4. Middleware 설정 (`middleware.ts`)

---

## 📁 구현 파일 목록

| 순서 | 파일 | 설명 |
|------|------|------|
| 1 | `apps/web/lib/auth.ts` | Better Auth 서버 인스턴스 |
| 2 | `apps/web/lib/auth-client.ts` | 클라이언트 훅 및 함수 |
| 3 | `apps/web/app/api/auth/[...all]/route.ts` | API 라우트 핸들러 |
| 4 | `apps/web/middleware.ts` | 라우트 보호 |
| 5 | `apps/web/types/auth.d.ts` | 타입 확장 (선택) |

---

## 🔧 Step 1: 서버 인스턴스 (`lib/auth.ts`)

### 목적
- Better Auth 서버 설정 및 Prisma 어댑터 연동
- OAuth 프로바이더 설정 (Google, Kakao, Naver)

### 구현 내용

```typescript
// apps/web/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // MVP에서는 비활성화
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    kakao: {
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    },
  },

  // Naver는 Generic OAuth로 설정
  socialProviders: {
    // ... 기존 설정 유지
    naver: {
      type: "oidc",
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
      authorizationUrl: "https://nid.naver.com/oauth2.0/authorize",
      tokenUrl: "https://nid.naver.com/oauth2.0/token",
      userInfoUrl: "https://openapi.naver.com/v1/nid/me",
      scopes: ["profile", "email"],
      getUserInfo: async (tokens) => {
        const res = await fetch("https://openapi.naver.com/v1/nid/me", {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        const data = await res.json();
        return {
          id: data.response.id,
          email: data.response.email,
          name: data.response.name,
          image: data.response.profile_image,
        };
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7일
    updateAge: 60 * 60 * 24,     // 24시간마다 갱신
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5분 캐시
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  callbacks: {
    onUserCreated: async (user) => {
      console.log("New user created:", user.id);
    },
    onSessionCreated: async (session) => {
      // lastLoginAt 업데이트
      await prisma.user.update({
        where: { id: session.userId },
        data: { lastLoginAt: new Date() },
      });
    },
  },
});

export type Auth = typeof auth;
```

### 주의사항
- `prismaAdapter`는 `better-auth/adapters/prisma`에서 import
- Naver는 OIDC가 아닌 커스텀 OAuth이므로 `getUserInfo` 함수 필요
- MongoDB ObjectId 변환 처리 필요할 수 있음

---

## 🖥️ Step 2: 클라이언트 설정 (`lib/auth-client.ts`)

### 목적
- 클라이언트 사이드에서 사용할 인증 훅 생성
- 로그인/로그아웃/세션 관리 함수 제공

### 구현 내용

```typescript
// apps/web/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// 편의를 위한 개별 export
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
```

### 사용 예시

```tsx
// 컴포넌트에서 사용
"use client";
import { useSession, signIn, signOut } from "@/lib/auth-client";

export function AuthButton() {
  const { data: session, isPending } = useSession();

  if (isPending) return <Spinner />;

  if (session) {
    return (
      <button onClick={() => signOut()}>
        로그아웃 ({session.user.name})
      </button>
    );
  }

  return <button onClick={() => signIn.social({ provider: "google" })}>
    구글 로그인
  </button>;
}
```

---

## 🌐 Step 3: API 라우트 핸들러

### 목적
- `/api/auth/*` 경로로 들어오는 모든 인증 요청 처리

### 구현 내용

```typescript
// apps/web/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### 생성되는 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/auth/sign-up/email` | 이메일 회원가입 |
| POST | `/api/auth/sign-in/email` | 이메일 로그인 |
| GET | `/api/auth/sign-in/social` | OAuth 시작 |
| GET | `/api/auth/callback/:provider` | OAuth 콜백 |
| POST | `/api/auth/sign-out` | 로그아웃 |
| GET | `/api/auth/session` | 세션 조회 |

---

## 🛡️ Step 4: Middleware 설정

### 목적
- 보호된 라우트에 대한 접근 제어
- 인증되지 않은 사용자 리다이렉트

### 구현 내용

```typescript
// apps/web/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// 보호할 경로 패턴
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/bookings",
  "/favorites",
  "/simulator/result", // 시뮬레이션 결과는 로그인 필요
];

// 인증 사용자가 접근하면 안 되는 경로
const authRoutes = [
  "/login",
  "/signup",
];

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { pathname } = request.nextUrl;

  // 보호된 경로 체크
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // 인증 경로 체크
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // 미인증 상태에서 보호된 경로 접근
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 인증 상태에서 로그인/회원가입 페이지 접근
  if (isAuthRoute && session) {
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

### 대안: 경량 미들웨어

성능이 중요한 경우 세션 확인을 최소화:

```typescript
// 쿠키 존재 여부만 확인 (DB 조회 없음)
export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // ... 나머지 로직
}
```

---

## 📝 Step 5: 타입 확장 (선택)

### 목적
- 사용자 정의 필드에 대한 TypeScript 타입 지원

### 구현 내용

```typescript
// apps/web/types/auth.d.ts
import { Auth } from "@/lib/auth";

declare module "better-auth" {
  interface User {
    role: "CUSTOMER" | "VENDOR" | "ADMIN";
    phone?: string;
  }
}
```

---

## ✅ 체크리스트

### Step 1: 서버 인스턴스
- [x] `apps/web/lib/auth.ts` 파일 생성
- [x] MongoDB 네이티브 어댑터 설정 (Prisma 대신)
- [x] Google OAuth 설정
- [x] Kakao OAuth 설정
- [x] Naver Generic OAuth 설정
- [x] 세션 옵션 설정
- [x] 사용자 추가 필드 설정
- [x] 콜백 함수 설정

### Step 2: 클라이언트 설정
- [x] `apps/web/lib/auth-client.ts` 파일 생성
- [x] authClient 인스턴스 생성
- [x] 편의 함수 export
- [x] genericOAuthClient 플러그인 추가

### Step 3: API 핸들러
- [x] `apps/web/app/api/auth/[...all]/` 디렉토리 생성
- [x] `route.ts` 파일 생성
- [x] `next.config.js` 수정 (auth 경로 프록시 제외)

### Step 4: Middleware
- [x] `apps/web/middleware.ts` 파일 생성
- [x] 보호 경로 정의
- [x] 인증 경로 정의
- [x] 리다이렉트 로직 구현

### Step 5: 타입 (선택)
- [x] `apps/web/types/auth.d.ts` 파일 생성

### 테스트 결과 (2025-12-09)
- [x] 회원가입 API 테스트 성공
- [x] 로그인 API 테스트 성공
- [x] 세션 조회 API 테스트 성공
- [x] MongoDB에 user, session, account 컬렉션 정상 저장

---

## ⚠️ 주의사항

### Prisma Client 싱글턴
개발 환경에서 Hot Reload 시 Prisma Client 중복 생성 방지:

```typescript
// apps/web/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### MongoDB ObjectId
Better Auth는 기본적으로 문자열 ID를 사용합니다. MongoDB ObjectId와의 호환성을 위해 Prisma 스키마에서 `@map("_id") @db.ObjectId` 설정이 올바르게 되어 있는지 확인하세요.

### 환경 변수 검증
서버 시작 전 필수 환경 변수 검증:

```typescript
// apps/web/lib/env.ts
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is required");
}
if (process.env.BETTER_AUTH_SECRET.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");
}
```

---

## 📊 예상 소요 시간

| 단계 | 예상 작업량 |
|------|------------|
| Step 1: 서버 인스턴스 | 중간 |
| Step 2: 클라이언트 | 낮음 |
| Step 3: API 핸들러 | 낮음 |
| Step 4: Middleware | 중간 |
| Step 5: 타입 | 낮음 |

---

## 🔗 관련 문서

- [010_auth_system_plan.md](010_auth_system_plan.md) - 전체 인증 시스템 계획
- [011_better_auth_guide.md](../DKB/011_better_auth_guide.md) - Better Auth 상세 가이드
- [Better Auth 공식 문서](https://www.better-auth.com/docs)
