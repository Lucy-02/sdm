import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "토큰이 필요합니다." },
        { status: 400 }
      );
    }

    // 토큰 조회
    const invite = await db.collection("VendorInvite").findOne({ token });

    if (!invite) {
      return NextResponse.json(
        { valid: false, error: "유효하지 않은 초대 링크입니다." },
        { status: 404 }
      );
    }

    // 만료 확인
    if (new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json(
        { valid: false, error: "만료된 초대 링크입니다." },
        { status: 410 }
      );
    }

    // 이미 사용됨
    if (invite.usedAt) {
      return NextResponse.json(
        { valid: false, error: "이미 사용된 초대 링크입니다." },
        { status: 410 }
      );
    }

    return NextResponse.json({
      valid: true,
      invite: {
        id: invite._id.toString(),
        email: invite.email || null,
        categoryId: invite.categoryId || null,
        expiresAt: invite.expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[VendorInvite] Validation error:", error);
    return NextResponse.json(
      { valid: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
