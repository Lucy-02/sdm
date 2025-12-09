"use client";

import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [genericOAuthClient()],
});

// 편의를 위한 개별 export
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
