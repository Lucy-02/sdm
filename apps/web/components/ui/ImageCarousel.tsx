'use client';

import { motion, useMotionValue, useAnimation, PanInfo } from 'motion/react';
import { ReactNode, useRef, useState, useEffect, Children, useCallback } from 'react';

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
  /** 이동 시간 (초) */
  moveDuration?: number;
  /** 대기 시간 (초) */
  waitDuration?: number;
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

// TODO: hover in -> out tl ekdma vhwltusdmfh dlehdgksms qjrm tnwjd vlfdy.

export default function ImageCarousel({
  itemCount = 10,
  itemWidth = 220,
  itemHeight = 150,
  displayCount = 4,
  gap = 8,
  moveDuration = 2,
  waitDuration = 4,
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
  const maxIndex = actualItemCount - displayCount;

  // 타이머 ref
  const animationRef = useRef<{ timeoutId?: NodeJS.Timeout; isCancelled: boolean }>({
    isCancelled: false,
  });

  // 자동 스크롤 사이클: 3초 이동 → 5초 대기 → 반복
  const runAutoScrollCycle = async () => {
    if (!autoScroll || isPaused || isDragging || animationRef.current.isCancelled) return;

    const currentIndex = currentIndexRef.current;
    let nextIndex = currentIndex + 1;

    // 끝에 도달하면 처음으로
    if (nextIndex > maxIndex) {
      if (returnToStart) {
        nextIndex = 0;
      } else {
        // 처음으로 돌아가지 않으면 처음부터 다시 시작
        currentIndexRef.current = 0;
        nextIndex = 1;
        x.set(0);
      }
    }

    const targetX = -nextIndex * itemStep;

    // 3초 동안 이동
    await controls.start({
      x: targetX,
      transition: {
        duration: moveDuration,
        ease: [0.25, 0.1, 0.25, 1],
      },
    });

    if (animationRef.current.isCancelled) return;

    currentIndexRef.current = nextIndex;

    // 5초 대기 후 다음 사이클
    animationRef.current.timeoutId = setTimeout(() => {
      if (!animationRef.current.isCancelled) {
        runAutoScrollCycle();
      }
    }, waitDuration * 1000);
  };

  // 자동 스크롤 시작
  const startAutoScroll = () => {
    if (!autoScroll || isPaused || isDragging) return;
    animationRef.current.isCancelled = false;
    runAutoScrollCycle();
  };

  // 자동 스크롤 정지
  const stopAutoScrollAnimation = useCallback(() => {
    animationRef.current.isCancelled = true;
    if (animationRef.current.timeoutId) {
      clearTimeout(animationRef.current.timeoutId);
    }
    controls.stop();
  }, [controls]);

  // 자동 스크롤 정지 및 현재 위치 저장
  const stopAutoScroll = () => {
    const currentX = x.get();
    const currentIndex = Math.round(-currentX / itemStep);
    currentIndexRef.current = Math.max(0, Math.min(currentIndex, actualItemCount - displayCount));
    stopAutoScrollAnimation();
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
    // 항상 먼저 기존 애니메이션 정지
    stopAutoScrollAnimation();

    if (autoScroll && !isDragging && !isPaused) {
      // 약간의 지연 후 시작하여 이전 애니메이션이 완전히 정리되도록 함
      const timeoutId = setTimeout(() => {
        startAutoScroll();
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        stopAutoScrollAnimation();
      };
    }

    return () => {
      stopAutoScrollAnimation();
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
