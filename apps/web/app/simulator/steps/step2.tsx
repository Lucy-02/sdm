'use client';

import { ArrowBigRightDash, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function Step2() {
  const [theme, setTheme] = useState<'none' | 'studio' | 'dress'>('none');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-[600px] h-[800px]">
        <motion.div className="text-4xl font-bold tracking-tight">
          미리보고 싶은 웨딩사진을 골라주세요
        </motion.div>

        <div className="flex w-full gap-x-2 p-2 justify-center mt-8">
          <button
            onClick={() => setTheme('studio')}
            className={`flex justify-center items-center w-[280px] h-[60px] text-base font-semibold border-2 border-opacity-60 border-[#B36B6B] ${theme === 'studio' ? 'bg-[#B36B6B] text-white' : 'text-[#B36B6B]'} rounded-lg`}
          >
            스튜디오 사진
          </button>
          <button
            onClick={() => setTheme('dress')}
            className={`flex justify-center items-center w-[280px] h-[60px] text-base font-semibold border-2 border-opacity-60 border-[#B36B6B] ${theme === 'dress' ? 'bg-[#B36B6B] text-white' : 'text-[#B36B6B]'} rounded-lg`}
          >
            드레스 단독 사진
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={theme !== 'none' ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 1,
            delay: 0,
          }}
          className="flex flex-col mt-6"
        >
          {theme === 'none' && (
            // <p className="text-neutral-500">원하는 사진 테마를 선택해주세요.</p>
            <></>
          )}
          {theme === 'studio' && (
            <div className="flex flex-col gap-y-2 w-full overflow-hidden">
              <div className="flex border-2 border-neutral-500 p-4 mt-2 rounded-lg border-opacity-60">
                <input
                  onChange={e => {
                    if (e.target.value.length > 0) {
                      setIsTyping(true);
                    } else {
                      setIsTyping(false);
                    }
                  }}
                  className="placeholder-neutral-500 text-base w-full"
                  placeholder="테마 또는 업체명을 입력해주세요."
                />
                <Search className="ml-2" />
              </div>

              {isTyping ? (
                <div
                  onClick={() => setSelectedVendor('늘봄 스튜디오')}
                  className="w-[220px] h-[150px] bg-neutral-500"
                ></div>
              ) : (
                <motion.div
                  animate={{
                    x: [0, 0, -228, -228, -456, -456, -684, -684, -912, -912, 0],
                  }}
                  transition={{
                    duration: 15,
                    delay: 3,
                    ease: [0, 0.7, 0.2, 1],
                    repeat: Infinity,
                    repeatDelay: 3,
                    repeatType: 'loop',
                  }}
                  className="flex gap-x-2 h-[150px] py-2"
                >
                  <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                  <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                  <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                  <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                  <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                  <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                  <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                  <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                  <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                  <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                </motion.div>
              )}

              {selectedVendor && (
                <div className="flex flex-col w-full mt-8 p-2 rounded-md bg-neutral-100 gap-y-2 overflow-hidden">
                  <p className="text-xl font-semibold tracking-tight bg-neutral-500 text-white pl-3 py-2 rounded">
                    선택 스튜디오 정보
                  </p>
                  <div className="flex justify-between">
                    <p className="text-lg p-2">{selectedVendor}</p>
                    <div className="w-[260px] h-[130px] bg-neutral-300"></div>
                  </div>
                  <motion.div
                    animate={{
                      x: [0, 0, -228, -228, -456, -456, -684, -684, -912, -912, 0],
                    }}
                    transition={{
                      duration: 15,
                      delay: 3,
                      ease: [0, 0.7, 0.2, 1],
                      repeat: Infinity,
                      repeatDelay: 3,
                      repeatType: 'loop',
                    }}
                    className="flex gap-x-2 h-[150px]"
                  >
                    <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                    <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                    <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                    <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                    <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                    <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                    <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                    <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                    <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                    <div className="min-w-[220px] h-[150px] bg-neutral-300"></div>
                  </motion.div>
                </div>
              )}
            </div>
          )}
          {theme === 'dress' && (
            // <p className="text-[#B36B6B] font-semibold">드레스 단독 사진 테마를 선택하셨습니다.</p>
            <></>
          )}
        </motion.div>
      </div>
    </div>
  );
}
