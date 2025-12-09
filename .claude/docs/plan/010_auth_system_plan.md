# 010_auth_system_plan - Better Auth 구현 계획

## 컨텍스트
- **요청**: Better Auth를 사용한 Auth 시스템 구축
- **선택된 솔루션**: Better Auth (옵션 1)
- **관련 DKB**: [009_auth_library_research.md](../DKB/009_auth_library_research.md)
- **날짜**: 2025-12-09
- **상태**: ✅ 승인됨

---

## 결정 요약

| 항목 | 결정 |
|------|------|
| **라이브러리** | Better Auth v1.3+ |
| **데이터베이스** | MongoDB (mongodbAdapter) |
| **세션 전략** | Database 세션 (MongoDB 저장) |
| **소셜 로그인** | Google, 카카오, 네이버 |
| **이메일 로그인** | 이메일/비밀번호 |
| **NestJS 통합** | @thallesp/nestjs-better-auth |
| **UI 컴포넌트** | @daveyplate/better-auth-ui (선택적) |

---

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        브라우저                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js (apps/web)                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  lib/auth.ts (Better Auth Server)                   │    │
│  │  lib/auth-client.ts (Better Auth Client)            │    │
│  │  app/api/auth/[...all]/route.ts (API Handler)       │    │
│  │  middleware.ts (Route Protection)                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │ JWT Token / Session Cookie
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   NestJS (apps/api)                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  src/auth/auth.module.ts (AuthModule.forRoot)       │    │
│  │  AuthGuard (자동 인증 검증)                          │    │
│  │  @Session() 데코레이터                               │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────────────┐   │
│  │    user     │ │   session   │ │       account        │   │
│  │             │ │             │ │  (OAuth 계정 연결)    │   │
│  └─────────────┘ └─────────────┘ └──────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   verification                        │   │
│  │              (이메일 인증 토큰)                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 상세 구현 단계

### Phase 1: 패키지 설치 및 환경 설정

#### 1.1 Next.js (apps/web) 패키지 설치

```bash
cd apps/web
pnpm add better-auth @better-fetch/fetch
pnpm add -D @types/better-auth  # 필요 시
```

#### 1.2 NestJS (apps/api) 패키지 설치

```bash
cd apps/api
pnpm add better-auth @thallesp/nestjs-better-auth mongodb
```

#### 1.3 환경 변수 설정

**apps/web/.env.local**:
```env
# Better Auth
BETTER_AUTH_SECRET=your-super-secret-key-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000

# MongoDB
DATABASE_URL=mongodb://localhost:27017/sdm

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - Kakao
KAKAO_CLIENT_ID=your-kakao-rest-api-key
KAKAO_CLIENT_SECRET=your-kakao-client-secret

# OAuth - Naver
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
```

**apps/api/.env**:
```env
# Better Auth (NestJS)
BETTER_AUTH_SECRET=your-super-secret-key-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3001

# MongoDB
DATABASE_URL=mongodb://localhost:27017/sdm

# Trusted Origins
TRUSTED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

### Phase 2: Prisma 스키마 업데이트

**apps/api/prisma/schema.prisma** 수정:

```prisma
// ============================================
// Better Auth Required Models
// ============================================

model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  email         String    @unique
  name          String?
  image         String?   // Better Auth 추가
  phone         String?
  role          String    @default("CUSTOMER")  // "CUSTOMER" | "VENDOR" | "ADMIN"

  emailVerified Boolean   @default(false)
  isActive      Boolean   @default(true)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?

  // Favorite: 찜한 업체 ID 배열
  favoriteVendorIds String[] @db.ObjectId

  // Better Auth Relations
  sessions      Session[]
  accounts      Account[]

  // Business Relations
  simulationResults SimulationResult[]
  ownedVendors      Vendor[]           @relation("VendorOwner")
  reviews           Review[]
  bookings          Booking[]
}

model Session {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  userId        String    @db.ObjectId
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  token         String    @unique
  expiresAt     DateTime
  ipAddress     String?
  userAgent     String?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId])
  @@index([token])
}

model Account {
  id                    String    @id @default(auto()) @map("_id") @db.ObjectId
  userId                String    @db.ObjectId
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  accountId             String    // OAuth provider user ID
  providerId            String    // "google", "kakao", "naver", "credential"

  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?   // 이메일/비밀번호 인증용 (해싱됨)

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@unique([providerId, accountId])
  @@index([userId])
}

model Verification {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  identifier  String    // 이메일 주소
  value       String    // 인증 토큰
  expiresAt   DateTime

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([identifier])
}
```

---

### Phase 3: Next.js Better Auth 설정

#### 3.1 서버 설정 (lib/auth.ts)

```typescript
// apps/web/lib/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { genericOAuth } from "better-auth/plugins";

const client = new MongoClient(process.env.DATABASE_URL!);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  // 기본 URL 설정
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,

  // 이메일/비밀번호 인증
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  // 소셜 프로바이더
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

  // 플러그인 (네이버 Generic OAuth)
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "naver",
          clientId: process.env.NAVER_CLIENT_ID!,
          clientSecret: process.env.NAVER_CLIENT_SECRET!,
          authorizationUrl: "https://nid.naver.com/oauth2.0/authorize",
          tokenUrl: "https://nid.naver.com/oauth2.0/token",
          scopes: ["profile", "email"],
          getUserInfo: async (tokens) => {
            const response = await fetch("https://openapi.naver.com/v1/nid/me", {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });
            const data = await response.json();
            const profile = data.response;

            return {
              id: profile.id,
              email: profile.email,
              name: profile.name || profile.nickname,
              image: profile.profile_image,
              emailVerified: true, // 네이버는 이메일 인증됨
            };
          },
        },
      ],
    }),
  ],

  // 세션 설정
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7일
    updateAge: 60 * 60 * 24, // 1일마다 갱신
  },

  // 사용자 추가 필드
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  // Trusted Origins (CORS)
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
  ],
});

// 타입 추론용
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
```

#### 3.2 클라이언트 설정 (lib/auth-client.ts)

```typescript
// apps/web/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    genericOAuthClient(),
  ],
});

// 편의 함수들
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
```

#### 3.3 API Route Handler

```typescript
// apps/web/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

#### 3.4 Middleware (라우트 보호)

```typescript
// apps/web/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// 인증 필요 경로
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/bookings",
  "/favorites",
  "/simulator/result",
];

// 비인증 사용자만 접근 가능 경로
const authRoutes = [
  "/login",
  "/register",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // 인증 필요 경로 체크
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 이미 로그인한 사용자가 로그인/회원가입 페이지 접근 시
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/bookings/:path*",
    "/favorites/:path*",
    "/simulator/result/:path*",
    "/login",
    "/register",
  ],
};
```

---

### Phase 4: 로그인/회원가입 페이지 연동

#### 4.1 로그인 페이지 수정

```typescript
// apps/web/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 이메일/비밀번호 로그인
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { data, error } = await signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    });

    if (error) {
      setError(error.message || "로그인에 실패했습니다.");
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  // 소셜 로그인
  const handleSocialLogin = async (provider: "google" | "kakao" | "naver") => {
    setIsLoading(true);
    await signIn.social({
      provider,
      callbackURL: callbackUrl,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">로그인</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 소셜 로그인 버튼 */}
          <div className="grid gap-2">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Google로 계속하기
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("kakao")}
              disabled={isLoading}
              className="bg-[#FEE500] text-black hover:bg-[#FDD800]"
            >
              <Icons.kakao className="mr-2 h-4 w-4" />
              카카오로 계속하기
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("naver")}
              disabled={isLoading}
              className="bg-[#03C75A] text-white hover:bg-[#02B350]"
            >
              <Icons.naver className="mr-2 h-4 w-4" />
              네이버로 계속하기
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
              또는
            </span>
          </div>

          {/* 이메일/비밀번호 폼 */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "이메일로 로그인"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <a href="/register" className="text-primary underline">
              회원가입
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 4.2 회원가입 페이지 수정

```typescript
// apps/web/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 이메일/비밀번호 회원가입
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    const { data, error } = await signUp.email({
      name,
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(error.message || "회원가입에 실패했습니다.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  // 소셜 회원가입 (로그인과 동일)
  const handleSocialRegister = async (provider: "google" | "kakao" | "naver") => {
    setIsLoading(true);
    await signIn.social({
      provider,
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">회원가입</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 소셜 가입 버튼 */}
          <div className="grid gap-2">
            <Button
              variant="outline"
              onClick={() => handleSocialRegister("google")}
              disabled={isLoading}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Google로 시작하기
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialRegister("kakao")}
              disabled={isLoading}
              className="bg-[#FEE500] text-black hover:bg-[#FDD800]"
            >
              <Icons.kakao className="mr-2 h-4 w-4" />
              카카오로 시작하기
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialRegister("naver")}
              disabled={isLoading}
              className="bg-[#03C75A] text-white hover:bg-[#02B350]"
            >
              <Icons.naver className="mr-2 h-4 w-4" />
              네이버로 시작하기
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
              또는
            </span>
          </div>

          {/* 이메일/비밀번호 폼 */}
          <form onSubmit={handleEmailRegister} className="space-y-4">
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="8자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "가입 중..." : "이메일로 가입하기"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <a href="/login" className="text-primary underline">
              로그인
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Phase 5: NestJS 통합

#### 5.1 Auth 모듈 설정

```typescript
// apps/api/src/auth/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { genericOAuth } from "better-auth/plugins";

const client = new MongoClient(process.env.DATABASE_URL!);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
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

  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "naver",
          clientId: process.env.NAVER_CLIENT_ID!,
          clientSecret: process.env.NAVER_CLIENT_SECRET!,
          authorizationUrl: "https://nid.naver.com/oauth2.0/authorize",
          tokenUrl: "https://nid.naver.com/oauth2.0/token",
          scopes: ["profile", "email"],
          getUserInfo: async (tokens) => {
            const response = await fetch("https://openapi.naver.com/v1/nid/me", {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });
            const data = await response.json();
            const profile = data.response;

            return {
              id: profile.id,
              email: profile.email,
              name: profile.name || profile.nickname,
              image: profile.profile_image,
              emailVerified: true,
            };
          },
        },
      ],
    }),
  ],

  trustedOrigins: process.env.TRUSTED_ORIGINS?.split(",") || [
    "http://localhost:3000",
  ],

  hooks: {},
});

export type Session = typeof auth.$Infer.Session;
```

#### 5.2 Auth Module

```typescript
// apps/api/src/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { AuthModule as BetterAuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth";

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth,
      disableTrustedOriginsCors: false,
      disableBodyParser: false,
      disableGlobalAuthGuard: false, // 전역 인증 가드 활성화
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
```

#### 5.3 App Module 수정

```typescript
// apps/api/src/app.module.ts
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
// ... 기타 imports

@Module({
  imports: [
    AuthModule,
    // ... 기타 모듈
  ],
})
export class AppModule {}
```

#### 5.4 main.ts 수정

```typescript
// apps/api/src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Better Auth가 자체 파서 사용
  });

  app.enableCors({
    origin: process.env.TRUSTED_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
```

#### 5.5 Controller에서 인증 사용

```typescript
// apps/api/src/vendor/vendor.controller.ts
import { Controller, Get, Post, Body } from "@nestjs/common";
import {
  Session,
  UserSession,
  AllowAnonymous,
  Roles,
} from "@thallesp/nestjs-better-auth";

@Controller("vendors")
export class VendorController {
  // 인증 필요 없음
  @Get()
  @AllowAnonymous()
  async findAll() {
    return this.vendorService.findAll();
  }

  // 인증 필요 (기본)
  @Get("my")
  async getMyVendors(@Session() session: UserSession) {
    return this.vendorService.findByOwner(session.user.id);
  }

  // 관리자만 접근 가능
  @Post("verify/:id")
  @Roles(["ADMIN"])
  async verifyVendor(@Param("id") id: string) {
    return this.vendorService.verify(id);
  }
}
```

---

### Phase 6: 테스트 계획

#### 6.1 수동 테스트 체크리스트

- [ ] 이메일/비밀번호 회원가입
- [ ] 이메일/비밀번호 로그인
- [ ] Google 소셜 로그인
- [ ] 카카오 소셜 로그인
- [ ] 네이버 소셜 로그인
- [ ] 로그아웃
- [ ] 세션 유지 확인 (새로고침 후)
- [ ] 보호된 라우트 접근 테스트
- [ ] 비인증 시 리다이렉트 확인
- [ ] NestJS API 인증 Guard 테스트

#### 6.2 OAuth 프로바이더 콜백 URL 설정

| 프로바이더 | 콜백 URL |
|-----------|----------|
| Google | `http://localhost:3000/api/auth/callback/google` |
| Kakao | `http://localhost:3000/api/auth/callback/kakao` |
| Naver | `http://localhost:3000/api/auth/oauth2/callback/naver` |

---

## 파일 변경 요약

### 새로 생성
| 파일 | 설명 |
|------|------|
| `apps/web/lib/auth.ts` | Better Auth 서버 설정 |
| `apps/web/lib/auth-client.ts` | Better Auth 클라이언트 설정 |
| `apps/web/app/api/auth/[...all]/route.ts` | API Route Handler |
| `apps/web/middleware.ts` | 라우트 보호 미들웨어 |
| `apps/api/src/auth/auth.ts` | NestJS Better Auth 설정 |
| `apps/api/src/auth/auth.module.ts` | NestJS Auth 모듈 |

### 수정
| 파일 | 변경 내용 |
|------|----------|
| `apps/api/prisma/schema.prisma` | Session, Account, Verification 모델 추가 |
| `apps/web/app/login/page.tsx` | Better Auth 연동 |
| `apps/web/app/register/page.tsx` | Better Auth 연동 |
| `apps/api/src/app.module.ts` | AuthModule import |
| `apps/api/src/main.ts` | bodyParser 비활성화 |

---

## 위험 요소 및 대응

| 위험 | 대응 방안 |
|------|----------|
| 네이버 Generic OAuth 설정 오류 | 네이버 개발자 문서 참조, 콜백 URL 정확히 확인 |
| MongoDB 연결 실패 | 환경변수 확인, MongoDB 서버 상태 확인 |
| 세션 동기화 문제 | 쿠키 설정 확인, trustedOrigins 확인 |
| TypeScript 타입 오류 | Better Auth 타입 추론 활용 |

---

## 문서 동기화

- [x] 옵션 선택 확정 (Better Auth)
- [ ] current.md 업데이트됨
- [x] context/index.md에 번호 등록됨
- [x] 관련 DKB 문서 링크됨

## 관련 문서

- 조사 문서: [009_auth_library_research.md](../DKB/009_auth_library_research.md)
- 현재 상태: [current.md](../../context/current.md)
- 로그인 UI: `apps/web/app/login/page.tsx`
- 회원가입 UI: `apps/web/app/register/page.tsx`
