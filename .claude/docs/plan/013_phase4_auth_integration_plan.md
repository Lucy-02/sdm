# 013 - Phase 4: 로그인/회원가입 페이지 Better Auth 연동

> **생성일**: 2025-12-09
> **상태**: ✅ 완료
> **관련 문서**: [012_phase3_implementation_plan.md](012_phase3_implementation_plan.md), [011_better_auth_guide.md](../DKB/011_better_auth_guide.md)

## 개요

Phase 3에서 Better Auth API가 완성되었습니다.
Phase 4에서는 기존 로그인/회원가입 UI를 Better Auth API와 연동합니다.

## 현재 상태

### 기존 UI 분석
- `/login` 페이지: 이메일/비밀번호 로그인 + 소셜 로그인 버튼 (Google, Kakao, Naver)
- `/register` 페이지: 이름, 이메일, 전화번호, 비밀번호 입력 + 약관 동의 + 소셜 가입
- 현재 상태: TODO 주석만 있고 실제 API 연결 없음

### Better Auth API 엔드포인트
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/auth/sign-up/email` | 이메일 회원가입 |
| POST | `/api/auth/sign-in/email` | 이메일 로그인 |
| GET | `/api/auth/sign-in/social?provider=xxx` | 소셜 로그인 시작 |
| POST | `/api/auth/sign-out` | 로그아웃 |
| GET | `/api/auth/get-session` | 세션 조회 |

---

## 구현 단계

### Step 1: 회원가입 페이지 연동 (`/register`)
- [x] Better Auth signUp 호출
- [x] 에러 처리 (이미 존재하는 이메일 등)
- [x] 성공 시 자동 로그인 및 리다이렉트
- [x] 로딩 상태 표시

### Step 2: 로그인 페이지 연동 (`/login`)
- [x] Better Auth signIn.email 호출
- [x] 에러 처리 (잘못된 비밀번호 등)
- [x] callbackUrl 처리 (로그인 후 원래 페이지로)
- [x] 로딩 상태 표시

### Step 3: 소셜 로그인 연동
- [x] Google 로그인 버튼 연동
- [x] Kakao 로그인 버튼 연동
- [x] Naver 로그인 버튼 연동 (Generic OAuth)

### Step 4: 헤더 인증 상태 표시
- [x] 로그인 상태에 따른 헤더 UI 변경
- [x] 사용자 프로필 드롭다운
- [x] 로그아웃 기능

### Step 5: 보호된 페이지 처리
- [x] 미인증 시 로그인 페이지로 리다이렉트 (middleware.ts)
- [x] 세션 만료 처리 (Better Auth 자동 처리)

---

## 코드 변경 사항

### 1. 회원가입 페이지 수정

```tsx
// apps/web/app/register/page.tsx
import { signUp } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    await signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });
    router.push('/');
  } catch (err) {
    setError('회원가입에 실패했습니다. 다시 시도해주세요.');
  } finally {
    setLoading(false);
  }
};
```

### 2. 로그인 페이지 수정

```tsx
// apps/web/app/login/page.tsx
import { signIn } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    await signIn.email({
      email,
      password,
    });
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    router.push(callbackUrl);
  } catch (err) {
    setError('이메일 또는 비밀번호가 올바르지 않습니다.');
  } finally {
    setLoading(false);
  }
};
```

### 3. 소셜 로그인

```tsx
// 소셜 로그인 버튼 핸들러
const handleGoogleLogin = () => {
  signIn.social({ provider: 'google' });
};

const handleKakaoLogin = () => {
  signIn.social({ provider: 'kakao' });
};

const handleNaverLogin = () => {
  signIn.social({ provider: 'naver' });
};
```

### 4. 헤더 컴포넌트 수정

```tsx
// apps/web/components/layout/Header.tsx
'use client';
import { useSession, signOut } from '@/lib/auth-client';

export function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header>
      {isPending ? (
        <Skeleton />
      ) : session ? (
        <UserMenu user={session.user} onSignOut={() => signOut()} />
      ) : (
        <Link href="/login">로그인</Link>
      )}
    </header>
  );
}
```

---

## 체크리스트

### Step 1: 회원가입
- [ ] signUp.email 연동
- [ ] 에러 메시지 표시
- [ ] 로딩 스피너
- [ ] 성공 시 리다이렉트

### Step 2: 로그인
- [ ] signIn.email 연동
- [ ] 에러 메시지 표시
- [ ] callbackUrl 처리
- [ ] 로딩 스피너

### Step 3: 소셜 로그인
- [ ] Google 버튼
- [ ] Kakao 버튼
- [ ] Naver 버튼

### Step 4: 헤더
- [ ] useSession 훅 사용
- [ ] 로그인/로그아웃 상태 표시
- [ ] 사용자 메뉴

### Step 5: 보호된 페이지
- [ ] 미들웨어 동작 확인
- [ ] 리다이렉트 테스트

---

## 관련 파일

| 파일 | 변경 내용 |
|------|----------|
| `apps/web/app/login/page.tsx` | signIn 연동 |
| `apps/web/app/register/page.tsx` | signUp 연동 |
| `apps/web/components/layout/Header.tsx` | useSession, signOut 연동 |
| `apps/web/lib/auth-client.ts` | 이미 완료 (Phase 3) |

---

## 예상 이슈

1. **CORS**: 소셜 로그인 콜백 시 CORS 에러 가능 → OAuth 앱 설정 확인
2. **리다이렉트**: 소셜 로그인 후 원래 페이지로 돌아오기 → callbackURL 설정
3. **세션 쿠키**: Secure 쿠키 설정 (프로덕션) → HTTPS 필요
