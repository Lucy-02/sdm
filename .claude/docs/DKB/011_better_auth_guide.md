# Better Auth 완벽 가이드

## 개요

Better Auth는 TypeScript로 작성된 프레임워크 독립적인 인증/인가 라이브러리입니다. Next.js, Express, NestJS 등 다양한 환경에서 동일한 API로 인증 시스템을 구축할 수 있습니다.

- **작성일**: 2025-12-09
- **버전**: Better Auth 1.4+
- **관련 문서**: [009_auth_library_research.md](./009_auth_library_research.md), [010_auth_system_plan.md](../plan/010_auth_system_plan.md)

---

## 1. 핵심 개념

### 1.1 아키텍처 구조

```
┌─────────────────────────────────────────────────────────────┐
│                      Better Auth 구조                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │   Client     │───▶│    Server    │───▶│   Database   │   │
│  │ (auth-client)│    │ (betterAuth) │    │  (Adapter)   │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│         │                   │                   │            │
│         ▼                   ▼                   ▼            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │ React Hooks  │    │   Plugins    │    │  MongoDB     │   │
│  │ signIn/Out   │    │ OAuth, 2FA   │    │  Prisma      │   │
│  │ useSession   │    │ Organization │    │  Drizzle     │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 핵심 컴포넌트

| 컴포넌트 | 역할 | 위치 |
|---------|------|------|
| **betterAuth()** | 서버 설정 (인증 로직 정의) | `lib/auth.ts` |
| **createAuthClient()** | 클라이언트 설정 (React 훅 등) | `lib/auth-client.ts` |
| **Database Adapter** | DB 연결 (MongoDB, Prisma 등) | 서버 설정 내 |
| **Plugins** | 확장 기능 (2FA, OAuth 등) | 서버/클라이언트 설정 |

---

## 2. 인증 흐름 상세

### 2.1 이메일/비밀번호 회원가입 흐름

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────┐
│ 브라우저 │     │  Next.js    │     │ Better Auth │     │ MongoDB │
└────┬────┘     └──────┬──────┘     └──────┬──────┘     └────┬────┘
     │                 │                   │                  │
     │ 1. signUp.email │                   │                  │
     │ {email,password}│                   │                  │
     │─────────────────▶                   │                  │
     │                 │                   │                  │
     │                 │ 2. POST /sign-up  │                  │
     │                 │─────────────────▶│                  │
     │                 │                   │                  │
     │                 │                   │ 3. 이메일 중복 체크│
     │                 │                   │─────────────────▶│
     │                 │                   │◀─────────────────│
     │                 │                   │                  │
     │                 │                   │ 4. 비밀번호 해싱  │
     │                 │                   │    (bcrypt)      │
     │                 │                   │                  │
     │                 │                   │ 5. User 생성     │
     │                 │                   │─────────────────▶│
     │                 │                   │                  │
     │                 │                   │ 6. Account 생성  │
     │                 │                   │ (providerId:     │
     │                 │                   │  "credential")   │
     │                 │                   │─────────────────▶│
     │                 │                   │                  │
     │                 │                   │ 7. Session 생성  │
     │                 │                   │ (토큰 발급)       │
     │                 │                   │─────────────────▶│
     │                 │                   │◀─────────────────│
     │                 │                   │                  │
     │                 │ 8. Set-Cookie     │                  │
     │                 │◀─────────────────│                  │
     │                 │                   │                  │
     │ 9. 세션 쿠키 저장 │                   │                  │
     │◀─────────────────                   │                  │
     │                 │                   │                  │
```

### 2.2 소셜 로그인 (OAuth) 흐름

```
┌─────────┐   ┌─────────┐   ┌─────────────┐   ┌─────────┐   ┌─────────┐
│ 브라우저 │   │ Next.js │   │ Better Auth │   │ Google  │   │ MongoDB │
└────┬────┘   └────┬────┘   └──────┬──────┘   └────┬────┘   └────┬────┘
     │             │               │               │              │
     │ 1. signIn.social            │               │              │
     │ (provider:"google")         │               │              │
     │─────────────────────────────▶               │              │
     │                             │               │              │
     │ 2. Redirect to Google       │               │              │
     │◀─────────────────────────────               │              │
     │                             │               │              │
     │ 3. Google 로그인 페이지     │               │              │
     │─────────────────────────────────────────────▶              │
     │                             │               │              │
     │ 4. 사용자 인증 (구글 계정)  │               │              │
     │◀────────────────────────────────────────────│              │
     │                             │               │              │
     │ 5. Callback + code          │               │              │
     │ /api/auth/callback/google   │               │              │
     │─────────────────────────────▶               │              │
     │                             │               │              │
     │                             │ 6. 토큰 교환  │              │
     │                             │ code → tokens │              │
     │                             │───────────────▶              │
     │                             │◀──────────────│              │
     │                             │               │              │
     │                             │ 7. 사용자 정보 조회           │
     │                             │───────────────▶              │
     │                             │◀──────────────│              │
     │                             │               │              │
     │                             │ 8. User 조회/생성            │
     │                             │─────────────────────────────▶│
     │                             │                              │
     │                             │ 9. Account 연결              │
     │                             │ (providerId: "google")       │
     │                             │─────────────────────────────▶│
     │                             │                              │
     │                             │ 10. Session 생성             │
     │                             │─────────────────────────────▶│
     │                             │◀─────────────────────────────│
     │                             │               │              │
     │ 11. Redirect + Set-Cookie   │               │              │
     │◀─────────────────────────────               │              │
     │                             │               │              │
```

### 2.3 세션 검증 흐름

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────┐
│ 브라우저 │     │  Next.js    │     │ Better Auth │     │ MongoDB │
└────┬────┘     └──────┬──────┘     └──────┬──────┘     └────┬────┘
     │                 │                   │                  │
     │ 1. 페이지 요청  │                   │                  │
     │ Cookie: session │                   │                  │
     │─────────────────▶                   │                  │
     │                 │                   │                  │
     │                 │ 2. useSession()   │                  │
     │                 │ 또는 getSession() │                  │
     │                 │─────────────────▶│                  │
     │                 │                   │                  │
     │                 │                   │ 3. 토큰으로      │
     │                 │                   │ Session 조회     │
     │                 │                   │─────────────────▶│
     │                 │                   │◀─────────────────│
     │                 │                   │                  │
     │                 │                   │ 4. 만료 체크     │
     │                 │                   │ expiresAt > now  │
     │                 │                   │                  │
     │                 │                   │ 5. User 조회     │
     │                 │                   │─────────────────▶│
     │                 │                   │◀─────────────────│
     │                 │                   │                  │
     │                 │ 6. {user, session}│                  │
     │                 │◀─────────────────│                  │
     │                 │                   │                  │
     │ 7. 페이지 렌더링│                   │                  │
     │◀─────────────────                   │                  │
     │                 │                   │                  │
```

---

## 3. 데이터 모델

### 3.1 핵심 테이블/컬렉션

```
┌─────────────────────────────────────────────────────────────────┐
│                        Better Auth DB 구조                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐       ┌────────────┐       ┌────────────────┐   │
│  │    User    │◀──────│  Session   │       │   Account      │   │
│  ├────────────┤  1:N  ├────────────┤       ├────────────────┤   │
│  │ id         │       │ id         │       │ id             │   │
│  │ email      │       │ userId     │───────│ userId         │   │
│  │ name       │       │ token      │       │ accountId      │   │
│  │ image      │       │ expiresAt  │       │ providerId     │   │
│  │ emailVerified     │ ipAddress  │       │ accessToken    │   │
│  │ createdAt  │       │ userAgent  │       │ refreshToken   │   │
│  │ updatedAt  │       │ createdAt  │       │ password (hash)│   │
│  └────────────┘       └────────────┘       └────────────────┘   │
│        │                                          │              │
│        │ 1:N                                      │ N:1          │
│        ▼                                          │              │
│  ┌────────────────┐                              │              │
│  │   Account      │◀─────────────────────────────┘              │
│  └────────────────┘                                              │
│                                                                  │
│  ┌────────────────┐                                              │
│  │  Verification  │  (이메일 인증, 비밀번호 재설정용)              │
│  ├────────────────┤                                              │
│  │ id             │                                              │
│  │ identifier     │  ← 이메일 주소                                │
│  │ value          │  ← 인증 토큰                                  │
│  │ expiresAt      │                                              │
│  └────────────────┘                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Account 테이블 이해

**Account는 "로그인 방법"을 저장합니다.**

한 사용자가 여러 방법으로 로그인할 수 있습니다:

```
User (id: "user_123", email: "john@example.com")
  │
  ├── Account (providerId: "credential", accountId: "john@example.com")
  │      → 이메일/비밀번호 로그인
  │      → password 필드에 해싱된 비밀번호 저장
  │
  ├── Account (providerId: "google", accountId: "google_123456")
  │      → Google 로그인
  │      → accessToken, refreshToken 저장
  │
  └── Account (providerId: "kakao", accountId: "kakao_789")
         → Kakao 로그인
         → accessToken 저장
```

### 3.3 Session 테이블 이해

**Session은 "로그인 상태"를 저장합니다.**

```
Session {
  id: "session_abc",
  userId: "user_123",
  token: "랜덤 토큰 문자열",     ← 쿠키에 저장됨
  expiresAt: "2025-12-16",      ← 만료 시간
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
```

- 사용자가 로그인하면 Session이 생성됨
- 브라우저에 쿠키로 `token` 저장
- 매 요청마다 쿠키의 token으로 Session 조회
- 만료되면 로그아웃 처리

---

## 4. 서버 설정 상세 (lib/auth.ts)

### 4.1 기본 구조

```typescript
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// MongoDB 연결
const client = new MongoClient(process.env.DATABASE_URL!);
const db = client.db();

export const auth = betterAuth({
  // 1. 데이터베이스 연결
  database: mongodbAdapter(db, { client }),

  // 2. 기본 설정
  baseURL: process.env.BETTER_AUTH_URL,      // 앱 URL
  basePath: "/api/auth",                      // API 경로 prefix
  secret: process.env.BETTER_AUTH_SECRET,    // 암호화 키 (32자 이상)

  // 3. 인증 방법
  emailAndPassword: { ... },  // 이메일/비밀번호
  socialProviders: { ... },   // 소셜 로그인

  // 4. 플러그인
  plugins: [ ... ],

  // 5. 세션 설정
  session: { ... },

  // 6. 사용자 추가 필드
  user: { ... },

  // 7. 신뢰 출처
  trustedOrigins: [ ... ],
});
```

### 4.2 설정 옵션 상세

#### emailAndPassword (이메일/비밀번호 인증)

```typescript
emailAndPassword: {
  enabled: true,              // 활성화 여부

  minPasswordLength: 8,       // 최소 비밀번호 길이
  maxPasswordLength: 128,     // 최대 비밀번호 길이

  autoSignIn: true,           // 회원가입 후 자동 로그인

  requireEmailVerification: false,  // 이메일 인증 필수 여부

  // 비밀번호 재설정 이메일 발송 (선택)
  sendResetPassword: async ({ user, url, token }) => {
    await sendEmail({
      to: user.email,
      subject: "비밀번호 재설정",
      body: `링크 클릭: ${url}`
    });
  },

  resetPasswordTokenExpiresIn: 3600,  // 재설정 토큰 유효시간 (초)
}
```

#### socialProviders (소셜 로그인)

```typescript
socialProviders: {
  // Google
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // 선택: 추가 scope
    scope: ["email", "profile", "openid"],
  },

  // Kakao (Better Auth 기본 지원)
  kakao: {
    clientId: process.env.KAKAO_CLIENT_ID!,
    clientSecret: process.env.KAKAO_CLIENT_SECRET!,
  },

  // GitHub, Discord, Apple 등 50+ 프로바이더 지원
}
```

#### session (세션 설정)

```typescript
session: {
  expiresIn: 60 * 60 * 24 * 7,    // 7일 (초 단위)
  updateAge: 60 * 60 * 24,        // 1일마다 세션 갱신

  cookieCache: {
    enabled: true,                // 쿠키 캐싱 활성화
    maxAge: 60 * 5,               // 5분 캐시 (DB 조회 감소)
  },
}
```

#### user (사용자 추가 필드)

```typescript
user: {
  additionalFields: {
    // 커스텀 필드 정의
    role: {
      type: "string",
      required: false,
      defaultValue: "CUSTOMER",
      // 회원가입 시 입력 가능하게 하려면:
      input: true,
    },
    phone: {
      type: "string",
      required: false,
    },
  },
}
```

---

## 5. 클라이언트 설정 상세 (lib/auth-client.ts)

### 5.1 기본 구조

```typescript
import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",  // Next.js 서버 URL

  // 플러그인 (서버 플러그인과 매칭)
  plugins: [
    genericOAuthClient(),  // Generic OAuth 사용 시 필요
  ],
});

// 편의를 위해 개별 함수 export
export const {
  signIn,       // 로그인
  signUp,       // 회원가입
  signOut,      // 로그아웃
  useSession,   // React Hook (세션 상태)
  getSession,   // 서버에서 세션 조회
} = authClient;
```

### 5.2 주요 함수

#### signUp.email (이메일 회원가입)

```typescript
const { data, error } = await signUp.email({
  name: "홍길동",
  email: "hong@example.com",
  password: "securePassword123",

  // 커스텀 필드 (user.additionalFields.input: true 필요)
  role: "VENDOR",

  // 성공 후 리다이렉트
  callbackURL: "/dashboard",
});

if (error) {
  console.log(error.message);  // "User already exists" 등
}
```

#### signIn.email (이메일 로그인)

```typescript
const { data, error } = await signIn.email({
  email: "hong@example.com",
  password: "securePassword123",

  rememberMe: true,  // 브라우저 닫아도 세션 유지
  callbackURL: "/dashboard",
});
```

#### signIn.social (소셜 로그인)

```typescript
// Google
await signIn.social({
  provider: "google",
  callbackURL: "/dashboard",
});

// Kakao
await signIn.social({
  provider: "kakao",
  callbackURL: "/dashboard",
});

// Naver (Generic OAuth)
await signIn.social({
  provider: "naver",
  callbackURL: "/dashboard",
});
```

#### signOut (로그아웃)

```typescript
await signOut({
  fetchOptions: {
    onSuccess: () => {
      window.location.href = "/";  // 로그아웃 후 홈으로
    },
  },
});
```

#### useSession (React Hook)

```typescript
function MyComponent() {
  const { data: session, isPending, error } = useSession();

  if (isPending) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;
  if (!session) return <div>로그인 필요</div>;

  return (
    <div>
      <p>이름: {session.user.name}</p>
      <p>이메일: {session.user.email}</p>
      <img src={session.user.image} />
    </div>
  );
}
```

---

## 6. Generic OAuth (네이버 등 커스텀 프로바이더)

Better Auth에서 기본 제공하지 않는 OAuth 프로바이더는 `genericOAuth` 플러그인으로 추가합니다.

### 6.1 서버 설정

```typescript
import { genericOAuth } from "better-auth/plugins";

plugins: [
  genericOAuth({
    config: [
      {
        // 고유 식별자 (signIn.social에서 사용)
        providerId: "naver",

        // OAuth 앱 설정
        clientId: process.env.NAVER_CLIENT_ID!,
        clientSecret: process.env.NAVER_CLIENT_SECRET!,

        // OAuth 엔드포인트
        authorizationUrl: "https://nid.naver.com/oauth2.0/authorize",
        tokenUrl: "https://nid.naver.com/oauth2.0/token",

        // 요청할 권한
        scopes: ["profile", "email"],

        // 사용자 정보 조회 함수 (필수!)
        getUserInfo: async (tokens) => {
          // 네이버 API로 사용자 정보 조회
          const response = await fetch("https://openapi.naver.com/v1/nid/me", {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          });
          const data = await response.json();
          const profile = data.response;

          // Better Auth가 기대하는 형식으로 반환
          return {
            id: profile.id,           // 필수: 프로바이더 사용자 ID
            email: profile.email,     // 필수: 이메일
            name: profile.name || profile.nickname,
            image: profile.profile_image,
            emailVerified: true,      // 네이버는 인증된 이메일만 제공
          };
        },
      },
    ],
  }),
],
```

### 6.2 클라이언트 설정

```typescript
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    genericOAuthClient(),  // 이것만 추가하면 됨
  ],
});
```

### 6.3 콜백 URL 차이

| 프로바이더 | 콜백 URL |
|-----------|----------|
| Google (기본) | `/api/auth/callback/google` |
| Kakao (기본) | `/api/auth/callback/kakao` |
| Naver (Generic) | `/api/auth/oauth2/callback/naver` |

> **주의**: Generic OAuth는 `/oauth2/callback/` 경로 사용

---

## 7. Middleware (라우트 보호)

### 7.1 Next.js Middleware 기본

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  // 쿠키에서 세션 토큰 확인 (DB 조회 없이 빠름)
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    // 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

### 7.2 쿠키 vs 세션 검증

| 방식 | 속도 | 보안 | 사용 시점 |
|-----|------|------|----------|
| `getSessionCookie()` | 매우 빠름 | 보통 | 단순 리다이렉트 |
| `auth.api.getSession()` | DB 조회 | 높음 | 데이터 필요 시 |

```typescript
// 전체 세션 검증 (Next.js 15.2+ Node.js 런타임)
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // session.user.role 등으로 권한 체크 가능
  if (session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",  // Edge가 아닌 Node.js 런타임 필요
  matcher: ["/admin/:path*"],
};
```

---

## 8. NestJS 통합

### 8.1 설치 및 설정

```bash
npx pnpm add @thallesp/nestjs-better-auth better-auth mongodb --filter api
```

### 8.2 Auth 모듈 설정

```typescript
// src/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { AuthModule as BetterAuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth";  // Better Auth 설정

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth,

      // 옵션
      disableTrustedOriginsCors: false,  // CORS 자동 설정
      disableBodyParser: false,          // body parser 자동 설정
      disableGlobalAuthGuard: false,     // 전역 가드 활성화
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
```

### 8.3 데코레이터 사용

```typescript
import {
  Session,          // 세션 주입
  UserSession,      // 세션 타입
  AllowAnonymous,   // 인증 불필요
  Roles,            // 역할 기반 접근
  OptionalAuth,     // 선택적 인증
} from "@thallesp/nestjs-better-auth";

@Controller("users")
export class UserController {
  // 인증 필수 (기본)
  @Get("me")
  getProfile(@Session() session: UserSession) {
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    };
  }

  // 인증 불필요
  @Get("public")
  @AllowAnonymous()
  getPublicData() {
    return { message: "누구나 볼 수 있음" };
  }

  // 역할 제한
  @Delete(":id")
  @Roles(["ADMIN"])
  deleteUser(@Param("id") id: string) {
    return this.userService.delete(id);
  }

  // 선택적 인증 (로그인 안 해도 됨, 했으면 session 제공)
  @Get("feed")
  @OptionalAuth()
  getFeed(@Session() session?: UserSession) {
    if (session) {
      return this.feedService.getPersonalized(session.user.id);
    }
    return this.feedService.getGeneral();
  }
}
```

---

## 9. 자주 사용하는 패턴

### 9.1 서버 컴포넌트에서 세션 확인

```typescript
// app/dashboard/page.tsx (Server Component)
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>환영합니다, {session.user.name}님!</h1>
    </div>
  );
}
```

### 9.2 클라이언트 컴포넌트에서 세션 확인

```typescript
// components/Header.tsx (Client Component)
"use client";

import { useSession, signOut } from "@/lib/auth-client";

export function Header() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="h-16 animate-pulse bg-gray-200" />;
  }

  return (
    <header className="h-16 flex items-center justify-between px-4">
      <h1>My App</h1>

      {session ? (
        <div className="flex items-center gap-4">
          <span>{session.user.name}</span>
          <button onClick={() => signOut()}>로그아웃</button>
        </div>
      ) : (
        <a href="/login">로그인</a>
      )}
    </header>
  );
}
```

### 9.3 API 호출 시 인증 헤더 전달

Better Auth는 쿠키 기반이라 별도 헤더 불필요. 단, 크로스 도메인 시:

```typescript
// NestJS API 호출
const response = await fetch("http://localhost:3001/api/users/me", {
  credentials: "include",  // 쿠키 포함
});
```

---

## 10. 트러블슈팅

### 10.1 "Unauthorized" 에러

**원인**: 쿠키가 전달되지 않음

**해결**:
1. CORS 설정 확인 (`credentials: true`)
2. `trustedOrigins` 확인
3. 같은 도메인 사용 (localhost:3000 → localhost:3001)

### 10.2 "User already exists" 에러

**원인**: 동일 이메일로 회원가입 시도

**해결**:
- 다른 이메일 사용
- 또는 로그인 시도 (`signIn.email`)

### 10.3 소셜 로그인 후 빈 화면

**원인**: 콜백 URL 불일치

**해결**:
- OAuth 프로바이더 콘솔에서 콜백 URL 확인
- Generic OAuth: `/api/auth/oauth2/callback/[provider]`
- 기본 제공: `/api/auth/callback/[provider]`

### 10.4 세션이 유지되지 않음

**원인**:
1. `secret`이 다름 (서버 재시작 시 변경됨)
2. 세션 만료

**해결**:
1. `.env`에 고정된 `BETTER_AUTH_SECRET` 설정
2. `session.expiresIn` 값 확인

---

## 11. 보안 체크리스트

- [ ] `BETTER_AUTH_SECRET`은 32자 이상 랜덤 문자열
- [ ] 프로덕션에서 HTTPS 사용
- [ ] `trustedOrigins`에 프로덕션 도메인만 포함
- [ ] OAuth clientSecret은 절대 클라이언트에 노출 금지
- [ ] 비밀번호 정책 적용 (`minPasswordLength`)

---

## 참고 자료

- [Better Auth 공식 문서](https://better-auth.com/)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
- [nestjs-better-auth](https://github.com/thallesp/nestjs-better-auth)
- [관련 계획 문서](../plan/010_auth_system_plan.md)
