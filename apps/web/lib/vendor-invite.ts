import type { VendorInviteValidation } from '@/types/vendor-register';

/**
 * 초대 토큰 검증 API 호출
 */
export async function validateInviteToken(
  token: string
): Promise<VendorInviteValidation> {
  try {
    const response = await fetch(
      `/api/vendor-invite/validate?token=${encodeURIComponent(token)}`
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        valid: false,
        error: error.message || '토큰 검증에 실패했습니다.',
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Token validation error:', error);
    return {
      valid: false,
      error: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}

/**
 * 초대 토큰이 유효한지 확인 (만료 시간 체크)
 */
export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

/**
 * 초대 토큰 생성 (관리자용)
 */
export async function createInviteToken(options: {
  email?: string;
  categoryId?: string;
  expiresInDays?: number;
}): Promise<{ token: string; expiresAt: string } | { error: string }> {
  try {
    const response = await fetch('/api/vendor-invite/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || '토큰 생성에 실패했습니다.' };
    }

    return await response.json();
  } catch (error) {
    console.error('Token creation error:', error);
    return { error: '서버 연결에 실패했습니다.' };
  }
}
