'use client';

import { ArrowBigRightDash, Camera, Sparkles, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ImageCarousel from '@/components/ui/ImageCarousel';
import { apiClient } from '@/lib/api-client';

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
    <main className="flex flex-col items-center justify-center p-24 gap-y-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">TITLE</h1>
      </div>
      <motion.div
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
      </motion.div>

      <div className="w-[1200px] h-[280px] flex gap-6 p-8">
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
        <div className="text-xl font-semibold text-neutral-800 pl-1">
          다른 사람들의 스드메
        </div>
        <ImageCarousel
          itemCount={8}
          itemWidth={280}
          itemHeight={220}
          displayCount={4}
          gap={12}
          delay={2}
          repeatDelay={4}
          returnToStart={true}
          className="py-2"
        >
          {[
            {
              id: 1,
              studio: '로맨틱 스튜디오',
              dress: '클래식 화이트',
              makeup: '내추럴 메이크업',
              budget: '350만원',
              gradient: 'from-neutral-300 to-neutral-400',
            },
            {
              id: 2,
              studio: '모던 포토',
              dress: '빈티지 레이스',
              makeup: '글램 메이크업',
              budget: '420만원',
              gradient: 'from-neutral-300 to-neutral-400',
            },
            {
              id: 3,
              studio: '아뜰리에 스튜디오',
              dress: '미니멀 실크',
              makeup: '코랄 메이크업',
              budget: '380만원',
              gradient: 'from-neutral-300 to-neutral-400',
            },
            {
              id: 4,
              studio: '프리미엄 스튜디오',
              dress: '프린세스 드레스',
              makeup: '로맨틱 메이크업',
              budget: '520만원',
              gradient: 'from-neutral-300 to-neutral-400',
            },
            {
              id: 5,
              studio: '감성 스튜디오',
              dress: '보헤미안 드레스',
              makeup: '베이지 메이크업',
              budget: '330만원',
              gradient: 'from-neutral-300 to-neutral-400',
            },
            {
              id: 6,
              studio: '클래식 스튜디오',
              dress: '머메이드 드레스',
              makeup: '시크 메이크업',
              budget: '450만원',
              gradient: 'from-neutral-300 to-neutral-400',
            },
            {
              id: 7,
              studio: '럭셔리 포토',
              dress: '골드 라인 드레스',
              makeup: '골드 메이크업',
              budget: '580만원',
              gradient: 'from-neutral-300 to-neutral-400',
            },
            {
              id: 8,
              studio: '내추럴 스튜디오',
              dress: '심플 드레스',
              makeup: '데일리 메이크업',
              budget: '290만원',
              gradient: 'from-neutral-300 to-neutral-400',
            },
          ].map(result => (
            <div
              key={result.id}
              className="flex-shrink-0 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 overflow-hidden group cursor-pointer hover:scale-[102%]"
              style={{ width: '280px', height: '220px' }}
            >
              <div className={`w-full h-full bg-gradient-to-br ${result.gradient} p-4 flex flex-col justify-between relative`}>
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
                  {result.budget}
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-4xl font-bold text-white/30 group-hover:text-white/40 transition-colors">
                    #{result.id}
                  </div>
                </div>
                <div className="bg-white/95 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera size={14} className="text-[#8E808A]" />
                    <span className="text-xs font-semibold text-neutral-700">
                      {result.studio}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-[#B36B6B]" />
                    <span className="text-xs font-semibold text-neutral-700">
                      {result.dress}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette size={14} className="text-[#AF9A9D]" />
                    <span className="text-xs font-semibold text-neutral-700">
                      {result.makeup}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ImageCarousel>
      </div>

      <Link
        href="/simulator"
        className="flex justify-center min-w-[300px] text-sm bg-[#C58D8D] rounded-xl items-center p-4 shadow-xl hover:bg-opacity-80 duration-200"
      >
        <button className="w-full font-semibold text-white text-center">
          웨딩사진 만들어 보기
        </button>

        <ArrowBigRightDash className="p-0.5" color="#FFFFFF" />
      </Link>
    </main>
  );
}
