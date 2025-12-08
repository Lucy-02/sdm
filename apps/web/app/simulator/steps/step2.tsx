'use client';

import { ArrowBigRightDash, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import ImageCarousel from '@/components/ui/ImageCarousel';

export default function Step2() {
  const { prevStep, nextStep } = useSimulatorStore();
  const [theme, setTheme] = useState<'none' | 'studio' | 'dress'>('none');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center py-8">
      <div className="flex flex-col w-[600px] min-h-[860px] justify-between">
        {/* Title */}
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
          미리보고 싶은
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
          웨딩사진을 골라주세요
        </motion.p>

        {/* Theme Selection Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
          }}
          className="flex w-full gap-x-3 justify-center mt-8"
        >
          <button
            onClick={() => setTheme('studio')}
            className={`flex justify-center items-center flex-1 h-[60px] text-base font-semibold border-2 ${
              theme === 'studio'
                ? 'bg-[#B36B6B] text-white border-[#B36B6B]'
                : 'text-[#B36B6B] border-[#B36B6B] border-opacity-60 hover:border-opacity-100'
            } rounded-lg transition-all shadow-sm`}
          >
            스튜디오 샷
          </button>
          <button
            onClick={() => setTheme('dress')}
            className={`flex justify-center items-center flex-1 h-[60px] text-base font-semibold border-2 ${
              theme === 'dress'
                ? 'bg-[#B36B6B] text-white border-[#B36B6B]'
                : 'text-[#B36B6B] border-[#B36B6B] border-opacity-60 hover:border-opacity-100'
            } rounded-lg transition-all shadow-sm`}
          >
            드레스 단독 샷
          </button>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={theme !== 'none' ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.6,
            delay: 0,
          }}
          className="flex flex-col mt-4 flex-1"
        >
          {theme === 'studio' && (
            <div className="flex flex-col gap-y-4 w-full overflow-hidden">
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex border-2 border-neutral-400 px-4 py-3 rounded-lg border-opacity-60 hover:border-opacity-100 transition-all bg-white shadow-sm"
              >
                <input
                  onChange={e => {
                    if (e.target.value.length > 0) {
                      setIsTyping(true);
                    } else {
                      setIsTyping(false);
                    }
                  }}
                  className="placeholder-neutral-400 text-base w-full outline-none"
                  placeholder="테마 또는 업체명을 입력해주세요."
                />
                <Search className="ml-2 text-neutral-400" />
              </motion.div>

              {/* Image Carousel or Search Result */}
              {isTyping ? (
                <div className="relative w-full">
                  {/* Grid Container */}
                  <div className="flex gap-4 w-full">
                    {/* Search Result Item */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setSelectedVendor('늘봄 스튜디오')}
                      className={`bg-gradient-to-br from-neutral-300 to-neutral-400 rounded-lg cursor-pointer hover:shadow-md ${
                        selectedVendor ? 'w-[220px]' : 'w-[220px]'
                      } h-[150px] flex-shrink-0`}
                    ></motion.div>

                    {/* Selected Vendor Info - Right Side */}
                    {selectedVendor && (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: [0, 0.8, 0.2, 1] }}
                        className="flex flex-col gap-y-1.5 p-3 rounded-lg bg-neutral-50 border border-neutral-200 flex-1 h-[150px]"
                      >
                        <div className="flex items-center bg-[#B36B6B] text-white px-2 py-1.5 rounded">
                          <p className="text-sm font-semibold tracking-tight">스튜디오 정보</p>
                        </div>
                        <div className="flex flex-col gap-y-1 px-2 flex-1 justify-center">
                          <p className="text-base font-semibold text-neutral-800">{selectedVendor}</p>
                          <p className="text-xs text-neutral-600">서울특별시 강남구 청담동</p>
                          <p className="text-sm font-medium text-[#B36B6B] mt-1">예상 가격: 150~200만원</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Detail Info - Bottom Side */}
                  {selectedVendor && (
                    <motion.div
                      initial={{ opacity: 0, y: -40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2, ease: [0, 0.8, 0.2, 1] }}
                      className="flex flex-col w-full mt-4 p-4 rounded-lg bg-neutral-50 gap-y-2 shadow-sm border border-neutral-200"
                    >
                      <div className="flex items-center bg-[#B36B6B] text-white px-2 py-1.5 rounded">
                        <p className="text-sm font-semibold tracking-tight">샘플 작품</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="w-[260px] h-[120px] bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-lg shadow-sm"></div>
                      </div>
                      <ImageCarousel
                        itemHeight={120}
                        delay={1}
                        repeatDelay={2}
                        className="rounded-lg"
                      />
                    </motion.div>
                  )}
                </div>
              ) : (
                <ImageCarousel
                  itemHeight={120}
                  delay={2}
                  repeatDelay={2}
                />
              )}
            </div>
          )}

          {theme === 'dress' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-[300px]"
            >
              <p className="text-2xl font-semibold text-[#B36B6B] mb-2">드레스 단독 사진</p>
              <p className="text-neutral-500">준비 중입니다</p>
            </motion.div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.9,
          }}
          className="flex gap-x-2 justify-center w-full mb-6"
        >
          <button
            onClick={prevStep}
            className="flex justify-center w-[300px] h-[60px] text-sm border-2 border-[#C58D8D] rounded-xl items-center p-4 shadow-lg hover:border-opacity-100 hover:bg-[#FFF5F5] transition-all"
          >
            <p className="w-full font-semibold text-[#C58D8D] text-center">이전 단계로</p>
          </button>
          <button
            onClick={nextStep}
            className="flex justify-center w-[300px] h-[60px] text-sm bg-[#C58D8D] rounded-xl items-center p-4 shadow-lg hover:bg-[#B36B6B] transition-all"
          >
            <p className="w-full font-semibold text-white text-center">다음 단계로</p>
            <ArrowBigRightDash className="p-0.5" color="#FFFFFF" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
