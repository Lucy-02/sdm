# Auth 라이브러리 비교 조사

## 개요
SDM 프로젝트에서 사용할 인증 라이브러리를 선정하기 위한 조사 문서입니다.
Next.js 15 + NestJS 백엔드 환경에서 Google, 카카오, 네이버 소셜 로그인과 이메일/비밀번호 인증을 지원해야 합니다.

- **작성일**: 2025-12-09
- **프로젝트 환경**: Next.js 15 (App Router) + NestJS + MongoDB
- **필요 기능**: 이메일/비밀번호, Google, 카카오, 네이버 OAuth

---

## 후보 라이브러리 비교

### 1. NextAuth.js (Auth.js) v5

| 항목 | 내용 |
|------|------|
| **버전** | v5 (Auth.js) |
| **GitHub Stars** | 25k+ |
| **npm 주간 다운로드** | 1M+ |
| **라이센스** | ISC |
| **마지막 업데이트** | 활발 (주간 업데이트) |

#### 특징
- Next.js 공식 권장 인증 솔루션
- 80+ OAuth 프로바이더 기본 지원 (Google, Kakao, Naver 포함)
- Edge Runtime 지원
- App Router / Pages Router 모두 지원
- 자동 CSRF 보호
- JWT 또는 Database 세션 전략 선택 가능

#### 프로바이더 설정 예시
```typescript
// auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Kakao from "next-auth/providers/kakao"
import Naver from "next-auth/providers/naver"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    Kakao,
    Naver,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // 백엔드 API 호출하여 인증
      }
    })
  ],
})
```

#### 장점
- ✅ Next.js와 완벽한 통합 (App Router 지원)
- ✅ 한국 프로바이더 (카카오, 네이버) 기본 지원
- ✅ 대규모 커뮤니티와 문서화
- ✅ Middleware를 통한 라우트 보호
- ✅ TypeScript 완벽 지원
- ✅ Prisma, Drizzle 등 다양한 어댑터 지원

#### 단점
- ❌ 백엔드(NestJS)와 별도 인증 동기화 필요
- ❌ v4 → v5 마이그레이션 시 Breaking Changes 많음
- ❌ Credentials Provider 사용 시 세션 관리 복잡
- ❌ 프론트엔드 중심 설계 (백엔드 독립 사용 어려움)

#### 백엔드 통합 방법
```typescript
// NestJS에서 NextAuth 세션 검증
// JWT 토큰을 공유하거나, 별도 API 토큰 발급 필요
```

---

### 2. Better Auth

| 항목 | 내용 |
|------|------|
| **버전** | v1.3+ |
| **GitHub Stars** | 8k+ |
| **npm 주간 다운로드** | 50k+ |
| **라이센스** | MIT |
| **마지막 업데이트** | 활발 (주간 업데이트) |

#### 특징
- **프레임워크 독립적** (Next.js, Express, NestJS 등 모두 지원)
- TypeScript 우선 설계
- 플러그인 기반 확장 시스템
- 이메일/비밀번호 + 소셜 로그인 통합 지원
- 2FA, 조직(Organization), 멀티테넌시 플러그인

#### 프로바이더 설정 예시
```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb"
  }),
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
    // 네이버: Generic OAuth 또는 커스텀 프로바이더로 구현
  },
})
```

```typescript
// Next.js API Route
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

```typescript
// 클라이언트
import { createAuthClient } from "better-auth/client"

const authClient = createAuthClient()

// 소셜 로그인
await authClient.signIn.social({ provider: "google" })
await authClient.signIn.social({ provider: "kakao" })

// 이메일/비밀번호 로그인
await authClient.signIn.email({
  email: "user@example.com",
  password: "password123"
})
```

#### 장점
- ✅ **프레임워크 독립적** - 백엔드(NestJS)에서도 동일한 인증 사용 가능
- ✅ 모던 TypeScript 설계
- ✅ 플러그인으로 2FA, Organization 등 쉽게 추가
- ✅ MongoDB 어댑터 지원
- ✅ Better Auth UI (shadcn/ui 스타일 컴포넌트 제공)
- ✅ NestJS 공식 지원 (`nestjs-better-auth` 패키지)

#### 단점
- ❌ NextAuth 대비 커뮤니티 규모 작음
- ❌ 네이버 프로바이더 기본 미지원 (Generic OAuth로 구현)
- ❌ 상대적으로 새로운 라이브러리 (2024년 출시)
- ❌ 일부 엣지 케이스 문서화 부족

#### NestJS 통합
```typescript
// NestJS에서 Better Auth 사용
import { BetterAuthModule } from 'nestjs-better-auth'

@Module({
  imports: [
    BetterAuthModule.forRoot({
      // Better Auth 설정
    })
  ]
})
export class AuthModule {}
```

---

### 3. Lucia Auth

| 항목 | 내용 |
|------|------|
| **버전** | v3 |
| **GitHub Stars** | 10k+ |
| **npm 주간 다운로드** | 100k+ |
| **라이센스** | MIT |
| **마지막 업데이트** | 유지보수 모드 |

#### 특징
- **저수준 인증 라이브러리** (더 많은 제어권)
- 세션 기반 인증에 특화
- 런타임 독립적 (Node, Deno, Bun, Cloudflare Workers)
- OAuth Helper 제공 (`arctic` 라이브러리)
- 가볍고 단순한 API

#### ⚠️ 중요 공지
> Lucia v3는 2024년 기준 **유지보수 모드**로 전환되었습니다.
> 새 프로젝트의 경우 Better Auth 또는 Auth.js 권장.
> https://lucia-auth.com → 가이드 문서로 전환됨

#### 설정 예시
```typescript
// lib/auth.ts
import { Lucia } from "lucia"
import { PrismaAdapter } from "@lucia-auth/adapter-prisma"

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      name: attributes.name
    }
  }
})
```

#### 장점
- ✅ 세션 관리에 대한 완전한 제어
- ✅ 가볍고 의존성 적음
- ✅ 런타임 독립적
- ✅ 교육 목적으로 좋음 (인증 메커니즘 이해)

#### 단점
- ❌ **유지보수 모드 전환** - 새 기능 추가 없음
- ❌ OAuth 직접 구현 필요 (arctic 라이브러리 별도 사용)
- ❌ 소셜 프로바이더 통합이 수동적
- ❌ 상대적으로 보일러플레이트 코드 많음

---

### 4. Passport.js (NestJS 네이티브)

| 항목 | 내용 |
|------|------|
| **버전** | v0.7+ |
| **GitHub Stars** | 23k+ |
| **npm 주간 다운로드** | 4M+ |
| **라이센스** | MIT |
| **마지막 업데이트** | 활발 |

#### 특징
- NestJS 공식 인증 전략
- 500+ 인증 전략 (Strategy) 지원
- Express 미들웨어 기반
- 세션 또는 JWT 기반 인증

#### NestJS 설정 예시
```typescript
// auth.module.ts
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { GoogleStrategy } from './strategies/google.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [GoogleStrategy, LocalStrategy, AuthService],
})
export class AuthModule {}
```

```typescript
// google.strategy.ts
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { PassportStrategy } from '@nestjs/passport'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      scope: ['email', 'profile'],
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // 사용자 처리 로직
  }
}
```

#### 장점
- ✅ NestJS 공식 지원
- ✅ 백엔드 중심 인증 (API 서버에 적합)
- ✅ 거대한 생태계 (500+ 전략)
- ✅ 세밀한 제어 가능

#### 단점
- ❌ 프론트엔드(Next.js)와 별도 세션 관리 필요
- ❌ 각 프로바이더별 전략 파일 작성 필요
- ❌ 보일러플레이트 코드 많음
- ❌ OAuth 리다이렉트 플로우 수동 구현

---

### 5. Keycloak (Self-Hosted IAM)

| 항목 | 내용 |
|------|------|
| **버전** | v26.4+ (2025년 기준) |
| **GitHub Stars** | 25k+ |
| **라이센스** | Apache 2.0 |
| **마지막 업데이트** | 활발 (월간 릴리스) |
| **운영 방식** | Self-Hosted (Docker/Kubernetes) |

#### 특징
- **완전한 IAM(Identity and Access Management) 솔루션**
- Red Hat 후원 오픈소스 프로젝트
- SSO(Single Sign-On), 2FA, RBAC 등 엔터프라이즈 기능 내장
- OIDC, SAML 2.0, OAuth 2.0 프로토콜 지원
- 자체 관리자 콘솔 UI 제공
- Realm, Client, User, Role 등 세밀한 권한 관리

#### 아키텍처
```
[브라우저] → [Next.js] → [Keycloak Server] ← [NestJS]
                              ↓
                      [PostgreSQL/MySQL]
```

#### Next.js 통합 예시
```typescript
// NextAuth.js + Keycloak Provider
import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER, // https://keycloak.example.com/realms/myrealm
    })
  ],
})
```

#### NestJS 통합 예시
```typescript
// nest-keycloak-connect 패키지 사용
import { Module } from '@nestjs/common'
import { KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect'

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: 'https://keycloak.example.com',
      realm: 'myrealm',
      clientId: 'nestjs-api',
      secret: 'client-secret',
    }),
  ],
})
export class AuthModule {}

// Controller에서 사용
@Controller('admin')
@Resource('admin-resource')
export class AdminController {
  @Get()
  @Roles({ roles: ['admin'] })
  getAdminData() {
    return { message: 'Admin only' }
  }
}
```

#### 한국 소셜 프로바이더 지원

| 프로바이더 | 지원 방식 | 비고 |
|-----------|----------|------|
| **카카오** | ✅ OIDC 네이티브 지원 | 2022년 3월부터 OIDC 지원으로 직접 연결 가능 |
| **네이버** | ⚠️ Custom SPI 필요 | OAuth만 지원하여 별도 구현 필요 |
| **Google** | ✅ 기본 지원 | Identity Providers에서 바로 설정 |

**카카오 연결 방법**:
```
Keycloak Admin → Identity Providers → OpenID Connect v1.0
Discovery URL: https://kauth.kakao.com/.well-known/openid-configuration
```

**네이버 연결**:
- Custom Identity Provider SPI 개발 필요
- `AbstractOAuth2IdentityProvider` 확장하여 `NaverIdentityProvider` 구현
- 또는 HyperAuth 등 사전 구현된 솔루션 활용

#### 장점
- ✅ **엔터프라이즈급 기능**: SSO, 2FA, RBAC, 세션 관리 완벽 지원
- ✅ **관리자 UI 제공**: 별도 개발 없이 사용자/권한 관리
- ✅ **OIDC/SAML 표준 준수**: 다양한 시스템과 통합 용이
- ✅ **NestJS 공식 패키지**: `nest-keycloak-connect` 지원
- ✅ **NextAuth.js 기본 지원**: Keycloak Provider 내장
- ✅ **멀티테넌시 지원**: Realm 단위로 테넌트 분리
- ✅ **Self-Hosted**: 데이터 완전 통제, 규정 준수 용이

#### 단점
- ❌ **인프라 운영 필요**: 별도 서버/컨테이너 운영 (Docker, K8s)
- ❌ **MongoDB 미지원**: PostgreSQL, MySQL 등 RDBMS만 지원
- ❌ **초기 설정 복잡**: Realm, Client, Role 등 설정 필요
- ❌ **네이버 직접 지원 없음**: Custom SPI 개발 필요
- ❌ **리소스 요구량 높음**: 최소 512MB RAM, 권장 2GB+
- ❌ **러닝 커브**: IAM 개념 이해 필요

#### 운영 고려사항
```yaml
# docker-compose.yml 예시
version: '3'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:26.4.0
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: password
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    command: start-dev
    ports:
      - "8080:8080"
```

#### 적합한 사용 케이스
- 엔터프라이즈급 보안 요구사항이 있는 경우
- 여러 애플리케이션에 SSO가 필요한 경우
- 복잡한 권한 관리(RBAC)가 필요한 경우
- 규정 준수(Compliance)로 데이터 통제가 필수인 경우
- 인프라 팀이 별도로 있거나 운영 역량이 있는 경우

---

## 비교 요약표

| 기준 | NextAuth.js v5 | Better Auth | Lucia v3 | Passport.js | Keycloak |
|------|----------------|-------------|----------|-------------|----------|
| **설치 복잡도** | ⭐⭐⭐⭐⭐ 쉬움 | ⭐⭐⭐⭐ 쉬움 | ⭐⭐⭐ 보통 | ⭐⭐ 어려움 | ⭐ 복잡 |
| **Next.js 통합** | ⭐⭐⭐⭐⭐ 최고 | ⭐⭐⭐⭐ 좋음 | ⭐⭐⭐ 보통 | ⭐⭐ 별도구현 | ⭐⭐⭐⭐ NextAuth연동 |
| **NestJS 통합** | ⭐⭐ 별도구현 | ⭐⭐⭐⭐ 좋음 | ⭐⭐⭐ 보통 | ⭐⭐⭐⭐⭐ 최고 | ⭐⭐⭐⭐ 패키지지원 |
| **카카오/네이버** | ⭐⭐⭐⭐⭐ 기본지원 | ⭐⭐⭐⭐ 카카오만 | ⭐⭐ 수동구현 | ⭐⭐⭐ 전략있음 | ⭐⭐⭐ 카카오OIDC |
| **MongoDB 지원** | ⭐⭐⭐⭐ 어댑터 | ⭐⭐⭐⭐ 어댑터 | ⭐⭐⭐⭐ 어댑터 | ⭐⭐⭐⭐⭐ 직접제어 | ❌ 미지원 |
| **TypeScript** | ⭐⭐⭐⭐⭐ 완벽 | ⭐⭐⭐⭐⭐ 완벽 | ⭐⭐⭐⭐⭐ 완벽 | ⭐⭐⭐ 보통 | ⭐⭐⭐ 보통 |
| **문서화** | ⭐⭐⭐⭐⭐ 훌륭 | ⭐⭐⭐⭐ 좋음 | ⭐⭐⭐⭐ 좋음 | ⭐⭐⭐⭐ 좋음 | ⭐⭐⭐⭐⭐ 훌륭 |
| **커뮤니티** | ⭐⭐⭐⭐⭐ 거대 | ⭐⭐⭐ 성장중 | ⭐⭐⭐ 보통 | ⭐⭐⭐⭐⭐ 거대 | ⭐⭐⭐⭐⭐ 거대 |
| **유지보수** | ⭐⭐⭐⭐⭐ 활발 | ⭐⭐⭐⭐⭐ 활발 | ⭐⭐ 유지보수모드 | ⭐⭐⭐⭐ 안정적 | ⭐⭐⭐⭐⭐ 활발 |
| **2FA/MFA** | ⭐⭐⭐ 커스텀 | ⭐⭐⭐⭐⭐ 플러그인 | ⭐⭐ 수동구현 | ⭐⭐ 수동구현 | ⭐⭐⭐⭐⭐ 기본내장 |
| **SSO 지원** | ⭐⭐ 제한적 | ⭐⭐⭐ 플러그인 | ⭐⭐ 수동구현 | ⭐⭐ 수동구현 | ⭐⭐⭐⭐⭐ 핵심기능 |
| **운영 복잡도** | ⭐⭐⭐⭐⭐ 간단 | ⭐⭐⭐⭐⭐ 간단 | ⭐⭐⭐⭐ 간단 | ⭐⭐⭐⭐ 간단 | ⭐⭐ 별도인프라 |

---

## 아키텍처 옵션

### 옵션 A: 프론트엔드 중심 (NextAuth.js)
```
[브라우저] → [Next.js + NextAuth] → [NestJS API]
                    ↓
               [MongoDB]
```
- NextAuth가 인증 전담
- NestJS는 JWT 토큰 검증만 수행
- 세션은 Next.js에서 관리

### 옵션 B: 백엔드 중심 (Passport.js)
```
[브라우저] → [Next.js] → [NestJS + Passport] → [MongoDB]
                              ↓
                         [세션/JWT]
```
- NestJS가 인증 전담
- Next.js는 API 프록시 역할
- OAuth 콜백을 백엔드에서 처리

### 옵션 C: 통합형 (Better Auth)
```
[브라우저] → [Next.js + Better Auth Client]
                    ↓
            [NestJS + Better Auth Server] → [MongoDB]
```
- Better Auth가 프론트/백엔드 모두 지원
- 동일한 세션/인증 로직 공유
- 가장 일관된 개발 경험

### 옵션 D: 외부 IAM (Keycloak)
```
[브라우저] → [Next.js + NextAuth] → [Keycloak Server] ← [NestJS]
                                          ↓
                                    [PostgreSQL]
                                          ↓
                              [별도 애플리케이션 DB - MongoDB]
```
- Keycloak이 인증/인가 전담 (별도 서버)
- Next.js와 NestJS 모두 Keycloak으로 토큰 검증
- SSO, 세션 관리, 2FA 등 엔터프라이즈 기능 기본 제공
- 사용자 DB(Keycloak)와 비즈니스 DB(MongoDB) 분리

---

## 프로젝트 요구사항 매칭

| 요구사항 | 최적 솔루션 |
|----------|-------------|
| Google 로그인 | 모두 지원 |
| 카카오 로그인 | NextAuth ≥ Better Auth > Keycloak (OIDC) > Passport > Lucia |
| 네이버 로그인 | NextAuth > Passport > Better Auth (Generic) > Keycloak (SPI) > Lucia |
| 이메일/비밀번호 | Keycloak = Better Auth = NextAuth > Passport > Lucia |
| Next.js 15 지원 | NextAuth = Better Auth > Keycloak (NextAuth연동) > Lucia > Passport |
| NestJS 통합 | Keycloak = Better Auth > Passport > Lucia > NextAuth |
| MongoDB 지원 | Better Auth = NextAuth = Lucia = Passport > Keycloak (미지원) |
| 향후 2FA 추가 | Keycloak > Better Auth > NextAuth > Passport > Lucia |
| SSO (Single Sign-On) | Keycloak >> 나머지 |
| 엔터프라이즈 보안 | Keycloak >> Better Auth > NextAuth > Passport > Lucia |
| 운영 간편성 | NextAuth = Better Auth > Passport > Lucia >> Keycloak |

---

## 결론 및 권장사항

### 🏆 권장: Better Auth

**이유**:
1. **프레임워크 독립적**: Next.js와 NestJS 모두에서 동일한 인증 로직 사용 가능
2. **모던 설계**: TypeScript 우선, 플러그인 기반 확장
3. **통합 지원**: `nestjs-better-auth` 패키지로 NestJS 쉽게 통합
4. **확장성**: 2FA, Organization 등 플러그인으로 쉽게 추가
5. **MongoDB 지원**: Prisma 어댑터 + MongoDB 완벽 지원

### 🥈 대안: NextAuth.js v5

**선택 상황**:
- NestJS를 최소한으로 사용하고 Next.js 중심인 경우
- 카카오/네이버 기본 지원이 중요한 경우
- 커뮤니티 지원과 문서화가 최우선인 경우

### 🥉 엔터프라이즈 대안: Keycloak

**선택 상황**:
- SSO가 필수인 경우 (여러 애플리케이션 통합)
- 엔터프라이즈급 보안/규정 준수가 필요한 경우
- 복잡한 RBAC/권한 관리가 필요한 경우
- 인프라 운영 역량이 있는 경우

**고려사항**:
- MongoDB를 메인 DB로 사용하는 SDM 프로젝트와 DB 불일치 (Keycloak은 PostgreSQL/MySQL 필요)
- 별도 서버 운영 필요 (Docker/K8s)
- 네이버 로그인은 Custom SPI 개발 필요

### ⚠️ 비권장: Lucia Auth

**이유**: 유지보수 모드 전환으로 새 프로젝트에 부적합

---

## 참고 자료

- [NextAuth.js 공식 문서](https://authjs.dev/)
- [Better Auth 공식 문서](https://better-auth.com/)
- [Lucia Auth 공식 문서](https://lucia-auth.com/)
- [NestJS Passport 문서](https://docs.nestjs.com/security/authentication)
- [nestjs-better-auth](https://www.npmjs.com/package/nestjs-better-auth)
- [Keycloak 공식 문서](https://www.keycloak.org/documentation)
- [nest-keycloak-connect](https://www.npmjs.com/package/nest-keycloak-connect)
- [Keycloak + NextAuth 가이드](https://next-auth.js.org/providers/keycloak)
- [Keycloak 카카오 연동 가이드](https://www.sad-waterdeer.com/keycloak/2022/08/05/Keycloak-카카오톡-로그인.html)
- [Keycloak 네이버 연동 가이드](https://subji.github.io/posts/2020/07/24/keycloak4)

---

## 문서 링크
- 관련 계획: [010_auth_system_plan.md](../plan/010_auth_system_plan.md)
- 현재 상태: [current.md](../../context/current.md)
