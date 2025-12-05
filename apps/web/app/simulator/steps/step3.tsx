'use client';

import { ArrowBigRightDash, Upload, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { useSimulatorStore } from '@/store/useSimulatorStore';

export default function Step3() {
  const { brideName, groomName, setBrideName, setGroomName, prevStep, nextStep } = useSimulatorStore();

  const [brideImage, setBrideImage] = useState<File | null>(null);
  const [groomImage, setGroomImage] = useState<File | null>(null);
  const [bridePreview, setBridePreview] = useState<string | null>(null);
  const [groomPreview, setGroomPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const brideInputRef = useRef<HTMLInputElement>(null);
  const groomInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'bride' | 'groom') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      if (type === 'bride') {
        setBrideImage(file);
        setBridePreview(preview);
      } else {
        setGroomImage(file);
        setGroomPreview(preview);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (type: 'bride' | 'groom') => {
    if (type === 'bride') {
      setBrideImage(null);
      setBridePreview(null);
      if (brideInputRef.current) brideInputRef.current.value = '';
    } else {
      setGroomImage(null);
      setGroomPreview(null);
      if (groomInputRef.current) groomInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!brideImage || !groomImage) {
      alert('신부님과 신랑님 사진을 모두 업로드해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('brideImage', brideImage);
      formData.append('groomImage', groomImage);

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('업로드 실패');
      }

      const result = await response.json();
      console.log('Upload success:', result);

      // TODO: 다음 단계로 이동
      alert('업로드 성공! 이제 AI가 사진을 처리합니다.');
    } catch (error) {
      console.error('Upload error:', error);
      alert('업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-8">
      <div className="flex flex-col items-center w-[600px] min-h-[860px]">
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
          사진을 업로드해주세요
        </motion.p>
        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1.0,
            delay: 0.3,
            ease: [0, 0.6, 0.2, 0.9],
          }}
          className="text-sm text-neutral-500 mt-4 text-center"
        >
          신부님과 신랑님의 정면 사진을 각각 업로드해주세요<br />
          얼굴은 자동으로 인식됩니다
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.6,
          }}
          className="flex gap-x-4 mt-8 w-full"
        >
          {/* 신부 이미지 업로드 */}
          <div className="flex-1">
            <p className="text-lg font-semibold text-[#B36B6B] mb-2">신부님</p>
            <div
              onClick={() => !bridePreview && brideInputRef.current?.click()}
              className="relative border-2 border-[#B36B6B] border-opacity-60 rounded-lg h-[300px] flex items-center justify-center cursor-pointer hover:border-opacity-100 transition-all overflow-hidden bg-[#FFF5F5]"
            >
              {bridePreview ? (
                <>
                  <Image src={bridePreview} alt="신부 사진" fill className="object-cover" />
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveImage('bride');
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-red-50"
                  >
                    <X size={20} className="text-red-500" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-[#B36B6B]">
                  <Upload size={48} />
                  <p className="mt-2 text-sm">클릭하여 사진 업로드</p>
                  <p className="text-xs text-neutral-400 mt-1">(최대 10MB)</p>
                </div>
              )}
            </div>
            <input
              ref={brideInputRef}
              type="file"
              accept="image/*"
              onChange={e => handleImageSelect(e, 'bride')}
              className="hidden"
            />
          </div>

          {/* 신랑 이미지 업로드 */}
          <div className="flex-1">
            <p className="text-lg font-semibold text-[#4682B4] mb-2">신랑님</p>
            <div
              onClick={() => !groomPreview && groomInputRef.current?.click()}
              className="relative border-2 border-[#4682B4] border-opacity-60 rounded-lg h-[300px] flex items-center justify-center cursor-pointer hover:border-opacity-100 transition-all overflow-hidden bg-[#F0F8FF]"
            >
              {groomPreview ? (
                <>
                  <Image src={groomPreview} alt="신랑 사진" fill className="object-cover" />
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveImage('groom');
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-red-50"
                  >
                    <X size={20} className="text-red-500" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-[#4682B4]">
                  <Upload size={48} />
                  <p className="mt-2 text-sm">클릭하여 사진 업로드</p>
                  <p className="text-xs text-neutral-400 mt-1">(최대 10MB)</p>
                </div>
              )}
            </div>
            <input
              ref={groomInputRef}
              type="file"
              accept="image/*"
              onChange={e => handleImageSelect(e, 'groom')}
              className="hidden"
            />
          </div>
        </motion.div>

        {/* 이름 입력 필드 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.9,
          }}
          className="flex gap-x-4 mt-6 w-full"
        >
          <input
            value={brideName}
            onChange={e => setBrideName(e.target.value)}
            placeholder="신부님 이름을 입력해주세요."
            className="flex-1 border-2 border-[#B36B6B] p-4 rounded-lg border-opacity-60 placeholder-neutral-500 text-base"
          />
          <input
            value={groomName}
            onChange={e => setGroomName(e.target.value)}
            placeholder="신랑님 이름을 입력해주세요."
            className="flex-1 border-2 border-[#4682B4] p-4 rounded-lg border-opacity-60 placeholder-neutral-500 text-base"
          />
        </motion.div>

        <div className="w-full mt-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              delay: 1.2,
            }}
            className="flex gap-x-2 justify-center w-full pt-4"
          >
            <button
              onClick={prevStep}
              className="flex justify-center w-[240px] h-[60px] text-sm border-2 border-[#C58D8D] rounded-xl items-center p-4 shadow-lg hover:border-opacity-100 transition-colors"
            >
              <p className="w-full font-semibold text-[#C58D8D] text-center">이전 단계로</p>
            </button>
            <button
              onClick={
                // handleUpload
                () => {
                  nextStep();
                }
              }
              disabled={!brideImage || !groomImage || !brideName || !groomName || isUploading}
              className={`flex justify-center w-[360px] h-[60px] text-sm ${
                brideImage && groomImage && brideName && groomName && !isUploading
                  ? 'bg-[#C58D8D] hover:bg-[#B36B6B]'
                  : 'bg-neutral-300 cursor-not-allowed'
              } rounded-xl items-center p-4 shadow-lg transition-all`}
            >
              <p className="w-full font-semibold text-white text-center">
                {isUploading ? '업로드 중...' : 'AI 분석 시작하기'}
              </p>
              {!isUploading && <ArrowBigRightDash className="p-0.5" color="#FFFFFF" />}
            </button>
          </motion.div>
          {/* <p className="text-xs text-neutral-400 mt-4 text-center">
            업로드한 사진은 AI 분석 후 자동으로 삭제됩니다
          </p> */}
        </div>
      </div>
    </div>
  );
}
