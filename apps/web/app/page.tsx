'use client';

import { ArrowBigRightDash, ArrowBigRightDashIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [expand, setExpand] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">TITLE</h1>
      </div>
      <motion.div
        onHoverStart={() => {
          setExpand(true);
        }}
        initial={{ opacity: 1, width: '300px', height: '60px' }}
        animate={expand ? { opacity: 1, width: '1000px', height: '480px' } : {}}
        transition={{
          duration: 0.45,
          delay: 0,
          ease: [0, 0.7, 0.2, 1],
        }}
        className="flex flex-col rounded-xl border-neutral-300 border-[2px] p-4 shadow-lg"
      >
        <div className="flex gap-x-2">
          <input
            onFocus={() => {
              setExpand(true);
            }}
            className="text-sm  placeholder-neutral-500 text-neutral-900 w-full"
            placeholder="관심있는 업체 이름을 입력해 보세요."
          />
          <ArrowBigRightDash className="hover:bg-neutral-200 rounded-full p-0.5" color="#3F3F3F" />
        </div>

        <div className={`flex-col mt-4 gap-y-2 overflow-hidden h-full ${expand ? '' : 'hidden'}`}>
          <div className="text-neutral-500 font-semibold text-sm pl-1">이런 스튜디오는 어때요?</div>
          <motion.div
            animate={{
              x: [0, 0, -228, -228, -456, -456, -684, -684, -912, -912],
            }}
            transition={{
              duration: 15,
              delay: 6,
              ease: [0, 0.61, 0.2, 0.95],
              repeat: Infinity,
              repeatDelay: 3,
              repeatType: 'loop',
            }}
            className="flex gap-x-2 h-[170px] py-2"
          >
            <div className="min-w-[220px] h-full bg-rose-200"></div>
            <div className="min-w-[220px] h-full bg-rose-200"></div>
            <div className="min-w-[220px] h-full bg-rose-200"></div>
            <div className="min-w-[220px] h-full bg-rose-200"></div>
            <div className="min-w-[220px] h-full bg-rose-200"></div>
            <div className="min-w-[220px] h-full bg-rose-200"></div>
            <div className="min-w-[220px] h-full bg-rose-200"></div>
            <div className="min-w-[220px] h-full bg-rose-200"></div>
            <div className="min-w-[220px] h-full bg-rose-200"></div>
            <div className="min-w-[220px] h-full bg-rose-200"></div>
          </motion.div>
          <div className="text-neutral-500 font-semibold text-sm pl-1 mt-2">
            요즘 뜨는 예복이에요.
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
            className="flex gap-x-2 h-[170px] py-2"
          >
            <div className="min-w-[220px] h-full bg-neutral-300"></div>
            <div className="min-w-[220px] h-full bg-neutral-300"></div>
            <div className="min-w-[220px] h-full bg-neutral-300"></div>
            <div className="min-w-[220px] h-full bg-neutral-300"></div>
            <div className="min-w-[220px] h-full bg-neutral-300"></div>
            <div className="min-w-[220px] h-full bg-neutral-300"></div>
            <div className="min-w-[220px] h-full bg-neutral-300"></div>
            <div className="min-w-[220px] h-full bg-neutral-300"></div>
            <div className="min-w-[220px] h-full bg-neutral-300"></div>
            <div className="min-w-[220px] h-full bg-neutral-300"></div>
          </motion.div>
        </div>
      </motion.div>

      <Link
        href="/simulator"
        className="flex justify-center min-w-[300px] text-sm bg-[#C58D8D] rounded-xl items-center p-4 shadow-xl"
      >
        <button className="w-full font-semibold text-white text-center">무료로 체험 해보기</button>

        <ArrowBigRightDash className="p-0.5" color="#FFFFFF" />
      </Link>
    </main>
  );
}
