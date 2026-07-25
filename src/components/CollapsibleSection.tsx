import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

interface CollapsibleSectionProps {
  id: string;
  title: string;       // Chinese title, e.g. "个人简介"
  subtitle: string;    // English title, e.g. "About"
  description?: string; // Optional descriptive subtext
  indexStr: string;    // "00", "01", "02", "03", "04"
  themeColor: string;  // Hex or Tailwind color for specific accents
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  id,
  title,
  subtitle,
  description,
  indexStr,
  themeColor,
  isOpen,
  onToggle,
  children
}: CollapsibleSectionProps) {
  const motionBodyRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      id={`${id}-container`}
      className="w-full border-b-3 border-[#024C38] first:border-t-3 transition-all duration-300"
    >
      {/* HEADER TRIGGER - Spans Full Width, Cheerful Retro Pink/Green Theme */}
      <button
        onClick={onToggle}
        className={`w-full text-left py-8 sm:py-12 px-4 md:px-12 lg:px-20 xl:px-32 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer relative overflow-hidden transition-all duration-300 select-none group border-none outline-none ${
          isOpen 
            ? 'bg-[#F1C5C1]' // Active gets the gorgeous lively pink!
            : 'bg-[#F6F3EB] hover:bg-[#F1C5C1]/30' // Inactive is sand, hover is light pink tint
        }`}
        aria-expanded={isOpen}
        id={`${id}-trigger-btn`}
      >
        {/* Left Side: Outlined Huge Number & Large Bold Titles */}
        <div className="flex items-center gap-4 sm:gap-8 md:gap-12 z-10 flex-1">
          {/* Huge Retro Outlined/Filled Number */}
          <div 
            className={`font-block text-6xl sm:text-8xl lg:text-9xl tracking-tighter select-none transition-all duration-300 ${
              isOpen ? 'text-[#024C38] scale-105' : 'text-transparent group-hover:scale-105'
            }`}
            style={{
              WebkitTextStroke: '2.5px #024C38',
            }}
          >
            {indexStr}
          </div>

          {/* Titles Stack */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-baseline gap-2 sm:gap-4 flex-wrap">
              {/* Massive Chinese Title */}
              <h2 className="font-block text-3xl sm:text-5xl lg:text-6xl text-[#024C38] uppercase tracking-tight">
                {title}
              </h2>
              {/* Massive Serif Italic English Title */}
              <span className="font-serif italic font-normal text-2xl sm:text-4xl lg:text-5xl text-[#CE0F51] tracking-tight">
                {subtitle}
              </span>
            </div>
            
            {description && (
              <p className="text-xs sm:text-sm max-w-3xl leading-relaxed font-sans font-medium text-[#024C38]/80 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Retro Badge & Toggle Box */}
        <div className="flex items-center gap-4 z-10 self-end md:self-auto">
          {/* Playful Micro Status Badge */}
          <div className={`hidden sm:flex items-center gap-1.5 font-mono text-[10px] font-black uppercase px-2.5 py-1 border-2 border-[#024C38] shadow-[2px_2px_0px_0px_#024C38] ${
            isOpen ? 'bg-[#F3D03B] text-[#024C38]' : 'bg-white text-gray-500'
          }`}>
            <span className={`inline-block w-2 h-2 rounded-none border border-[#024C38] ${
              isOpen ? 'bg-[#CE0F51] animate-pulse' : 'bg-gray-300'
            }`} />
            <span>
              {isOpen ? 'ACTIVE // 已部署' : 'STANDBY // 未展开'}
            </span>
          </div>

          {/* Square Toggle Plus/Minus Button (Neo-brutalist style) */}
          <div 
            className={`w-12 h-12 border-3 border-[#024C38] flex items-center justify-center transition-all duration-300 ${
              isOpen 
                ? 'bg-[#F3D03B] text-[#024C38] shadow-[2px_2px_0px_0px_#024C38]' 
                : 'bg-white text-[#024C38] shadow-[4px_4px_0px_0px_#024C38] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_0px_#024C38]'
            }`}
          >
            {isOpen ? (
              <Minus className="w-6 h-6 stroke-[3]" />
            ) : (
              <Plus className="w-6 h-6 stroke-[3]" />
            )}
          </div>
        </div>

        {/* Accent strip on bottom that fills up on hover/active */}
        <div 
          className="absolute left-0 bottom-0 h-1.5 transition-all duration-300"
          style={{ 
            backgroundColor: themeColor,
            width: isOpen ? '100%' : '0%'
          }}
        />
      </button>

      {/* EXPANDABLE BODY */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: { 
                height: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.4, delay: 0.1 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              overflow: 'hidden',
              transition: { 
                height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.2 }
              }
            }}
            onAnimationComplete={() => {
              // 展开动画结束后移除 overflow 裁剪，避免 Chromium 中视频渲染被中断
              if (motionBodyRef.current) {
                motionBodyRef.current.style.overflow = 'visible';
              }
            }}
            ref={motionBodyRef}
            className="bg-[#FAF4EB]"
          >
            <div className="w-full border-t-3 border-[#024C38]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
