'use client';

import { motion, useMotionValue, useAnimation, PanInfo } from 'motion/react';
import { ReactNode, useRef, useState, useEffect, Children } from 'react';

interface ImageCarouselProps {
  /** 아이템 개수 (children 없을 때 사용) */
  itemCount?: number;
  /** 아이템 너비 (px) */
  itemWidth?: number;
  /** 아이템 높이 (px) */
  itemHeight?: number;
  /** 화면에 보이는 아이템 개수 */
  displayCount?: number;
  /** 아이템 간 간격 (px) */
  gap?: number;
  /** 자동 스크롤 지연 시간 (초) */
  delay?: number;
  /** 반복 지연 시간 (초) */
  repeatDelay?: number;
  /** 처음으로 돌아갈지 여부 */
  returnToStart?: boolean;
  /** 자식 요소 */
  children?: ReactNode;
  /** 컨테이너 클래스 */
  className?: string;
  /** 기본 아이템 클래스 (children 없을 때) */
  itemClassName?: string;
  /** 드래그 활성화 여부 */
  draggable?: boolean;
  /** 자동 스크롤 활성화 여부 */
  autoScroll?: boolean;
  /** 드래그 시 자동 스크롤 일시정지 */
  pauseOnDrag?: boolean;
  /** 드래그 감도 (낮을수록 민감) */
  dragSensitivity?: number;
}

export default function ImageCarousel({
  itemCount = 10,
  itemWidth = 220,
  itemHeight = 150,
  displayCount = 4,
  gap = 8,
  delay = 0,
  repeatDelay = 2,
  returnToStart = false,
  children,
  className = '',
  itemClassName = 'bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-lg shadow-sm',
  draggable = true,
  autoScroll = true,
  pauseOnDrag = true,
  dragSensitivity = 50,
}: ImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const currentIndexRef = useRef(0); // 현재 위치 인덱스 저장

  // children 개수 계산
  const childArray = Children.toArray(children);
  const actualItemCount = childArray.length > 0 ? childArray.length : itemCount;

  // 이동 거리 계산
  const itemStep = itemWidth + gap;
  const maxDrag = -(itemStep * (actualItemCount - displayCount));
  const duration = actualItemCount * 3;

  // 현재 위치에서 키프레임 생성 (현재 인덱스부터 시작)
  const generateKeyframesFromIndex = (startIndex: number) => {
    const keyframes: number[] = [];
    const maxIndex = actualItemCount - displayCount;

    // 현재 위치부터 끝까지
    for (let i = startIndex; i <= maxIndex; i++) {
      keyframes.push(-itemStep * i);
      if (i < maxIndex) {
        keyframes.push(-itemStep * i); // 정지 효과
      }
    }

    // returnToStart가 true면 처음으로 돌아간 후 다시 현재 위치까지
    if (returnToStart) {
      keyframes.push(0);
      for (let i = 0; i < startIndex; i++) {
        keyframes.push(-itemStep * i);
        keyframes.push(-itemStep * i);
      }
    }

    return keyframes;
  };

  // 자동 스크롤 애니메이션 시작 (현재 위치에서)
  const startAutoScroll = () => {
    if (!autoScroll || isPaused || isDragging) return;

    const keyframes = generateKeyframesFromIndex(currentIndexRef.current);
    if (keyframes.length === 0) return;

    // 남은 아이템 수에 비례한 duration 계산
    const remainingItems = actualItemCount - displayCount - currentIndexRef.current;
    const adjustedDuration = Math.max(remainingItems * 3, 3);

    controls.start({
      x: keyframes,
      transition: {
        duration: adjustedDuration,
        delay,
        ease: [0, 0.7, 0.2, 1],
        repeat: Infinity,
        repeatDelay,
        repeatType: 'loop',
      },
    });
  };

  // 자동 스크롤 정지 및 현재 위치 저장
  const stopAutoScroll = () => {
    const currentX = x.get();
    const currentIndex = Math.round(-currentX / itemStep);
    currentIndexRef.current = Math.max(0, Math.min(currentIndex, actualItemCount - displayCount));
    controls.stop();
  };

  // 드래그 시작
  const handleDragStart = () => {
    setIsDragging(true);
    if (pauseOnDrag) {
      stopAutoScroll();
    }
  };

  // 드래그 중
  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const currentX = x.get();
    const newX = Math.max(Math.min(currentX + info.delta.x, 0), maxDrag);
    x.set(newX);
  };

  // 드래그 종료
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const currentX = x.get();
    const velocity = info.velocity.x;

    // 속도에 따른 추가 이동 계산
    const projectedX = currentX + velocity * 0.2;

    // 가장 가까운 아이템 위치로 스냅
    const snapIndex = Math.round(-projectedX / itemStep);
    const clampedIndex = Math.max(0, Math.min(snapIndex, actualItemCount - displayCount));
    const targetX = -clampedIndex * itemStep;

    // 현재 인덱스 저장
    currentIndexRef.current = clampedIndex;

    // 스냅 애니메이션
    controls.start({
      x: targetX,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    });
  };

  // 자동 스크롤 시작/정지 관리
  useEffect(() => {
    if (autoScroll && !isDragging && !isPaused) {
      startAutoScroll();
    }
    return () => {
      controls.stop();
    };
  }, [autoScroll, isDragging, isPaused, actualItemCount]);

  // 호버 시 일시정지 (현재 위치 유지)
  const handleMouseEnter = () => {
    if (pauseOnDrag) {
      stopAutoScroll();
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnDrag) {
      setIsPaused(false);
      // isPaused가 false로 바뀌면 useEffect에서 자동으로 startAutoScroll 호출
    }
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        drag={draggable ? 'x' : false}
        dragConstraints={{ left: maxDrag, right: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className={`flex h-full ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
        whileTap={draggable ? { cursor: 'grabbing' } : undefined}
      >
        <div className="flex h-full" style={{ gap: `${gap}px` }}>
          {childArray.length > 0 ? (
            childArray
          ) : (
            Array.from({ length: itemCount }).map((_, i) => (
              <div
                key={i}
                className={itemClassName}
                style={{
                  minWidth: `${itemWidth}px`,
                  height: `${itemHeight}px`,
                }}
              />
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
