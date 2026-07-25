import React, { useState, useRef } from 'react';
import { 
  Sliders, Sparkles, 
  CheckCircle, ArrowRightLeft, Maximize2, X
} from 'lucide-react';
import { BRAND_EDIT_IMAGES, BRAND_GENERATE_IMAGES } from '../data';
import SmartImage from './SmartImage';

export default function CommercialCases() {
  const [editCategoryIdx, setEditCategoryIdx] = useState(0); // 0: 电商产品背景, 1: 万物迁移, 2: 视觉风格切换
  const [selectedImageIdx, setSelectedImageIdx] = useState(0); // 0 to 5
  const [generateCategoryIdx, setGenerateCategoryIdx] = useState(0); // 0: 主题视觉设计, 1: IP 形象定制, 2: VI 延展设计, 3: Banner 广告
  const [lightboxImg, setLightboxImg] = useState<{ url: string; title: string; ratio: string } | null>(null);

  // Section references for smooth scrolling when switching categories from bottom
  const editSectionRef = useRef<HTMLDivElement | null>(null);
  const generateSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const navbarOffset = 90;
      const elementTop = ref.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementTop - navbarOffset),
        behavior: 'smooth'
      });
    }
  };

  const switchEditCategory = (newIdx: number) => {
    setEditCategoryIdx(newIdx);
    setSelectedImageIdx(0);
    scrollToRef(editSectionRef);
  };

  const selectImageItem = (idx: number) => {
    setSelectedImageIdx(idx);
    scrollToRef(editSectionRef);
  };

  const switchGenerateCategory = (newIdx: number) => {
    setGenerateCategoryIdx(newIdx);
    scrollToRef(generateSectionRef);
  };

  // BEFORE/AFTER Slider drag reference & calculation state
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderMove = (clientX: number) => {
    const container = sliderRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const currentEditCategory = BRAND_EDIT_IMAGES[editCategoryIdx];
  const beforeImage = currentEditCategory.beforeImages?.[selectedImageIdx] || currentEditCategory.beforeImages?.[0] || currentEditCategory.images[selectedImageIdx];
  const afterImage = currentEditCategory.images[selectedImageIdx]; // AI edited version

  const currentGenerateCategory = BRAND_GENERATE_IMAGES[generateCategoryIdx];

  return (
    <div className="p-4 sm:p-6 lg:p-10 relative">

        {/* CONTENT SPLITS */}
        <div className="flex flex-col gap-20">

          {/* ============================================================ */}
          {/* CASE 1: IMAGE EDIT (图像调整 - 换背景, 迁移, 换风格) */}
          {/* ============================================================ */}
          <div ref={editSectionRef} className="bg-[#F6F3EB] retro-border-lg p-6 sm:p-8 retro-shadow-green-lg scroll-mt-24">
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b-2 border-dashed border-[#024C38]/20 pb-4 mb-6 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#F1C5C1] text-[#024C38] retro-border-sm flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#CE0F51] font-black uppercase block">SMART CREATIVE IMAGE MANIPULATION</span>
                  <h3 className="font-display font-black text-xl text-[#024C38] uppercase">
                    01 // 图像调整（Edit）对比
                  </h3>
                </div>
              </div>
            </div>

            {/* Sub content: Before/After Drag Slider and Gallery Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT Column: Before After Interactive Slider container */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                <span className="font-mono text-[10px] text-[#CE0F51] font-black block uppercase">
                  DRAG CENTER HANDLE TO COMPARE // 左右拖拽分割线进行对比
                </span>

                <div 
                  ref={sliderRef}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  onMouseDown={() => setIsDragging(true)}
                  onTouchStart={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onTouchEnd={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  className="w-full aspect-[4/3] bg-[#024C38] retro-border-lg overflow-hidden relative select-none cursor-ew-resize group"
                >
                  {/* Before Image (grayscale simulation of original) */}
                  <img
                    src={beforeImage}
                    alt="Original before AI edit"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white font-mono text-[9px] px-2 py-0.5 z-10">
                    原图 BEFORE
                  </div>

                  {/* After Image container with clip path */}
                  <div 
                    className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                    style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                  >
                    <img
                      src={afterImage}
                      alt="AI edited result"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ width: sliderRef.current?.clientWidth || '100%', height: '100%' }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-[#F3D03B] text-[#024C38] font-mono text-[9px] px-2 py-0.5 z-10 retro-border-sm font-bold">
                      AIGC AFTER
                    </div>
                  </div>

                  {/* Sliding vertical divider handle */}
                  <div 
                    className="absolute top-0 bottom-0 w-1.5 bg-[#F3D03B] z-20 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#CE0F51] retro-border text-white flex items-center justify-center rounded-none shadow-md">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <p className="text-xs font-mono text-gray-500 text-center leading-snug">
                  // 滑动分割线查看对比效果
                </p>
              </div>

              {/* RIGHT Column: 6 Images Selector & Details */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                
                {/* Description details card */}
                <div className="bg-[#F1C5C1] p-5 retro-border retro-shadow-green text-[#024C38]">
                  <div className="flex flex-col gap-1 mb-2">
                    <span className="font-mono text-[9px] text-[#CE0F51] font-black uppercase tracking-wider block">
                      {currentEditCategory.enTitle || 'COMMERCIAL EDIT CASE'}
                    </span>
                    <h4 className="font-display font-black text-lg uppercase text-[#024C38]">
                      {currentEditCategory.title} CASE DETAIL
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed font-sans font-medium">
                    {currentEditCategory.description}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-2.5 py-0.5 bg-[#024C38] text-white font-mono text-[9px] retro-border-sm">
                      ACCURACY: 99.8%
                    </span>
                    <span className="px-2.5 py-0.5 bg-white text-[#024C38] font-mono text-[9px] retro-border-sm font-bold">
                      {currentEditCategory.tag || 'COMMERCIAL READY'}
                    </span>
                  </div>
                </div>

                {/* 6 Grid thumbnails selector */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[10px] text-[#CE0F51] font-black uppercase">
                    CHOOSE OTHER ITEMS // 另选 6 个对比案例
                  </span>

                  <div className="grid grid-cols-3 gap-3">
                    {currentEditCategory.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectImageItem(idx)}
                        className={`aspect-square retro-border overflow-hidden relative cursor-pointer ${
                          selectedImageIdx === idx ? 'ring-[3px] ring-[#CE0F51] scale-[1.02] border-[#CE0F51]' : 'opacity-70'
                        }`}
                      >
                        <SmartImage
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          containerClassName="h-full"
                          targetWidth={400}
                          targetHeight={400}
                        />
                        <div className="absolute bottom-1 right-1 bg-[#024C38] text-white font-mono text-[8px] px-1.5 py-[2px] rounded-none z-10">
                          CASE 0{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Category Navigation Bar */}
            <div className="mt-8 pt-5 sm:pt-6 border-t-2 border-dashed border-[#024C38]/20 bg-[#FAF4EB] p-2.5 sm:p-4 md:p-5 retro-border shadow-[4px_4px_0px_0px_#024C38]">
              <div className="grid grid-cols-2 md:flex md:flex-wrap md:items-center md:justify-between gap-2 sm:gap-3 w-full">
                {/* Category selector buttons */}
                {BRAND_EDIT_IMAGES.map((cat, idx) => {
                  const isActive = editCategoryIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => switchEditCategory(idx)}
                      className={`relative px-2 py-2.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-display font-black cursor-pointer retro-border-sm transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 group select-none text-center w-full md:w-auto ${
                        isActive 
                          ? 'bg-[#CE0F51] text-white shadow-[2px_2px_0px_0px_#024C38] md:shadow-[3px_3px_0px_0px_#024C38] -translate-y-0.5 scale-[1.01]' 
                          : 'bg-white text-[#024C38] hover:bg-[#F3D03B] hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#024C38] md:hover:shadow-[3px_3px_0px_0px_#024C38]'
                      }`}
                    >
                      {/* Index badge */}
                      <span className={`w-4 h-4 sm:w-5 sm:h-5 font-mono text-[9px] sm:text-[10px] flex items-center justify-center font-bold transition-colors shrink-0 ${
                        isActive ? 'bg-[#F3D03B] text-[#024C38]' : 'bg-[#024C38]/10 text-[#024C38] group-hover:bg-[#024C38] group-hover:text-white'
                      }`}>
                        0{idx + 1}
                      </span>

                      <span className="truncate">{cat.title}</span>

                      {/* Continuous looping animations on active */}
                      {isActive ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F3D03B] opacity-80"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F3D03B]"></span>
                          </span>
                          <span className="inline-block animate-[spin_2.5s_linear_infinite] text-[#F3D03B] text-xs leading-none">✦</span>
                        </div>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#024C38]/20 group-hover:bg-[#CE0F51] group-hover:scale-125 transition-all shrink-0" />
                      )}
                    </button>
                  );
                })}

                {/* Quick next category button */}
                <button
                  onClick={() => switchEditCategory((editCategoryIdx + 1) % BRAND_EDIT_IMAGES.length)}
                  className="px-2 py-2.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-display font-black bg-[#F3D03B] text-[#024C38] hover:bg-[#024C38] hover:text-white retro-border-sm shadow-[2px_2px_0px_0px_#024C38] md:shadow-[3px_3px_0px_0px_#024C38] transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 group text-center w-full md:w-auto md:ml-auto"
                >
                  <span className="truncate">下一类别: {BRAND_EDIT_IMAGES[(editCategoryIdx + 1) % BRAND_EDIT_IMAGES.length].title}</span>
                  <span className="font-mono font-bold text-sm group-hover:translate-x-1 transition-transform shrink-0">→</span>
                </button>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* CASE 2: CREATIVE IMPLEMENTATION (主题视觉, IP, VI, Banner) */}
          {/* ============================================================ */}
          <div ref={generateSectionRef} className="bg-white retro-border-lg p-6 sm:p-8 retro-shadow-green-lg scroll-mt-24">
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b-2 border-dashed border-[#024C38]/20 pb-4 mb-6 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#F3D03B] text-[#024C38] retro-border-sm flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#CE0F51] font-black uppercase block">INTELLIGENT CREATIVE BRAND PRODUCTION</span>
                  <h3 className="font-display font-black text-xl text-[#024C38] uppercase">
                    02 // 创意实现（Generate）
                  </h3>
                </div>
              </div>
            </div>

            {/* Displaying 4 Grid images of current generate category in spacious 2-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {currentGenerateCategory.images.map((img, idx) => (
                <div 
                  key={idx}
                  className="bg-[#F6F3EB] retro-border p-3.5 sm:p-4 retro-shadow-green-sm flex flex-col gap-3 group hover:scale-[1.01] transition-transform relative"
                >
                  <div 
                    onClick={() => setLightboxImg({ url: img, title: `${currentGenerateCategory.type} 案例 0${idx + 1}`, ratio: currentGenerateCategory.aspectRatio })}
                    className={`w-full ${currentGenerateCategory.aspectClass || 'aspect-[16/9]'} bg-[#024C38] retro-border-sm overflow-hidden relative cursor-pointer`}
                  >
                    <img
                      src={img}
                      alt={`${currentGenerateCategory.type} ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 bg-[#CE0F51] text-white font-mono text-[9px] font-bold retro-border-sm shadow-sm">
                      PROD_0{idx + 1}
                    </div>
                    <div className="absolute top-2 right-2 px-2.5 py-0.5 bg-[#F3D03B] text-[#024C38] font-mono text-[9px] font-black retro-border-sm shadow-sm">
                      RATIO: {currentGenerateCategory.aspectRatio}
                    </div>

                    {/* Hover enlarge cue */}
                    <div className="absolute inset-0 bg-[#024C38]/0 group-hover:bg-[#024C38]/30 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#024C38] font-mono text-xs px-3 py-1.5 retro-border-sm font-black flex items-center gap-1.5 shadow-md">
                        <Maximize2 className="w-3.5 h-3.5 text-[#CE0F51]" /> 点击放大预览
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <div>
                      <h4 className="font-display font-black text-sm text-[#024C38]">
                        {currentGenerateCategory.type} · 0{idx + 1}
                      </h4>
                      <span className="font-mono text-[10px] text-gray-500">FORMAT: {currentGenerateCategory.aspectRatio} // AIGC DIRECT GENERATION</span>
                    </div>
                    <span className="px-2 py-0.5 bg-[#024C38] text-[#F3D03B] retro-border-sm font-mono font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-[#F3D03B]" /> PASSED
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Category Navigation Bar */}
            <div className="mt-8 pt-5 sm:pt-6 border-t-2 border-dashed border-[#024C38]/20 bg-[#FAF4EB] p-2.5 sm:p-4 md:p-5 retro-border shadow-[4px_4px_0px_0px_#024C38]">
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 w-full">
                {/* Category selector buttons in 2x2 grid on mobile */}
                <div className="grid grid-cols-2 md:flex md:flex-wrap md:items-center gap-2 sm:gap-3 w-full md:w-auto">
                  {BRAND_GENERATE_IMAGES.map((cat, idx) => {
                    const isActive = generateCategoryIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => switchGenerateCategory(idx)}
                        className={`relative px-2 py-2.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-display font-black cursor-pointer retro-border-sm transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 group select-none text-center w-full md:w-auto ${
                          isActive 
                            ? 'bg-[#024C38] text-white shadow-[2px_2px_0px_0px_#CE0F51] md:shadow-[3px_3px_0px_0px_#CE0F51] -translate-y-0.5 scale-[1.01]' 
                            : 'bg-white text-[#024C38] hover:bg-[#F3D03B] hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#024C38] md:hover:shadow-[3px_3px_0px_0px_#024C38]'
                        }`}
                      >
                        {/* Index badge */}
                        <span className={`w-4 h-4 sm:w-5 sm:h-5 font-mono text-[9px] sm:text-[10px] flex items-center justify-center font-bold transition-colors shrink-0 ${
                          isActive ? 'bg-[#F3D03B] text-[#024C38]' : 'bg-[#024C38]/10 text-[#024C38] group-hover:bg-[#024C38] group-hover:text-white'
                        }`}>
                          0{idx + 1}
                        </span>

                        <span className="truncate">{cat.type}</span>

                        {/* Continuous looping animations on active */}
                        {isActive ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F3D03B] opacity-80"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F3D03B]"></span>
                            </span>
                            <span className="inline-block animate-[spin_2.5s_linear_infinite] text-[#F3D03B] text-xs leading-none">✦</span>
                          </div>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#024C38]/20 group-hover:bg-[#CE0F51] group-hover:scale-125 transition-all shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Quick next category button (Desktop) */}
                <button
                  onClick={() => switchGenerateCategory((generateCategoryIdx + 1) % BRAND_GENERATE_IMAGES.length)}
                  className="hidden md:flex px-4 py-2.5 text-xs sm:text-sm font-display font-black bg-[#F3D03B] text-[#024C38] hover:bg-[#CE0F51] hover:text-white retro-border-sm shadow-[3px_3px_0px_0px_#024C38] transition-all cursor-pointer items-center justify-center gap-2 group ml-auto"
                >
                  <span className="truncate">下一类别: {BRAND_GENERATE_IMAGES[(generateCategoryIdx + 1) % BRAND_GENERATE_IMAGES.length].type}</span>
                  <span className="font-mono font-bold text-sm group-hover:translate-x-1 transition-transform shrink-0">→</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      {/* Lightbox Modal for High-Res Fullscreen View */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxImg(null)}
        >
          <div 
            className="bg-[#F6F3EB] retro-border-lg p-4 sm:p-6 max-w-5xl w-full flex flex-col gap-4 relative shadow-[8px_8px_0px_0px_#024C38]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b-2 border-dashed border-[#024C38]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#CE0F51] text-white font-mono text-[10px] font-black retro-border-sm">
                  {lightboxImg.ratio} FULL VIEW
                </span>
                <h3 className="font-display font-black text-base sm:text-lg text-[#024C38]">
                  {lightboxImg.title}
                </h3>
              </div>
              <button 
                onClick={() => setLightboxImg(null)}
                className="w-8 h-8 bg-[#CE0F51] text-white retro-border-sm flex items-center justify-center font-bold hover:bg-[#a00b3e] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[75vh] flex items-center justify-center overflow-hidden bg-black retro-border">
              <img 
                src={lightboxImg.url} 
                alt={lightboxImg.title} 
                className="max-w-full max-h-[75vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex justify-between items-center font-mono text-xs text-gray-600 pt-1">
              <span>AIGC HIGH RESOLUTION ASSET</span>
              <span className="text-[#024C38] font-bold">CLICK OUTSIDE OR 'X' TO CLOSE</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
