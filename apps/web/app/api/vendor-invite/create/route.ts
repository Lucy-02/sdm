import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { randomBytes } from "crypto";

// 토큰 생성 유틸
function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, categoryId, expiresInDays = 7 } = body;

    // TODO: 실제 구현시 관리자 인증 필요
    // 현재는 테스트용으로 인증 없이 생성 허용

    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // 임시 관리자 ID (테스트용)
    const createdBy = new ObjectId();

    const invite = {
      _id: new ObjectId(),
      token,
      email: email || null,
      categoryId: categoryId ? new ObjectId(categoryId) : null,
      expiresAt,
      usedAt: null,
      usedBy: null,
      createdBy,
      createdAt: new Date(),
    };

    await db.collection("VendorInvite").insertOne(invite);

    return NextResponse.json({
      token,
      expiresAt: expiresAt.toISOString(),
      inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/vendor-register?token=${token}`,
    });
  } catch (error) {
    console.error("[VendorInvite] Create error:", error);
    return NextResponse.json(
      { error: "초대 토큰 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
