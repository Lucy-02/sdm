import { NextRequest, NextResponse } from "next/server";
import { db, mongoClient } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

// 슬러그 생성 유틸 (한글 지원)
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  // 유니크성을 위해 타임스탬프 추가
  const timestamp = Date.now().toString(36);
  return `${base}-${timestamp}`;
}

export async function POST(request: NextRequest) {
  const session = await mongoClient.startSession();

  try {
    const body = await request.json();
    const { inviteToken, owner, vendor } = body;

    // 1. 필수 데이터 검증
    if (!inviteToken || !owner || !vendor) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 2. 초대 토큰 재검증
    const invite = await db.collection("VendorInvite").findOne({
      token: inviteToken,
    });

    if (!invite) {
      return NextResponse.json(
        { error: "유효하지 않은 초대 링크입니다." },
        { status: 400 }
      );
    }

    if (new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "만료된 초대 링크입니다." },
        { status: 400 }
      );
    }

    if (invite.usedAt) {
      return NextResponse.json(
        { error: "이미 사용된 초대 링크입니다." },
        { status: 400 }
      );
    }

    // 이메일 제한 확인
    if (invite.email && invite.email !== owner.email) {
      return NextResponse.json(
        { error: "초대된 이메일 주소와 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // 3. 이메일 중복 확인
    const existingUser = await db.collection("User").findOne({
      email: owner.email,
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 가입된 이메일입니다." },
        { status: 400 }
      );
    }

    // 4. 트랜잭션 시작
    session.startTransaction();

    try {
      // 5. Better Auth로 사용자 생성 (API 호출)
      const signUpResponse = await auth.api.signUpEmail({
        body: {
          email: owner.email,
          password: owner.password,
          name: owner.name,
        },
        headers: await headers(),
      });

      if (!signUpResponse || !signUpResponse.user) {
        throw new Error("사용자 생성에 실패했습니다.");
      }

      const userId = signUpResponse.user.id;

      // 6. User 문서 업데이트 (role, phone 추가)
      await db.collection("User").updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            role: "VENDOR",
            phone: owner.phone,
          },
        },
        { session }
      );

      // 7. Vendor 문서 생성
      const vendorSlug = generateSlug(vendor.name);

      const vendorDoc = {
        _id: new ObjectId(),
        categoryId: new ObjectId(vendor.categoryId),
        ownerId: new ObjectId(userId),
        name: vendor.name,
        slug: vendorSlug,
        description: vendor.description || null,
        phone: vendor.phone || null,
        email: vendor.email || null,
        website: vendor.website || null,
        location: vendor.location,
        lat: null,
        lng: null,
        priceRange: vendor.priceRange || null,
        priceMin: vendor.priceMin || null,
        priceMax: vendor.priceMax || null,
        businessHours: vendor.businessHours || null,
        tags: vendor.tags || [],
        images: vendor.images || [],
        metadata: vendor.metadata || null,
        rating: 0,
        reviewCount: 0,
        bookingCount: 0,
        favoriteCount: 0,
        viewCount: 0,
        isVerified: false,
        isActive: true,
        isPremium: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("Vendor").insertOne(vendorDoc, { session });

      // 8. 초대 토큰 사용 처리
      await db.collection("VendorInvite").updateOne(
        { _id: invite._id },
        {
          $set: {
            usedAt: new Date(),
            usedBy: new ObjectId(userId),
          },
        },
        { session }
      );

      // 9. 트랜잭션 커밋
      await session.commitTransaction();

      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          email: owner.email,
          name: owner.name,
          role: "VENDOR",
        },
        vendor: {
          id: vendorDoc._id.toString(),
          name: vendor.name,
          slug: vendorSlug,
        },
      });
    } catch (txError) {
      // 트랜잭션 롤백
      await session.abortTransaction();
      throw txError;
    }
  } catch (error) {
    console.error("[VendorRegister] Error:", error);

    if (error instanceof Error) {
      // Better Auth 에러 처리
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          { error: "이미 가입된 이메일입니다." },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "회원가입 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}
