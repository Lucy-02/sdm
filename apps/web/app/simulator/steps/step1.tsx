'use client';

import { ArrowBigRightDash, Camera, Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { useState } from 'react';

export default function Step1() {
  const { nextStep } = useSimulatorStore();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-8">
      <div className="flex flex-col w-[600px] min-h-[860px]">
        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1.0,
            delay: 0,
            ease: [0, 0.6, 0.2, 0.9],
          }}
          className="text-4xl font-bold tracking-tight"
        >
          AI로 미리보는
        </motion.p>
        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1.0,
            delay: 0.3,
            ease: [0, 0.6, 0.2, 0.9],
          }}
          className="text-4xl font-bold tracking-tight mt-2"
        >
          나만의 웨딩사진
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
          }}
          className="flex flex-col mt-12 flex-1"
        >
          {/* 서비스 특징 카드 */}
          <div className="space-y-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-[#FFF5F5] p-3 rounded-lg">
                  <Camera className="w-6 h-6 text-[#C58D8D]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-2">AI 웨딩사진 생성</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    신랑과 신부의 사진만 있으면 AI가 자동으로 아름다운 웨딩 컨셉 사진을 생성해드립니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-[#FFF5F5] p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-[#C58D8D]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-2">맞춤 업체 추천</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    생성된 사진 스타일을 기반으로 스튜디오, 메이크업, 드레스 업체를 추천해드립니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-[#FFF5F5] p-3 rounded-lg">
                  <Sparkles className="w-6 h-6 text-[#C58D8D]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-2">빠르고 간편하게</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    복잡한 절차 없이 사진만 업로드하면 2분 안에 결과를 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 약관 동의 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.2,
            }}
            className="mt-8"
          >
            <label className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition-colors">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="w-5 h-5 accent-[#C58D8D] mx-2"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-800 mb-1">서비스 이용약관에 동의합니다</p>
                <p className="text-xs text-neutral-500">
                  업로드된 사진은 AI 분석 후 즉시 삭제되며, 제3자와 공유되지 않습니다.
                </p>
              </div>
            </label>
          </motion.div>
        </motion.div>

        {/* 버튼 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.5,
          }}
          className="flex gap-x-2 justify-center w-full mt-auto pt-4"
        >
          <button
            onClick={nextStep}
            disabled={!agreed}
            className={`flex justify-center w-full h-[60px] text-sm ${
              agreed ? 'bg-[#C58D8D] hover:bg-[#B36B6B]' : 'bg-neutral-300 cursor-not-allowed'
            } rounded-xl items-center p-4 shadow-lg transition-all`}
          >
            <p className="w-full font-semibold text-white text-center">시작하기</p>
            <ArrowBigRightDash className="p-0.5" color="#FFFFFF" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
