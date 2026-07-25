import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Eye, 
  Clock, Layers, Box, Film, Maximize2,
  ChevronDown, ChevronUp, RotateCcw
} from 'lucide-react';
import { VISUAL_PROJECTS, VIDEO_PROJECTS, MODELS_3D } from '../data';
import { BaseProject, Model3D } from '../types';
import Model3DViewer from './Model3DViewer';
import SmartImage from './SmartImage';
import WatermarkOverlay from './WatermarkOverlay';
import { useInView } from 'react-intersection-observer';

/**
 * LazyModelCard - A wrapper component that defers the rendering of 3D model cards
 * until they are scrolled near the viewport. This prevents all 11 models from
 * triggering network requests and GPU rendering simultaneously.
 */
/**
 * StoryboardVideo - 分镜片段视频组件
 *
 * 核心策略：完全使用原生 IntersectionObserver + ref 操控 video DOM，
 * 不触发任何 React re-render，彻底杜绝 inView 状态抖动导致的播放中断。
 *
 * - preload="none"：初始不加载，进入视口才触发 load()
 * - 300ms 防抖：防止 IntersectionObserver 在 CollapsibleSection overflow-hidden
 *   动画容器中频繁触发导致 play/pause 抖动
 * - 移出视口仅 pause()，保留缓冲数据
 * - 播放完毕显示重播按钮（唯一的 state 变更）
 */
const StoryboardVideo = React.memo(function StoryboardVideo({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStartedRef = useRef(false);   // 是否已触发过 load()
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let disposed = false;

    const startPlayback = () => {
      if (disposed || video.ended) return;

      // 首次进入视口：触发加载
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        video.preload = 'auto';
        video.load();
      }

      // 已有足够数据 → 直接播放
      if (video.readyState >= 2) {
        video.play().catch(() => {});
        return;
      }

      // 数据不足 → 等 canplay 再播
      const onCanPlay = () => {
        if (!disposed) video.play().catch(() => {});
      };
      video.addEventListener('canplay', onCanPlay, { once: true });
      // 安全兜底：若 canplay 迟迟不触发，playing 事件后移除残留监听
      const onPlaying = () => video.removeEventListener('canplay', onCanPlay);
      video.addEventListener('playing', onPlaying, { once: true });
    };

    const stopPlayback = () => {
      if (!video.paused) video.pause();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(playTimerRef.current);
        if (entry.isIntersecting) {
          // 防抖 300ms：确认稳定可见后才播放
          playTimerRef.current = setTimeout(startPlayback, 300);
        } else {
          stopPlayback();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      disposed = true;
      clearTimeout(playTimerRef.current);
      observer.disconnect();
    };
  }, [src]);

  const handleEnded = () => setHasEnded(true);

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
    setHasEnded(false);
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="none"
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onEnded={handleEnded}
        className="w-full h-full object-cover"
      />
      {hasEnded && (
        <button
          onClick={handleReplay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity hover:bg-black/40"
        >
          <div className="flex flex-col items-center gap-1">
            <RotateCcw className="w-6 h-6 text-white" />
            <span className="font-mono text-[9px] text-white/80 font-black tracking-wider">REPLAY</span>
          </div>
        </button>
      )}
    </div>
  );
});

/**
 * MainVideoPlayer - 主视频播放器（纯原生 controls，无任何 JS 干预）
 */
const MainVideoPlayer = React.memo(function MainVideoPlayer({ videoUrl, thumbnail }: { videoUrl: string; thumbnail: string }) {
  return (
    <div className="w-full aspect-video retro-border-lg bg-black overflow-hidden relative shadow-[6px_6px_0px_0px_#024C38]">
      <video 
        src={videoUrl} 
        controls 
        preload="auto"
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        poster={thumbnail || undefined}
        className="w-full h-full object-cover"
      />
      <WatermarkOverlay variant="light" />
    </div>
  );
});

function LazyModelCard({ children, className }: { children: React.ReactNode; className: string }) {
  const { ref, inView } = useInView({
    triggerOnce: false, // Continuous monitoring: unmount Canvas when card scrolls away
    rootMargin: '200px 0px', // Preload when 200px from viewport
  });

  return (
    <div ref={ref} className={className}>
      {inView ? (
        children
      ) : (
        /* Skeleton placeholder while card is off-screen */
        <div className="bg-[#FAF4EB] retro-border p-3 sm:p-4 flex flex-col justify-between gap-3 h-full min-h-[200px]">
          <div className="flex flex-col gap-2.5 animate-pulse">
            <div className="flex justify-between items-center pb-2 border-b border-dashed border-[#024C38]/20">
              <div className="h-3 w-24 bg-[#024C38]/10" />
              <div className="h-3 w-16 bg-[#024C38]/10" />
            </div>
            <div className="w-full aspect-[4/3] bg-[#E2DED4] retro-border overflow-hidden relative flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-[#024C38]/20 border-t-[#CE0F51] rounded-full animate-spin" />
                <span className="font-mono text-[8px] text-[#024C38]/40 font-black tracking-widest">
                  DEFERRED...
                </span>
              </div>
            </div>
            <div className="h-4 w-3/4 bg-[#024C38]/10 mt-1" />
          </div>
          <div className="h-8 w-full bg-[#024C38]/10 retro-border-sm" />
        </div>
      )}
    </div>
  );
}

interface VisualProjectCardProps {
  key?: string | number;
  project: BaseProject;
  projIdx: number;
  openCarousel: (project: BaseProject) => void;
  setCarouselIndex: React.Dispatch<React.SetStateAction<number>>;
}

function VisualProjectCard({ project, projIdx, openCarousel, setCarouselIndex }: VisualProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const marqueeRef = React.useRef<HTMLDivElement>(null);
  const targetRate = React.useRef(1.0);
  const currentRate = React.useRef(1.0);
  const rafId = React.useRef<number | null>(null);

  const applyRate = (rate: number) => {
    if (!marqueeRef.current) return;
    const anims = marqueeRef.current.getAnimations();
    anims.forEach((anim: any) => {
      try {
        if ('updatePlaybackRate' in anim) {
          anim.updatePlaybackRate(rate);
        } else {
          anim.playbackRate = rate;
        }
      } catch (e) {
        anim.playbackRate = rate;
      }
    });
  };

  const updateRateLoop = () => {
    const diff = targetRate.current - currentRate.current;
    if (Math.abs(diff) > 0.005) {
      currentRate.current += diff * 0.08;
      applyRate(currentRate.current);
      rafId.current = requestAnimationFrame(updateRateLoop);
    } else {
      currentRate.current = targetRate.current;
      applyRate(currentRate.current);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    targetRate.current = 0.15; // Smoothly decelerate to 15% speed on hover
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(updateRateLoop);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    targetRate.current = 1.0; // Smoothly accelerate back to normal 100% speed
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(updateRateLoop);
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const isStardust = project.id === 'stardust';
  const isDopamine = project.id === 'dopamine';
  const isCollage = project.id === 'collage';
  const isTarot = project.id === 'tarot';
  const isMayfly = project.id === 'mayfly';
  const isFirstDopamine = isDopamine;

  // Container Styles based on theme
  let containerClasses = "";
  let cardClasses = "";
  let gridClasses = "";
  let imageAspect = "aspect-[9/16]"; // Default tall for 9:16 series

  if (isStardust) {
    containerClasses = "bg-[#0B1527] border-3 border-[#00FFCC] shadow-[8px_8px_0px_0px_#024C38]";
    cardClasses = "lg:absolute lg:bottom-6 lg:left-6 lg:w-[360px] bg-[#0B1527]/95 border-2 border-[#00FFCC] text-white shadow-[6px_6px_0px_0px_#024C38]";
    gridClasses = "flex overflow-hidden gap-4 w-full h-[240px] sm:h-[340px] lg:h-[460px] relative select-none scrollbar-none";
    imageAspect = "aspect-square h-full";
  } else if (isDopamine) {
    containerClasses = "bg-[#FFF9E6] border-4 border-[#CE0F51] shadow-[8px_8px_0px_0px_#024C38]";
    cardClasses = "lg:absolute lg:bottom-6 lg:right-6 lg:w-[360px] bg-[#CE0F51] border-3 border-[#024C38] text-[#FFF9E6] shadow-[6px_6px_0px_0px_#024C38]";
    gridClasses = "flex overflow-hidden gap-4 w-full h-[320px] sm:h-[400px] lg:h-[520px] relative select-none scrollbar-none";
    imageAspect = "aspect-[9/16] h-full";
  } else if (isCollage) {
    containerClasses = "bg-[#EAD6B3] border-3 border-dashed border-[#5C4033] shadow-[8px_8px_0px_0px_#5C4033]";
    cardClasses = "lg:absolute lg:top-6 lg:right-6 lg:w-[330px] bg-[#FAF4EB] border-2 border-[#5C4033] text-[#5C4033] shadow-[6px_6px_0px_0px_#5C4033]";
    gridClasses = "flex overflow-hidden gap-4 w-full h-[320px] sm:h-[400px] lg:h-[520px] relative select-none scrollbar-none";
    imageAspect = "aspect-[9/16] h-full border border-[#5C4033]/20";
  } else if (isTarot) {
    containerClasses = "bg-[#141414] border-3 border-[#F3D03B] shadow-[8px_8px_0px_0px_#000000]";
    cardClasses = "lg:absolute lg:bottom-6 lg:left-6 lg:w-[360px] bg-[#1A1A1A]/95 border-2 border-[#F3D03B] text-[#F3D03B] shadow-[6px_6px_0px_0px_#000000]";
    gridClasses = "flex overflow-hidden gap-4 w-full h-[320px] sm:h-[400px] lg:h-[520px] relative select-none scrollbar-none";
    imageAspect = "aspect-[9/16] h-full";
  } else if (isMayfly) {
    containerClasses = "bg-[#024C38] border-3 border-[#F3D03B] shadow-[8px_8px_0px_0px_#CE0F51]";
    cardClasses = "lg:absolute lg:bottom-6 lg:right-6 lg:w-[360px] bg-[#024C38]/95 border-2 border-[#F3D03B] text-[#FFF9E6] shadow-[6px_6px_0px_0px_#CE0F51]";
    gridClasses = "flex overflow-hidden gap-4 w-full h-[320px] sm:h-[400px] lg:h-[520px] relative select-none scrollbar-none";
    imageAspect = "aspect-square h-full";
  }

  const previewImages = project.images ;
  const scrollDirection = projIdx % 2 === 0 ? 'left' : 'right';
  const animationClass = scrollDirection === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div 
      id={`project-card-${project.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden flex flex-col gap-6 p-4 sm:p-6 lg:p-8 rounded-none group/container ${containerClasses}`}
    >
      {/* Floating Series Badge */}
      <div className={`absolute top-0 right-0 px-4 py-1.5 font-mono text-xs font-black border-l-2 border-b-2 z-30 ${
        isStardust ? "bg-[#00FFCC] text-[#0B1527] border-[#00FFCC]" :
        isDopamine ? "bg-[#CE0F51] text-white border-[#CE0F51]" :
        isCollage ? "bg-[#5C4033] text-[#FAF4EB] border-[#5C4033]" :
        isMayfly ? "bg-[#F3D03B] text-[#024C38] border-[#F3D03B]" :
        "bg-[#F3D03B] text-black border-[#F3D03B]"
      }`}>
        SERIES 0{projIdx + 1}
      </div>

      {/* EXHIBITION INFO CARD - Floats on PC, stacks on mobile */}
      <div className={`w-full p-5 flex flex-col gap-4 rounded-none z-20 transition-all duration-300 ${cardClasses}`}>
        {/* Clickable Header for Mobile Toggle */}
        <div 
          onClick={() => {
            if (window.innerWidth < 1024) {
              setIsMobileExpanded(!isMobileExpanded);
            }
          }}
          className="border-b border-dashed border-current pb-3 cursor-pointer lg:cursor-default select-none flex flex-col gap-1"
        >
          <div className="text-[10px] uppercase tracking-widest font-mono opacity-80 flex justify-between items-center">
            <span>PROJECT SPECIFICATION</span>
            <span className="font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" /> {project.duration}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2 mt-1">
            <h3 className="font-display font-black text-base sm:text-lg uppercase leading-tight">
              {project.title.split(' (')[0]}
            </h3>
            {/* Mobile Expand chevron icon */}
            <div className="lg:hidden shrink-0 mt-0.5">
              {isMobileExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </div>
          <p className="text-[10px] font-mono opacity-90">
            {project.category}
          </p>
        </div>

        {/* Collapsible details section */}
        <div 
          className={`transition-all duration-500 ease-in-out ${
            isMobileExpanded ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0 overflow-hidden mt-0"
          } lg:transition-all lg:duration-500 ${
            isHovered ? "lg:max-h-[500px] lg:opacity-100 lg:mt-3" : "lg:max-h-0 lg:opacity-0 lg:overflow-hidden lg:mt-0"
          }`}
        >
          <div className="text-xs leading-relaxed space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider block opacity-75 font-black">
                [ BACKGROUND / 背景 ]
              </span>
              <p className="mt-0.5">{project.bg}</p>
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider block opacity-75 font-black">
                [ DESIGN GOALS / 目标 ]
              </span>
              <p className="mt-0.5">{project.goal}</p>
            </div>
          </div>

          {/* Tools and Tags */}
          <div className="border-t border-dashed border-current pt-3 flex flex-col gap-2.5 mt-3">
            <div>
              <span className="font-mono text-[8px] uppercase tracking-wider block opacity-75 font-black mb-1">
                GENERATIVE ENGINE / 工具栈
              </span>
              <div className="flex flex-wrap gap-1">
                {project.tools.map((tool, idx) => (
                  <span 
                    key={idx} 
                    className={`px-1.5 py-0.5 text-[9px] font-mono font-black ${
                      isStardust ? "bg-[#00FFCC]/20 text-[#00FFCC]" :
                      isDopamine ? "bg-white/20 text-[#FFF9E6]" :
                      isCollage ? "bg-[#5C4033]/10 text-[#5C4033]" :
                      isMayfly ? "bg-[#F3D03B]/20 text-[#F3D03B]" :
                      "bg-[#F3D03B]/20 text-[#F3D03B]"
                    }`}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className={`px-1.5 py-0.5 text-[8px] font-mono font-black border ${
                    isStardust ? "border-[#00FFCC]/40 text-[#00FFCC]/90" :
                    isDopamine ? "border-white/40 text-[#FFF9E6]" :
                    isCollage ? "border-[#5C4033]/30 text-[#5C4033]" :
                    isMayfly ? "border-[#F3D03B]/40 text-[#F3D03B]" :
                    "border-[#F3D03B]/40 text-[#F3D03B]"
                  }`}
                >
                  #{tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Lightbox Activator inside Card */}
        <button
          onClick={() => openCarousel(project)}
          className={`w-full mt-2 py-2.5 font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
            isStardust ? "bg-[#00FFCC] hover:bg-[#00b3a1] text-[#0B1527] border border-black shadow-[2px_2px_0px_0px_#024C38]" :
            isDopamine ? "bg-[#FFF9E6] hover:bg-[#F3D03B] text-[#CE0F51] border-2 border-[#024C38] shadow-[2px_2px_0px_0px_#024C38]" :
            isCollage ? "bg-[#5C4033] hover:bg-[#422e24] text-[#FAF4EB] shadow-[2px_2px_0px_0px_#FAF4EB]" :
            isMayfly ? "bg-[#F3D03B] hover:bg-[#ffd84d] text-[#024C38] border border-black shadow-[2px_2px_0px_0px_#CE0F51]" :
            "bg-[#F3D03B] hover:bg-[#ffd84d] text-black border border-black shadow-[2px_2px_0px_0px_#000000]"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>查看系列大图 ({project.count}张)</span>
        </button>
      </div>

      {/* IMAGE EXHIBITION MARQUEE - Infinite seamless scrolling track */}
      <div className={gridClasses}>
        <div ref={marqueeRef} className={`flex gap-4 shrink-0 flex-nowrap ${animationClass}`}>
          {/* Set 1 */}
          {previewImages.map((img, idx) => (
            <div 
              key={`set1-${idx}`} 
              className={`flex-shrink-0 overflow-hidden relative group cursor-pointer border ${imageAspect} ${
                isStardust ? "border-[#00FFCC]/20 hover:border-[#00FFCC]" :
                isDopamine ? "border-[#CE0F51]/20 hover:border-[#CE0F51]" :
                isCollage ? "border-[#5C4033]/20 hover:border-[#5C4033]" :
                isMayfly ? "border-[#F3D03B]/20 hover:border-[#F3D03B]" :
                "border-[#F3D03B]/20 hover:border-[#F3D03B]"
              }`}
              onClick={() => {
                openCarousel(project);
                setCarouselIndex(idx);
              }}
            >
              <SmartImage
                src={img}
                alt={`${project.title} Preview ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                targetWidth={600}
                targetHeight={600}
                priority={isFirstDopamine}
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#024C38]/0 group-hover:bg-[#024C38]/45 transition-colors duration-200 flex items-center justify-center">
                <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              
              {/* Number Index Label */}
              <span className={`absolute bottom-2 right-2 font-mono text-[9px] px-1.5 py-0.5 border ${
                isStardust ? "bg-[#0B1527] text-[#00FFCC] border-[#00FFCC]/30" :
                isDopamine ? "bg-[#CE0F51] text-white border-white/30" :
                isCollage ? "bg-[#FAF4EB] text-[#5C4033] border-[#5C4033]/30" :
                isMayfly ? "bg-[#024C38] text-[#F3D03B] border-[#F3D03B]/30" :
                "bg-[#1A1A1A] text-[#F3D03B] border-[#F3D03B]/30"
              }`}>
                {(idx + 1).toString().padStart(2, '0')}
              </span>
            </div>
          ))}

          {/* Set 2 (Duplicated for seamless marquee loop) */}
          {previewImages.map((img, idx) => (
            <div 
              key={`set2-${idx}`} 
              className={`flex-shrink-0 overflow-hidden relative group cursor-pointer border ${imageAspect} ${
                isStardust ? "border-[#00FFCC]/20 hover:border-[#00FFCC]" :
                isDopamine ? "border-[#CE0F51]/20 hover:border-[#CE0F51]" :
                isCollage ? "border-[#5C4033]/20 hover:border-[#5C4033]" :
                isMayfly ? "border-[#F3D03B]/20 hover:border-[#F3D03B]" :
                "border-[#F3D03B]/20 hover:border-[#F3D03B]"
              }`}
              onClick={() => {
                openCarousel(project);
                setCarouselIndex(idx);
              }}
            >
              <SmartImage
                src={img}
                alt={`${project.title} Preview ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                targetWidth={600}
                targetHeight={600}
                priority={isFirstDopamine}
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#024C38]/0 group-hover:bg-[#024C38]/45 transition-colors duration-200 flex items-center justify-center">
                <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              
              {/* Number Index Label */}
              <span className={`absolute bottom-2 right-2 font-mono text-[9px] px-1.5 py-0.5 border ${
                isStardust ? "bg-[#0B1527] text-[#00FFCC] border-[#00FFCC]/30" :
                isDopamine ? "bg-[#CE0F51] text-white border-white/30" :
                isCollage ? "bg-[#FAF4EB] text-[#5C4033] border-[#5C4033]/30" :
                isMayfly ? "bg-[#024C38] text-[#F3D03B] border-[#F3D03B]/30" :
                "bg-[#1A1A1A] text-[#F3D03B] border-[#F3D03B]/30"
              }`}>
                {(idx + 1).toString().padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default function VisualAesthetics() {
  const [activeTab, setActiveTab] = useState<'flat' | 'video' | '3d'>('flat');
  
  // Lightbox / Carousel State for flat graphics
  const [carouselProject, setCarouselProject] = useState<BaseProject | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  
  // 3D wireframe simulator state
  const [wireframeToggles, setWireframeToggles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const navbar = document.getElementById('retro-navbar');
    if (carouselProject) {
      document.body.style.overflow = 'hidden';
      if (navbar) {
        navbar.style.display = 'none';
      }
    } else {
      document.body.style.overflow = '';
      if (navbar) {
        navbar.style.display = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (navbar) {
        navbar.style.display = '';
      }
    };
  }, [carouselProject]);

  const toggleWireframe = (id: string) => {
    setWireframeToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openCarousel = (project: BaseProject) => {
    setCarouselProject(project);
    setCarouselIndex(0);
  };

  const nextCarouselItem = () => {
    if (!carouselProject) return;
    setCarouselIndex(prev => (prev + 1) % carouselProject.images.length);
  };

  const prevCarouselItem = () => {
    if (!carouselProject) return;
    setCarouselIndex(prev => (prev - 1 + carouselProject.images.length) % carouselProject.images.length);
  };

  const renderTabSelector = (position: 'top' | 'bottom') => {
    return (
      <div className={`w-full ${position === 'top' ? 'mb-8' : 'mt-12 pt-8 border-t-3 border-dashed border-[#024C38]/20'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {(['flat', 'video', '3d'] as const).map((tab) => {
            const labels = { flat: '平面视觉系列', video: '视频系列项目', '3d': '3D模型系列' };
            const sublabels = { flat: 'FLAT ART', video: 'MOTION WORK', '3d': '3D MODEL' };
            const icons = { flat: Layers, video: Film, '3d': Box };
            const Icon = icons[tab];
            const isSelected = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  // Scroll container back up to header
                  const el = document.getElementById('visual-container');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`w-full p-4 sm:p-5 retro-border-sm flex items-center justify-between gap-4 transition-all duration-300 text-left cursor-pointer group/tab-btn ${
                  isSelected
                    ? 'bg-[#CE0F51] text-white border-3 border-[#024C38] shadow-[3px_3px_0px_0px_#024C38] translate-x-[2px] translate-y-[2px]'
                    : 'bg-[#FAF4EB] hover:bg-[#F1C5C1]/20 text-[#024C38] border-3 border-[#024C38] shadow-[5px_5px_0px_0px_#024C38] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_#CE0F51]'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Styled Icon Wrapper */}
                  <div className={`p-2.5 retro-border-sm shrink-0 transition-transform duration-300 ${
                    isSelected ? 'bg-[#F3D03B] text-[#024C38] rotate-[-6deg]' : 'bg-white text-[#024C38] group-hover/tab-btn:rotate-6'
                  }`}>
                    <Icon className="w-5 h-5 sm:w-6 h-6 stroke-[2.5]" />
                  </div>
                  
                  {/* Simplified Title Text */}
                  <div className="flex flex-col">
                    <span className={`font-mono text-[9px] font-black uppercase tracking-widest ${
                      isSelected ? 'text-[#F3D03B]' : 'text-[#CE0F51]'
                    }`}>
                      {sublabels[tab]}
                    </span>
                    <h3 className="font-block text-base sm:text-lg uppercase leading-tight">
                      {labels[tab]}
                    </h3>
                  </div>
                </div>

                {/* Right Arrow Indicator */}
                <div className={`w-8 h-8 border-2 border-[#024C38] flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isSelected 
                    ? 'bg-[#F3D03B] text-[#024C38] rotate-90' 
                    : 'bg-white text-[#024C38] group-hover/tab-btn:translate-x-1'
                }`}>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 relative">
      
      {/* Sub Navigation Tabs */}
      {renderTabSelector('top')}

      {/* ------------------- TAB 1: FLAT GRAPHICS (平面视觉) ------------------- */}
      {activeTab === 'flat' && (
          <div className="flex flex-col gap-20">
            {VISUAL_PROJECTS.map((project, projIdx) => (
              <VisualProjectCard
                key={project.id}
                project={project}
                projIdx={projIdx}
                openCarousel={openCarousel}
                setCarouselIndex={setCarouselIndex}
              />
            ))}
          </div>
        )}

        {/* ------------------- TAB 2: VIDEO GALLERY (视频系列) ------------------- */}
        {activeTab === 'video' && (
          <div className="flex flex-col gap-16">
            {VIDEO_PROJECTS.map((video) => (
              <div 
                key={video.id} 
                className="bg-[#F6F3EB] retro-border-lg p-5 sm:p-8 lg:p-10 retro-shadow-green-lg flex flex-col gap-12"
              >
                {/* TOP SECTION: Cinematic Video Screen & Consolidated Project Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Left Side: Widescreen Video Player (Larger proportion) */}
                  <div className="lg:col-span-7 flex flex-col gap-3 w-full">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-[#CE0F51] border border-[#024C38]" />
                        <span className="px-2.5 py-1 bg-[#CE0F51] text-white font-mono text-[10px] font-black border-2 border-[#024C38] shadow-[2px_2px_0px_0px_#024C38] max-w-max uppercase tracking-wider">
                          STYLE ANIMATION // 风格化短动画制作
                        </span>
                      </div>
                      <MainVideoPlayer videoUrl={video.videoUrl} thumbnail={video.thumbnail} />
                    </div>
                  </div>

                  {/* Right Side: Single Consolidated Dossier Card (Compact, focused text) */}
                  <div className="lg:col-span-5 bg-[#024C38] text-[#F6F3EB] p-5 sm:p-6 retro-border-lg shadow-[8px_8px_0px_0px_#CE0F51] flex flex-col justify-between gap-5">
                    {/* Header: Title & Specs */}
                    <div className="flex flex-col gap-4 border-b-2 border-[#F3D03B]/30 pb-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-[#F3D03B] rounded-none animate-pulse border border-[#024C38]" />
                          <span className="font-mono text-[10px] text-[#F3D03B] font-black uppercase tracking-widest">
                            PROJECT DOSSIER // 剧集档案
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-[#CE0F51] text-white font-mono text-[10px] font-bold border border-white/20">
                          时长：{video.duration}
                        </span>
                      </div>

                      <h3 className="font-block text-2xl sm:text-3xl text-[#F3D03B] uppercase leading-tight tracking-wide">
                        {video.title}
                      </h3>

                      <div className="bg-[#F6F3EB]/10 p-3 retro-border-sm font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/10">
                        <span className="text-[#F1C5C1] font-bold shrink-0">role：</span>
                        <span className="text-white font-semibold">{video.role}</span>
                      </div>
                    </div>

                    {/* Section 1: 影片梗概 */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#F3D03B]" />
                        <h4 className="font-mono text-xs font-black text-[#F3D03B] uppercase tracking-wider">
                          影片梗概 // SYNOPSIS
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm font-sans font-normal leading-relaxed text-[#F6F3EB]/95 pl-4 border-l-2 border-[#F3D03B]/40">
                        {video.description}
                      </p>
                    </div>

                    {/* Section 2: 创新点 */}
                    {video.innovations && video.innovations.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#F1C5C1]" />
                          <h4 className="font-mono text-xs font-black text-[#F1C5C1] uppercase tracking-wider">
                            创新点 // INNOVATIONS
                          </h4>
                        </div>
                        <ul className="flex flex-col gap-2 text-xs sm:text-sm font-sans pl-4 border-l-2 border-[#F1C5C1]/40 text-[#F6F3EB]/90">
                          {video.innovations.map((item, idx) => (
                            <li key={idx} className="flex gap-2 items-start leading-relaxed">
                              <span className="text-[#F3D03B] font-bold shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Section 3: 使用工具 */}
                    {video.toolsCategories && video.toolsCategories.length > 0 && (
                      <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#CE0F51]" />
                          <h4 className="font-mono text-xs font-black text-[#F3D03B] uppercase tracking-wider">
                            使用工具 // TOOLSET
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans pl-4">
                          {video.toolsCategories.map((cat, idx) => (
                            <div key={idx} className="flex items-baseline gap-1.5 leading-relaxed bg-black/20 p-2 retro-border-sm border-white/10">
                              <span className="font-bold text-[#F1C5C1] shrink-0">• {cat.category}：</span>
                              <span className="font-medium text-white/90">{cat.tools.join('、')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM SECTION: Storyboard Grid with Staggered Retro Collage */}
                <div className="flex flex-col gap-6 pt-10 border-t-3 border-dashed border-[#024C38]/25">
                  <div className="flex items-center justify-between pb-3 border-b-3 border-[#024C38]">
                    <h4 className="font-block text-xl text-[#024C38] flex items-center gap-2">
                      <Layers className="w-6 h-6 text-[#CE0F51] shrink-0" /> 
                      <span>分镜片段展示 // STORYBOARD SCENES</span>
                    </h4>
                    <div className="font-mono text-xs font-black bg-[#F3D03B] text-[#024C38] border-2 border-[#024C38] px-2.5 py-1 shadow-[2px_2px_0px_0px_#024C38]">
                      SEGMENTS: 0{video.storyboard.length}
                    </div>
                  </div>

                  {/* Grid of asymmetrical collage cards (Sizes changes, Offsets, Staggered) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
                    {video.storyboard.map((item, idx) => {
                      // Determine column span and visual variations based on index to create organic uneven offsets and size differences
                      let colSpan = 'lg:col-span-4'; // default
                      const aspectClass = 'aspect-[16/9]'; // Unified 16:9 aspect ratio for all video storyboard frames
                      let bgAccent = 'bg-white';
                      let offsetClass = '';
                      let rotationClass = '';
                      let borderTheme = 'border-[#024C38]';
                      let shadowTheme = 'shadow-[4px_4px_0px_0px_#024C38] hover:shadow-[6px_6px_0px_0px_#CE0F51]';

                      if (idx === 0) {
                        // Big spotlight card
                        colSpan = 'lg:col-span-6';
                        bgAccent = 'bg-white';
                        borderTheme = 'border-3 border-[#024C38]';
                        shadowTheme = 'shadow-[6px_6px_0px_0px_#CE0F51] hover:shadow-[8px_8px_0px_0px_#024C38]';
                      } else if (idx === 1) {
                        colSpan = 'lg:col-span-3';
                        offsetClass = 'lg:translate-y-4';
                        rotationClass = 'lg:rotate-1';
                      } else if (idx === 2) {
                        colSpan = 'lg:col-span-3';
                        rotationClass = 'lg:rotate-[-1deg]';
                      } else if (idx === 3) {
                        colSpan = 'lg:col-span-4';
                        offsetClass = 'lg:translate-y-[-8px]';
                      } else if (idx === 4) {
                        // Wide spotlight card
                        colSpan = 'lg:col-span-5';
                        bgAccent = 'bg-[#FAF4EB]';
                        offsetClass = 'lg:translate-y-2';
                        rotationClass = 'lg:rotate-[1deg]';
                      } else if (idx === 5) {
                        colSpan = 'lg:col-span-3';
                        bgAccent = 'bg-[#F1C5C1]/10';
                        offsetClass = 'lg:translate-y-4';
                        rotationClass = 'lg:rotate-[-1deg]';
                      }

                      return (
                        <div 
                          key={idx} 
                          className={`retro-border-sm p-3 flex flex-col justify-between gap-3 transition-all duration-300 hover:translate-y-[-2px] ${colSpan} ${bgAccent} ${offsetClass} ${rotationClass} ${borderTheme} ${shadowTheme}`}
                        >
                          <div className="flex flex-col gap-2">
                            {/* Image with subtle loader bar effect */}
                            <div className="w-full relative overflow-hidden group/thumb border-2 border-[#024C38]">
                              <div className={`w-full ${aspectClass} bg-[#024C38] overflow-hidden`}>
                                <StoryboardVideo src={item.video} />
                              </div>
                              
                              {/* Scene Tag */}
                              <div className="absolute top-2 left-2 bg-[#024C38] text-white font-mono text-[9px] font-black px-2 py-0.5 border border-[#FAF4EB]">
                                SCENE 0{idx + 1}
                              </div>
                            </div>

                            {/* Meta info */}
                            <div className="flex justify-between items-center text-[10px] font-mono font-black text-[#CE0F51] border-b border-[#024C38]/10 pb-1">
                              <span>TIMELINE POS:</span>
                              <span className="bg-[#024C38]/10 px-1.5 py-0.5 text-[#024C38]">{item.time}</span>
                            </div>
                          </div>

                          {/* Description text */}
                          <p className="text-xs text-[#024C38] leading-relaxed font-sans font-bold">
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ------------------- TAB 3: 3D MODEL GALLERY (3D模型) ------------------- */}
        {activeTab === '3d' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
            {MODELS_3D.map((model, idx) => {
              const showWireframe = wireframeToggles[model.id] || false;
              
              // Define asymmetrical layout configurations for all 11 models in a compact 12-col layout
              let colSpan = 'lg:col-span-4'; // default
              let aspectClass = 'aspect-[4/3]';
              let offsetClass = '';
              let rotationClass = '';
              let shadowTheme = 'shadow-[4px_4px_0px_0px_#024C38] hover:shadow-[6px_6px_0px_0px_#CE0F51]';

              if (idx === 0) {
                // Wide spotlight card
                colSpan = 'lg:col-span-5';
                aspectClass = 'aspect-[4/3]';
                shadowTheme = 'shadow-[5px_5px_0px_0px_#CE0F51] hover:shadow-[7px_7px_0px_0px_#024C38]';
              } else if (idx === 1) {
                colSpan = 'lg:col-span-3';
                aspectClass = 'aspect-square';
                offsetClass = 'lg:translate-y-1.5';
                rotationClass = 'lg:rotate-1';
              } else if (idx === 2) {
                colSpan = 'lg:col-span-4';
                aspectClass = 'aspect-[4/3]';
                rotationClass = 'lg:rotate-[-1deg]';
              } else if (idx === 3) {
                colSpan = 'lg:col-span-3';
                aspectClass = 'aspect-square';
                offsetClass = 'lg:translate-y-[-4px]';
              } else if (idx === 4) {
                colSpan = 'lg:col-span-3';
                aspectClass = 'aspect-square';
                rotationClass = 'lg:rotate-[1deg]';
              } else if (idx === 5) {
                colSpan = 'lg:col-span-6';
                aspectClass = 'aspect-[16/10]';
                shadowTheme = 'shadow-[5px_5px_0px_0px_#024C38] hover:shadow-[7px_7px_0px_0px_#CE0F51]';
              } else if (idx === 6) {
                colSpan = 'lg:col-span-4';
                aspectClass = 'aspect-[4/3]';
                rotationClass = 'lg:rotate-[-1deg]';
              } else if (idx === 7) {
                colSpan = 'lg:col-span-3';
                aspectClass = 'aspect-square';
                offsetClass = 'lg:translate-y-1.5';
              } else if (idx === 8) {
                colSpan = 'lg:col-span-5';
                aspectClass = 'aspect-[16/10]';
                rotationClass = 'lg:rotate-[1deg]';
                shadowTheme = 'shadow-[5px_5px_0px_0px_#024C38] hover:shadow-[7px_7px_0px_0px_#CE0F51]';
              } else if (idx === 9) {
                colSpan = 'lg:col-span-6';
                aspectClass = 'aspect-[16/10]';
                rotationClass = 'lg:rotate-[-1deg]';
              } else if (idx === 10) {
                colSpan = 'lg:col-span-6';
                aspectClass = 'aspect-[16/10]';
                rotationClass = 'lg:rotate-1';
                shadowTheme = 'shadow-[5px_5px_0px_0px_#CE0F51] hover:shadow-[7px_7px_0px_0px_#024C38]';
              }

              return (
                <LazyModelCard 
                  key={model.id}
                  className={`${colSpan} ${offsetClass} ${rotationClass}`}
                >
                  <div className={`bg-[#FAF4EB] retro-border p-3 sm:p-4 flex flex-col justify-between gap-3 transition-all duration-300 hover:translate-y-[-2px] ${shadowTheme}`}>
                    <div className="flex flex-col gap-2.5">
                      {/* Header bar */}
                      <div className="flex justify-between items-center pb-2 border-b border-dashed border-[#024C38]/20 font-mono text-[8.5px] font-black">
                        <span className="text-[#CE0F51] tracking-wider uppercase">
                          [ SCENE {String(idx + 1).padStart(2, '0')} // MODEL ]
                        </span>
                        <span className="bg-[#024C38] text-[#F3D03B] px-1.5 py-0.5 retro-border-sm">
                          TRIS: {model.triangles}
                        </span>
                      </div>

                      {/* Interactive 3D Model Viewport (Auto-rotating wireframe/solid) */}
                      <div className={`w-full ${aspectClass} bg-white retro-border overflow-hidden relative group`}>
                        <Model3DViewer 
                          modelId={model.id} 
                          modelUrl={model.modelUrl}
                          showWireframe={showWireframe} 
                          themeColor={idx % 2 === 0 ? '#024C38' : '#CE0F51'} 
                        />

                        {/* HUD Overlays */}
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#024C38]/95 text-[#F3D03B] font-mono text-[8px] font-black retro-border-sm z-20 pointer-events-none">
                          {showWireframe ? 'MESH: WIREFRAME' : 'MESH: SHADED'}
                        </div>

                        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-[#CE0F51]/95 text-white font-mono text-[8px] font-black retro-border-sm z-20 pointer-events-none">
                          ROT: AUTO_3D
                        </div>
                      </div>

                      {/* Compact Title Text ONLY */}
                      <h4 className="font-block text-sm sm:text-base text-[#024C38] uppercase leading-tight mt-0.5">
                        {model.title}
                      </h4>
                    </div>

                    {/* Shading/Wireframe Interactivity Switcher Button */}
                    <button
                      onClick={() => toggleWireframe(model.id)}
                      className={`w-full py-1.5 font-mono text-[10px] sm:text-xs font-black retro-border-sm transition-all cursor-pointer text-center ${
                        showWireframe 
                          ? 'bg-[#CE0F51] text-white shadow-[2px_2px_0px_0px_#024C38]' 
                          : 'bg-[#F3D03B] hover:bg-[#dfbd21] text-[#024C38] retro-shadow-green-sm'
                      }`}
                    >
                      {showWireframe ? '⚡ SWITCH TO SHADED / 实体渲染' : '⚙️ WIREFRAME VIEW / 查看网格'}
                    </button>
                  </div>
                </LazyModelCard>
              );
            })}
          </div>
        )}

      {/* Bottom Tab Selector */}
      {renderTabSelector('bottom')}

      {/* ------------------- LIGHTBOX / CAROUSEL MODAL (查看完整系列作品) ------------------- */}
      {carouselProject && (
        <div 
          className="fixed inset-0 z-[100] bg-[#024C38]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          id="full-series-lightbox"
        >
          {/* Close button on outer corner */}
          <button
            onClick={() => setCarouselProject(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-[#CE0F51] text-white retro-border rounded-none flex items-center justify-center retro-shadow-green cursor-pointer z-50 hover:scale-105"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal content container - Maximized size and layout */}
          <div className="w-full max-w-7xl bg-[#F6F3EB] retro-border-lg p-4 sm:p-6 retro-shadow-green-lg flex flex-col justify-between relative h-[88vh] lg:h-[92vh] max-h-[1000px] overflow-hidden">
            
            {/* Header info - ONLY Title and Index counter */}
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#024C38] pb-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline px-2 py-0.5 bg-[#F3D03B] text-[#024C38] font-mono text-[10px] font-black retro-border-sm">
                  HIGH-QUALITY EXHIBITION
                </span>
                <h3 className="font-display font-black text-base sm:text-lg text-[#024C38] uppercase">
                  {carouselProject.title}
                </h3>
              </div>
              <span className="font-mono text-xs font-black text-[#024C38] bg-[#F1C5C1] px-3 py-1 retro-border-sm">
                {carouselIndex + 1} / {carouselProject.images.length}
              </span>
            </div>

            {/* Carousel Interactive Body - Devotes almost all space to the image */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
              
              {/* Previous Button - Left overlay */}
              <button
                onClick={prevCarouselItem}
                className="absolute left-2 sm:left-4 bg-[#F3D03B]/90 hover:bg-[#F3D03B] text-[#024C38] w-12 h-12 retro-border rounded-none flex items-center justify-center retro-shadow-green-sm z-30 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                title="Previous Image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              {/* Main image container */}
              <div className="w-full h-full bg-white/30 retro-border overflow-hidden flex items-center justify-center p-2 relative">
                <img
                  src={carouselProject.images[carouselIndex]}
                  alt={`${carouselProject.title} - Full item ${carouselIndex + 1}`}
                  className="max-h-full max-w-full object-contain select-none transition-all duration-300"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  referrerPolicy="no-referrer"
                />
                
                {/* Dense Watermark for Lightbox */}
                <WatermarkOverlay variant="dense" />

                {/* Transparent interaction blocker */}
                <div className="absolute inset-0 z-30" onContextMenu={(e) => e.preventDefault()} />
                
                {/* Seed Badge - Discreet metadata */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#024C38] text-white font-mono text-[8px] font-bold z-40">
                  SEED_{carouselIndex * 1421 + 8421}
                </div>
              </div>

              {/* Next Button - Right overlay */}
              <button
                onClick={nextCarouselItem}
                className="absolute right-2 sm:right-4 bg-[#F3D03B]/90 hover:bg-[#F3D03B] text-[#024C38] w-12 h-12 retro-border rounded-none flex items-center justify-center retro-shadow-green-sm z-30 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                title="Next Image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            {/* Thumbnail Navigation Strip - Centered, fast scrolling */}
            <div className="flex gap-2 overflow-x-auto py-2 border-t border-dashed border-[#024C38]/20 scrollbar-none shrink-0 justify-start sm:justify-center">
              {carouselProject.images.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 bg-white retro-border shrink-0 cursor-pointer overflow-hidden transition-all relative ${
                    carouselIndex === idx ? 'border-[#CE0F51] scale-105 border-3 z-10' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
