'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface ImageCarouselProps {
  itemCount?: number;
  itemWidth?: number;
  itemHeight?: number;
  displayCount?: number;
  gap?: number;
  duration?: number;
  delay?: number;
  repeatDelay?: number;
  returnToStart?: boolean;
  children?: ReactNode;
  className?: string;
  itemClassName?: string;
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
}: ImageCarouselProps) {
  // 이동 거리 계산 (아이템 너비 + 간격)
  const itemStep = itemWidth + gap;
  const duration = itemCount * 3;

  // 애니메이션 키프레임 생성
  const generateKeyframes = () => {
    const keyframes = [0];
    for (let i = 1; i <= itemCount - displayCount; i++) {
      keyframes.push(-itemStep * i);
      keyframes.push(-itemStep * i);
    }
    if (returnToStart) {
      keyframes.push(0);
    }
    return keyframes;
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        animate={{
          x: generateKeyframes(),
        }}
        transition={{
          duration,
          delay,
          ease: [0, 0.7, 0.2, 1],
          repeat: Infinity,
          repeatDelay,
          repeatType: 'loop',
        }}
        className="flex h-full"
        style={{ gap: `${gap}px` }}
      >
        {children ? (
          children
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
      </motion.div>
    </div>
  );
}
