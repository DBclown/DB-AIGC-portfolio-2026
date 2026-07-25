import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import { assetManager, getOptimizedImageUrl } from '../utils/assetManager';
import WatermarkOverlay from './WatermarkOverlay';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  targetWidth?: number;
  targetHeight?: number;
  onClick?: () => void;
  aspectRatio?: string;
  priority?: boolean;
}

export default function SmartImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  targetWidth = 800,
  targetHeight = 800,
  onClick,
  aspectRatio,
  priority = false
}: SmartImageProps) {
  // If priority is true, consider it immediately in view
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const optimizedSrc = getOptimizedImageUrl(src, targetWidth, targetHeight);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    // If already cached globally, skip loading state delay
    if (assetManager.isLoaded(optimizedSrc)) {
      setIsInView(true);
      setIsLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px' } // Preload when 350px away from viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [optimizedSrc, priority]);

  useEffect(() => {
    if (!isInView || isLoaded) return;

    let isMounted = true;

    assetManager
      .loadImage(optimizedSrc)
      .then(() => {
        if (isMounted) setIsLoaded(true);
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [isInView, optimizedSrc, isLoaded]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={aspectRatio ? { aspectRatio } : undefined}
      className={`relative bg-[#E2DED4] ${containerClassName} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Skeleton Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F1C5C1]/40 border-2 border-dashed border-[#024C38]/30 p-2 z-10 select-none">
          <div className="flex items-center gap-1.5 text-[#024C38] font-mono text-[9px] font-black uppercase mb-1">
            <Sparkles className="w-3 h-3 text-[#CE0F51] animate-spin" />
            <span>BUFFERING HD...</span>
          </div>
          {/* Scanline bar animation */}
          <div className="w-3/4 h-1.5 bg-[#024C38]/20 retro-border-sm overflow-hidden">
            <div className="h-full bg-[#CE0F51] animate-[infinite-scroll_1.2s_linear_infinite] w-1/2" />
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#024C38]/10 p-2 text-center text-[#CE0F51]">
          <ImageIcon className="w-6 h-6 mb-1" />
          <span className="font-mono text-[9px] font-bold">IMAGE OFFLINE</span>
        </div>
      )}

      {/* Actual Image Element */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          decoding="async"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      )}

      {/* Watermark Protection Layer */}
      {isLoaded && <WatermarkOverlay variant="light" />}

      {/* Transparent interaction blocker */}
      <div className="absolute inset-0 z-30" onContextMenu={(e) => e.preventDefault()} />
    </div>
  );
}
