'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { Camera, Sparkles } from 'lucide-react';

export default function Result() {
  const { brideName, groomName, reset } = useSimulatorStore();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center w-[600px] space-y-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-3"
            >
              <h2 className="text-3xl font-bold tracking-tight">AI 분석 중입니다</h2>
              <p className="text-neutral-500">
                {brideName}님과 {groomName}님의 사진을 처리하고 있어요
              </p>
            </motion.div>

            <div className="w-full space-y-4">
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#C58D8D]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              <p className="text-center text-sm text-neutral-600">{Math.round(progress)}%</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-[800px] space-y-6"
          >
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">미리보는 웨딩사진</h1>
              <p className="text-lg text-neutral-600">
                {brideName}님과 {groomName}님의 결과
              </p>
            </div>

            <div className="relative w-full aspect-[5.5/3] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Camera className="w-20 h-20 text-neutral-300 mx-auto" />
                  <p className="text-neutral-400">생성된 이미지가 여기 표시됩니다</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 h-[200px] p-4 rounded-xl bg-neutral-100 w-full">
              <div className="flex gap-2">
                <Sparkles className="w-6 h-6 text-[#C58D8D]" />
                <p className="text-base font-semibold text-neutral-600">Ai 추천</p>
              </div>

              <div className="flex w-1/2 h-full">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold pl-1 text-neutral-600">
                    이런 드레스는 어때요?
                  </p>
                  <div className="flex w-full h-full gap-x-2">
                    <div className="flex rounded bg-gradient-to-br from-neutral-200 to-neutral-300 w-[186px] h-full"></div>
                    <div className="flex rounded bg-gradient-to-br from-neutral-200 to-neutral-300 w-[186px] h-full"></div>
                    <div className="flex rounded bg-gradient-to-br from-neutral-200 to-neutral-300 w-[186px] h-full"></div>
                    <div className="flex rounded bg-gradient-to-br from-neutral-200 to-neutral-300 w-[186px] h-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button className="flex-1 bg-[#C58D8D] hover:bg-[#B36B6B] text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                회원가입하러 가기
              </button>
              <button className="flex-1 bg-[#C58D8D] hover:bg-[#B36B6B] text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                스튜디오 예약하기
              </button>
            </div>

            {/* <div className="w-full bg-white rounded-xl border border-neutral-200 p-6 space-y-4 mt-4">
              <h3 className="text-xl font-bold text-center">추천 서비스</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { title: '스튜디오', emoji: '📸' },
                  { title: '메이크업', emoji: '💄' },
                  { title: '예복', emoji: '👗' },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="bg-neutral-50 hover:bg-neutral-100 rounded-lg p-4 transition-colors border border-neutral-200"
                  >
                    <div className="text-3xl mb-1">{item.emoji}</div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                  </button>
                ))}
              </div>
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
