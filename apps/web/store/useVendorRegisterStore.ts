import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OwnerFormData,
  VendorFormData,
  VendorAgreements,
  RegisterStep,
} from '@/types/vendor-register';

interface VendorRegisterState {
  // 현재 스텝
  step: RegisterStep;

  // 초대 토큰
  inviteToken: string;

  // Step 1 데이터
  owner: OwnerFormData;

  // Step 2 데이터
  vendor: VendorFormData;

  // 약관 동의
  agreements: VendorAgreements;

  // 로딩 상태
  isLoading: boolean;

  // 에러 메시지
  error: string;

  // 액션
  setStep: (step: RegisterStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setInviteToken: (token: string) => void;
  updateOwner: (data: Partial<OwnerFormData>) => void;
  updateVendor: (data: Partial<VendorFormData>) => void;
  setAgreements: (agreements: Partial<VendorAgreements>) => void;
  setAllAgreements: (checked: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialOwner: OwnerFormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  businessNumber: '',
};

const initialVendor: VendorFormData = {
  name: '',
  categoryId: '',
  location: '',
  description: '',
  phone: '',
  email: '',
  website: '',
  priceRange: '',
  priceMin: undefined,
  priceMax: undefined,
  businessHours: {},
  images: [],
  tags: [],
  metadata: {},
};

const initialAgreements: VendorAgreements = {
  all: false,
  terms: false,
  privacy: false,
  vendorTerms: false,
  marketing: false,
};

export const useVendorRegisterStore = create<VendorRegisterState>()(
  persist(
    (set) => ({
      // 초기 상태
      step: 1,
      inviteToken: '',
      owner: initialOwner,
      vendor: initialVendor,
      agreements: initialAgreements,
      isLoading: false,
      error: '',

      // 스텝 관리
      setStep: (step) => set({ step }),
      nextStep: () =>
        set((state) => ({
          step: state.step === 1 ? 2 : state.step,
        })),
      prevStep: () =>
        set((state) => ({
          step: state.step === 2 ? 1 : state.step,
        })),

      // 토큰 설정
      setInviteToken: (token) => set({ inviteToken: token }),

      // Owner 정보 업데이트
      updateOwner: (data) =>
        set((state) => ({
          owner: { ...state.owner, ...data },
        })),

      // Vendor 정보 업데이트
      updateVendor: (data) =>
        set((state) => ({
          vendor: { ...state.vendor, ...data },
        })),

      // 약관 동의 업데이트
      setAgreements: (agreements) =>
        set((state) => {
          const newAgreements = { ...state.agreements, ...agreements };
          // 전체 동의 체크 상태 업데이트
          newAgreements.all =
            newAgreements.terms &&
            newAgreements.privacy &&
            newAgreements.vendorTerms &&
            newAgreements.marketing;
          return { agreements: newAgreements };
        }),

      // 전체 동의
      setAllAgreements: (checked) =>
        set({
          agreements: {
            all: checked,
            terms: checked,
            privacy: checked,
            vendorTerms: checked,
            marketing: checked,
          },
        }),

      // 로딩/에러 상태
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // 초기화
      reset: () =>
        set({
          step: 1,
          inviteToken: '',
          owner: initialOwner,
          vendor: initialVendor,
          agreements: initialAgreements,
          isLoading: false,
          error: '',
        }),
    }),
    {
      name: 'vendor-register-storage',
      partialize: (state) => ({
        // persist에서 제외할 필드: password, isLoading, error
        step: state.step,
        inviteToken: state.inviteToken,
        owner: {
          ...state.owner,
          password: '',
          confirmPassword: '',
        },
        vendor: state.vendor,
        agreements: state.agreements,
      }),
    }
  )
);
