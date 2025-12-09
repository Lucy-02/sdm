import { Auth } from "@/lib/auth";

// Better Auth 사용자 타입 확장
declare module "better-auth" {
  interface User {
    role: "CUSTOMER" | "VENDOR" | "ADMIN";
    phone?: string;
  }
}

export type Session = Awaited<
  ReturnType<(typeof Auth.prototype.api)["getSession"]>
>;
