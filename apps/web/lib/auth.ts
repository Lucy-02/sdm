import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { genericOAuth } from "better-auth/plugins";
import { mongoClient, db } from "./mongodb";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",

  database: mongodbAdapter(db, {
    client: mongoClient, // 트랜잭션 지원을 위해 client 전달
  }),

  // 이메일/비밀번호 인증
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // MVP에서는 비활성화
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

  // Naver는 Generic OAuth로 설정 (기본 지원 안 됨)
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
            const response = await fetch(
              "https://openapi.naver.com/v1/nid/me",
              {
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              }
            );
            const data = await response.json();

            // Naver API response: { resultcode, message, response: { id, email, name, profile_image, ... } }
            if (data.resultcode !== "00") {
              throw new Error(`Naver API error: ${data.message}`);
            }

            const user = data.response;
            return {
              id: user.id,
              email: user.email,
              name: user.name || user.nickname,
              image: user.profile_image,
              emailVerified: true, // Naver는 인증된 이메일만 제공
            };
          },
        },
      ],
    }),
  ],

  // 사용자 추가 필드
  user: {
    modelName: "User", // Prisma 스키마와 일치시키기 위해 대문자 사용
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

  // 세션 컬렉션 이름 설정
  session: {
    modelName: "Session", // Prisma 스키마와 일치
    expiresIn: 60 * 60 * 24 * 7, // 7일
    updateAge: 60 * 60 * 24, // 24시간마다 갱신
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5분 캐시
    },
  },

  // 계정 컬렉션 이름 설정
  account: {
    modelName: "Account", // Prisma 스키마와 일치
  },

  // 콜백 함수
  callbacks: {
    onUserCreated: async (user: { id: string }) => {
      console.log("[Auth] New user created:", user.id);
    },
  },
});

export type Auth = typeof auth;
