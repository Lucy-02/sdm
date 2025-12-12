'use client';

import { ArrowBigRightDash, Camera, Sparkles, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ImageCarousel from '@/components/ui/ImageCarousel';
import { apiClient } from '@/lib/api-client';
import studioImage1 from '@/assets/studio/Group14.png';
import studioImage2 from '@/assets/studio/Group 15.png';
import dressImage1 from '@/assets/dress/image 27.png';
import dressImage2 from '@/assets/dress/image 28.png';
import makeupImage1 from '@/assets/makeup/image 29.png';

interface VendorImage {
  url: string;
  type: string;
}

interface Vendor {
  id: string;
  name: string;
  description?: string;
  location: string;
  priceRange?: string;
  rating?: number;
  category: {
    name: string;
    slug: string;
  };
  images: VendorImage[];
}

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [studioVendors, setStudioVendors] = useState<Vendor[]>([]);
  const [dressVendors, setDressVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // 스튜디오와 드레스 업체 데이터 로드
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const [studioRes, dressRes] = await Promise.all([
          apiClient.get('/api/vendors/category/studio', { params: { limit: 10 } }),
          apiClient.get('/api/vendors/category/dress', { params: { limit: 10 } }),
        ]);
        setStudioVendors(studioRes.data.data);
        setDressVendors(dressRes.data.data);
      } catch (error) {
        console.error('업체 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-20 gap-y-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">TITLE</h1>
      </div>
      {/* 확장형 Search Bar */}
      {/* <motion.div
        onHoverStart={() => {
          setExpand(true);
        }}
        onHoverEnd={() => {
          setExpand(false);
        }}
        initial={{ opacity: 1, width: '400px', height: '60px' }}
        animate={expand ? { opacity: 1, width: '944px', height: '488px' } : {}}
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={expand ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.2 }}
          className={`flex-col mt-4 gap-y-2 h-full ${expand ? '' : 'hidden'}`}
        >
          <div className="text-neutral-500 font-semibold text-sm pl-1">이런 스튜디오는 어때요?</div>
          {loading ? (
            <ImageCarousel
              itemHeight={170}
              delay={6}
              repeatDelay={3}
              returnToStart={false}
              className="py-2"
            />
          ) : (
            <ImageCarousel
              itemCount={studioVendors.length}
              itemHeight={170}
              delay={6}
              repeatDelay={3}
              returnToStart={false}
              className="py-2"
            >
              {studioVendors.map(vendor => (
                <Link
                  key={vendor.id}
                  href={`/vendors?category=studio`}
                  className="flex-shrink-0"
                  style={{ width: '220px', height: '170px' }}
                >
                  <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    {vendor.images && vendor.images.length > 0 && vendor.images[0] ? (
                      <img
                        src={vendor.images[0].url}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <div className="font-semibold text-sm mb-1">{vendor.name}</div>
                        <div className="text-xs opacity-90">{vendor.location}</div>
                        {vendor.rating && (
                          <div className="text-xs mt-1">★ {vendor.rating.toFixed(1)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </ImageCarousel>
          )}
          <div className="text-neutral-500 font-semibold text-sm pl-1 mt-2">
            요즘 뜨는 예복이에요.
          </div>
          {loading ? (
            <ImageCarousel
              itemHeight={170}
              delay={3}
              repeatDelay={3}
              returnToStart={true}
              className="py-2"
            />
          ) : (
            <ImageCarousel
              itemCount={dressVendors.length}
              itemHeight={170}
              delay={3}
              repeatDelay={3}
              returnToStart={true}
              className="py-2"
            >
              {dressVendors.map(vendor => (
                <Link
                  key={vendor.id}
                  href={`/vendors?category=dress`}
                  className="flex-shrink-0"
                  style={{ width: '220px', height: '170px' }}
                >
                  <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    {vendor.images && vendor.images.length > 0 && vendor.images[0] ? (
                      <img
                        src={vendor.images[0].url}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <div className="font-semibold text-sm mb-1">{vendor.name}</div>
                        <div className="text-xs opacity-90">{vendor.location}</div>
                        {vendor.rating && (
                          <div className="text-xs mt-1">★ {vendor.rating.toFixed(1)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </ImageCarousel>
          )}
        </motion.div>
      </motion.div> */}

      <div className="w-[1230px] h-[280px] flex gap-6 p-8">
        {/* 스튜디오 */}
        <Link href="/vendors?category=studio" className="flex-1 group">
          <div className="h-full bg-gradient-to-br from-[#B3A3B4] to-[#8E808A] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col items-center justify-center gap-2 hover:scale-[102%]">
            <div className="p-6 bg-white/90 rounded-full shadow-md group-hover:shadow-xl transition-shadow">
              <Camera size={48} className="text-[#8E808A]" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">스튜디오</h3>
              <p className="text-sm text-white/90">완벽한 순간을 담아드립니다</p>
            </div>
          </div>
        </Link>

        {/* 드레스 */}
        <Link href="/vendors?category=dress" className="flex-1 group">
          <div className="h-full bg-gradient-to-br from-[#C58D8D] to-[#B36B6B] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col items-center justify-center gap-2 hover:scale-[102%]">
            <div className="p-6 bg-white/90 rounded-full shadow-md group-hover:shadow-xl transition-shadow">
              <Sparkles size={48} className="text-[#B36B6B]" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">드레스</h3>
              <p className="text-sm text-white/90">당신만의 특별한 스타일</p>
            </div>
          </div>
        </Link>

        {/* 메이크업 */}
        <Link href="/vendors?category=makeup" className="flex-1 group">
          <div className="h-full bg-gradient-to-br from-[#B8A1A3] to-[#AF9A9D] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col items-center justify-center gap-2 hover:scale-[102%]">
            <div className="p-6 bg-white/90 rounded-full shadow-md group-hover:shadow-xl transition-shadow">
              <Palette size={48} className="text-[#AF9A9D]" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">메이크업</h3>
              <p className="text-sm text-white/90">아름다움을 완성합니다</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="w-[1160px] h-[300px] flex flex-col gap-2">
        <div className="text-xl font-semibold text-neutral-800 pl-1">다른 사람들의 스드메</div>
        <ImageCarousel
          itemCount={8}
          itemWidth={280}
          itemHeight={220}
          displayCount={4}
          gap={12}
          returnToStart={true}
          className="py-2"
        >
          {[
            {
              id: 1,
              image: studioImage1,
              type: 'studio' as const,
              studio: '로맨틱 스튜디오',
              budget: '350만원',
            },
            {
              id: 2,
              image: dressImage1,
              type: 'dress' as const,
              dress: '클래식 화이트',
              budget: '420만원',
            },
            {
              id: 3,
              image: makeupImage1,
              type: 'makeup' as const,
              makeup: '코랄 메이크업',
              budget: '380만원',
            },
            {
              id: 4,
              image: studioImage2,
              type: 'studio' as const,
              studio: '프리미엄 스튜디오',
              budget: '520만원',
            },
            {
              id: 5,
              image: dressImage2,
              type: 'dress' as const,
              dress: '보헤미안 드레스',
              budget: '330만원',
            },
            {
              id: 8,
              image: makeupImage1,
              type: 'makeup' as const,
              makeup: '데일리 메이크업',
              budget: '290만원',
            },
            {
              id: 6,
              image: makeupImage1,
              type: 'makeup' as const,
              makeup: '시크 메이크업',
              budget: '450만원',
            },
            {
              id: 7,
              image: makeupImage1,
              type: 'studio' as const,
              studio: '럭셔리 포토',
              budget: '580만원',
            },
          ].map(result => (
            <div
              key={result.id}
              className="flex-shrink-0 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer hover:scale-[102%] relative"
              style={{ width: '280px', height: '220px' }}
            >
              <Image src={result.image} alt="스드메 이미지" fill className="object-cover" />
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="absolute top-2 right-2 bg-white/90 rounded-lg px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm z-10">
                  {result.budget}
                </div>
                <div className="flex-1" />
                <div className="bg-white/95 rounded py-2 px-3 backdrop-blur-sm relative z-10">
                  {result.type === 'studio' && result.studio && (
                    <div className="flex items-center gap-2">
                      <Camera size={14} className="text-[#8E808A]" />
                      <span className="text-xs font-semibold text-neutral-700">
                        {result.studio}
                      </span>
                    </div>
                  )}
                  {result.type === 'dress' && result.dress && (
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-[#B36B6B]" />
                      <span className="text-xs font-semibold text-neutral-700">{result.dress}</span>
                    </div>
                  )}
                  {result.type === 'makeup' && result.makeup && (
                    <div className="flex items-center gap-2">
                      <Palette size={14} className="text-[#AF9A9D]" />
                      <span className="text-xs font-semibold text-neutral-700">
                        {result.makeup}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ImageCarousel>
      </div>

      <Link
        href="/simulator"
        className="flex justify-center min-w-[400px] text-sm bg-[#C58D8D] rounded-xl items-center p-4 shadow-xl hover:bg-opacity-80 duration-200"
      >
        <button className="w-full font-semibold text-white text-center">
          웨딩사진 만들어 보기
        </button>

        <ArrowBigRightDash className="p-0.5" color="#FFFFFF" />
      </Link>
    </div>
  );
}
