'use client';

import { ArrowBigRightDash, Link } from 'lucide-react';
import { motion } from 'motion/react';

export default function Step1() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-left w-[600px] h-[800px]">
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
          시작하기에 앞서
        </motion.p>
        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1.0,
            delay: 0.6,
            ease: [0, 0.6, 0.2, 0.9],
          }}
          className="text-4xl font-bold tracking-tight mt-2"
        >
          기본적인 정보들이 필요해요.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 1.2,
          }}
          className="flex flex-col mt-8"
        >
          <input
            placeholder="신부님 이름을 입력해주세요."
            className="border-2 border-[#B36B6B] p-4 mt-2 rounded-lg border-opacity-60 placeholder-neutral-500 text-base"
          />
          <input
            placeholder="신랑님 이름을 입력해주세요."
            className="border-2 border-[#4682B4] p-4 mt-2 rounded-lg border-opacity-60 placeholder-neutral-500 text-base"
          />

          <div className="flex flex-col mt-12 gap-y-2 items-right">
            <div className="flex justify-center items-center px-2 py-1 text-sm text-neutral-500">
              I agree with privacy policy. <input type="checkbox" className="ml-2" />
            </div>
            <div className="flex justify-center items-center px-2 py-1 text-sm text-neutral-500">
              어쩌구 저쩌구 약관에 동의합니다. <input type="checkbox" className="ml-2" />
            </div>
          </div>

        <div className='flex gap-x-2 justify-center w-full'> 
          <button
            className={`flex justify-center w-[240px] h-[70px] text-sm border-2 border-[#C58D8D] rounded-xl items-center p-4 mt-12 shadow-lg`}
          >
            <p className="w-full font-semibold text-[#C58D8D] text-center">회원가입하러 가기</p>

            <ArrowBigRightDash className="p-0.5" color="#C58D8D" />
          </button>
          <button
            className={`flex justify-center w-[240px] h-[70px] text-sm bg-[#C58D8D] rounded-xl items-center p-4 mt-12 shadow-lg`}
          >
            <p className="w-full font-semibold text-white text-center">다음 단계로</p>

            <ArrowBigRightDash className="p-0.5" color="#FFFFFF" />
          </button>
        </div>
        </motion.div>
      </div>
    </div>
  );
}
