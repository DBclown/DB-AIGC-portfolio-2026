import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Sliders, RefreshCw, Cpu, 
  ChevronLeft, ChevronRight, X, Terminal,
  Sparkles, Check, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COMFY_WORKFLOWS } from '../data';
import SmartImage from './SmartImage';
import WatermarkOverlay from './WatermarkOverlay';

// RAD original character fine-tuned model images for the carousel
const RAD_IMAGES = [
  {
    id: 'rad1',
    title: 'RAD: Cyber Armor Mode',
    zhTitle: 'RAD：赛博装甲主形态',
    desc: '高密度轻量化骨骼特征，配合哑光碳纤维护甲，以及贯穿全身的红色荧光导能管道。本图验证了模型在极限广角透视下的自适应结构控制力。',
    imgUrl: '/2_Technical Presentation/2_Model Fine-tuning/LoRA RAD/RAD (1).png'
  },
  {
    id: 'rad2',
    title: 'RAD: Pilot Suit Edition',
    zhTitle: 'RAD：深空战机驾驶特写',
    desc: '带有抗压密封圈的战术紧身内衬，配有高反射率的金色感光目镜，以及精密的下颌过滤传感器。本图验证了金属与反光橡胶的高光漫反射学习。',
    imgUrl: '/2_Technical Presentation/2_Model Fine-tuning/LoRA RAD/RAD (2).png'
  },
  {
    id: 'rad3',
    title: 'RAD: Neo-Tokyo Street',
    zhTitle: 'RAD：新东京霓虹雨夜',
    desc: '休闲卫衣与硬核机甲的赛博朋克混搭。重点微调训练了潮湿街道反射出的复杂霓虹散景，与人物肩部能量流光交相辉映的夜景表现。',
    imgUrl: '/2_Technical Presentation/2_Model Fine-tuning/LoRA RAD/RAD (3).png'
  },
  {
    id: 'rad4',
    title: 'RAD: Multi-View Blueprint',
    zhTitle: 'RAD：多维透视设计蓝图',
    desc: '白模灰度图、线框拓扑结构以及机械关节构造拆解的综合训练素材。体现模型对底层三维解构逻辑的强大逆向重构性能。',
    imgUrl: '/2_Technical Presentation/2_Model Fine-tuning/LoRA RAD/RAD (4).png'
  },
  {
    id: 'rad5',
    title: 'RAD: Orbital Combat',
    zhTitle: 'RAD：近地轨道逆光跃迁',
    desc: '微重力悬浮姿态下的推进特写。测试背部气流折射以及强逆光对角色碳纤维边缘的晕染质感，边缘光（Rim Light）细节极佳。',
    imgUrl: '/2_Technical Presentation/2_Model Fine-tuning/LoRA RAD/RAD (5).png'
  },
  {
    id: 'rad6',
    title: 'RAD: Orbital Combat (Animated GIF)',
    zhTitle: 'RAD：近地轨道逆光跃迁 (动态GIF)',
    desc: '以动态GIF形式展示微重力悬浮姿态下的推进特写，直观呈现背部气流折射以及强逆光对角色碳纤维边缘的实时晕染变化。边缘光（Rim Light）的动态过渡更加清晰可见。',
    imgUrl: '/2_Technical Presentation/2_Model Fine-tuning/LoRA RAD/RAD (5).gif'
  },
  {
    id: 'rad7',
    title: 'RAD: Dynamic Combat Sequence',
    zhTitle: 'RAD：动态战斗序列展示',
    desc: '展示RAD在连续动作中的动态表现，包含从静止到高速移动的姿态过渡。GIF动画直观呈现了LoRA微调模型在时序一致性上的表现，验证了模型在动态视角下的稳定性和细节连贯性。',
    imgUrl: '/2_Technical Presentation/2_Model Fine-tuning/LoRA RAD/RAD (6).gif'
  }
];

const RAD_INTRO_TEXT = `模型《RAD》简介
RAD是我原创的一个角色形象，它融合了机械与生物的元素。这一角色适用于多种科幻题材的作品，其设计不仅仅是为了美观，更是通过视觉元素传达出角色可能具备的能力和在故事中的潜在角色定位。

其机械部分的设计，如关节处的护具和腿部的装备，展现了高度发达的科技水平。色彩上，以白色和红色为主色调。白色象征着高科技和纯净，而红色则赋予角色一种活力和紧张感。耳朵的形状类似动物耳朵，绿色的眼睛在白色和红色的配色下显得格外突出，暗示角色具有敏锐的感知能力。流线型的设计线条符合空气动力学原理，服装的材质看起来具有金属和织物的混合质感

该模型的训练过程需要大量的高质量参考图像，并需要合理设置训练参数，以达到理想的效果。`;

export default function TechnicalShowcase() {
  // ComfyUI workflow carousel & magnifier states
  const [comfyIdx, setComfyIdx] = useState(0);
  const [isWfModalOpen, setIsWfModalOpen] = useState(false);
  const [magnifier, setMagnifier] = useState<{ x: number; y: number; xPct: number; yPct: number; show: boolean }>({
    x: 0,
    y: 0,
    xPct: 50,
    yPct: 50,
    show: false
  });
  const wfImgRef = useRef<HTMLDivElement>(null);
  const workflowSectionRef = useRef<HTMLDivElement>(null);

  const handleSelectWorkflow = (newIdx: number | ((prev: number) => number)) => {
    setComfyIdx(prev => {
      const next = typeof newIdx === 'function' ? newIdx(prev) : newIdx;
      return next;
    });

    // Smooth bounce/scroll back to the top of the workflow card with navbar offset
    if (workflowSectionRef.current) {
      const navbarOffset = 90;
      const elementTop = workflowSectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementTop - navbarOffset),
        behavior: 'smooth'
      });
    }
  };

  const handleWfMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wfImgRef.current) return;
    const rect = wfImgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setMagnifier({ x, y, xPct, yPct, show: true });
  };

  const handleWfMouseLeave = () => {
    setMagnifier(prev => ({ ...prev, show: false }));
  };

  // 1. LoRA-RAD Training States
  const [learningRate, setLearningRate] = useState<number>(0.0001);
  const [epochs, setEpochs] = useState<number>(12);
  const [batchSize, setBatchSize] = useState<number>(2);
  const [networkDim, setNetworkDim] = useState<number>(32);
  const [radIdx, setRadIdx] = useState<number>(0);
  const [isRadAutoPlay, setIsRadAutoPlay] = useState<boolean>(true);
  const [isRadHovered, setIsRadHovered] = useState<boolean>(false);

  // 2s interval auto page flip for RAD images carousel
  useEffect(() => {
    if (!isRadAutoPlay || isRadHovered) return;
    const interval = setInterval(() => {
      setRadIdx(prev => (prev + 1) % RAD_IMAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isRadAutoPlay, isRadHovered]);

  // Typewriter effect state and refs
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<any>(null);
  const hasTriggeredRef = useRef(false);

  const startTypewriter = () => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }
    setTypedText('');
    setIsTyping(true);
    let index = 0;
    const speed = 12; // Speed of typing in ms
    typingTimerRef.current = setInterval(() => {
      if (index < RAD_INTRO_TEXT.length) {
        setTypedText(RAD_INTRO_TEXT.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
        }
      }
    }, speed);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          startTypewriter();
        }
      },
      { threshold: 0.1 }
    );

    if (philosophyRef.current) {
      observer.observe(philosophyRef.current);
    }

    return () => {
      observer.disconnect();
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  // 2. 3D Model Prompts (4 Prompt Boxes including Negative Prompt)
  const [prompt1, setPrompt1] = useState('A 3D rendered image, smooth plastic-like texture, soft pastel color palette of light blues, whites, and muted purples, soft diffused lighting, clean polished rendering style, cute and friendly aesthetic with a whimsical feel. A robotic cartoon character with pink horns, a black hooded cloak, and a white face');
  const [prompt2, setPrompt2] = useState("The character has bright teal eyes, a jagged, metallic-looking mouth, and small, metallic-looking details on its cheeks. The character's expression is aggressive or angry. The character's body is smooth and plastic-like, reflecting the soft light.");
  const [prompt3, setPrompt3] = useState('The horns have a slightly glossy finish. The cloak has subtle folds and creases, suggesting a soft, pliable material. The metallic details on the face and cheeks are highly polished and reflective. The overall style is reminiscent of anime or cartoon animation, but with a distinctly robotic and pastel aesthetic.');
  const [prompt4, setPrompt4] = useState('photorealistic, realistic rendering, sketch, drawing, painting style, dark colors, vibrant saturated colors, harsh lighting, deep shadows, gritty texture, rough surface, organic features, human, animal, happy expression, multiple limbs, deformed hands, disfigured face, blurry, low quality, low resolution, noisy render, artifacts, text, signature, watermark, ugly, scary');
  const [open3DPrompts, setOpen3DPrompts] = useState<boolean[]>([true, true, true, true]); // All 4 fully expanded by default

  const toggle3DPrompt = (idx: number) => {
    setOpen3DPrompts(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const promptBoxes = [
    {
      id: 0,
      num: '01',
      title: 'STYLE & BASE FORM (整体风格与基础形态)',
      value: prompt1,
      setValue: setPrompt1,
      isNeg: false,
      rows: 3.5
    },
    {
      id: 1,
      num: '02',
      title: 'FACIAL & EXPRESSIONS (面部与角色特征)',
      value: prompt2,
      setValue: setPrompt2,
      isNeg: false,
      rows: 3
    },
    {
      id: 2,
      num: '03',
      title: 'MATERIALS & DETAILS (材质与服饰细节)',
      value: prompt3,
      setValue: setPrompt3,
      isNeg: false,
      rows: 3.5
    },
    {
      id: 3,
      num: '04',
      title: 'NEGATIVE CONSTRAINTS (负面提示词过滤)',
      value: prompt4,
      setValue: setPrompt4,
      isNeg: true,
      rows: 3.5
    }
  ];

  const activeWorkflow = COMFY_WORKFLOWS[comfyIdx];

  const versionImages = [
    '/2_Technical Presentation/3_3D Models/step_1_sketch.jpg', // V1: Sketch
    '/2_Technical Presentation/3_3D Models/step_2_inspiration.png', // V2: Inspiration
    '/2_Technical Presentation/3_3D Models/step_3_optimization.png', // V3: Optimization
    '/2_Technical Presentation/3_3D Models/step_4_outcome.mp4'    // V4: Outcome
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 relative">

        {/* GRID STRUCTURE */}
        <div className="flex flex-col gap-16">

          {/* ============================================================ */}
          {/* SECTION 1: ComfyUI Node Workflow (ComfyUI 工作流) */}
          {/* ============================================================ */}
          <div ref={workflowSectionRef} className="bg-[#024C38] text-[#F6F3EB] retro-border-lg p-6 sm:p-8 retro-shadow-green-lg scroll-mt-24">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-dashed border-[#F1C5C1]/30 pb-4 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F3D03B] retro-border-sm flex items-center justify-center text-[#024C38]">
                  <Cpu className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#F1C5C1] font-black uppercase tracking-widest block">PIPELINE NODE ENGINEER</span>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-[#F3D03B]">
                    ComfyUI工作流搭建
                  </h3>
                </div>
              </div>

              {/* Slider selector arrows */}
              <div className="flex items-center gap-3 bg-[#112a20] p-1.5 retro-border-sm">
                <button 
                  onClick={() => handleSelectWorkflow(p => (p === 0 ? COMFY_WORKFLOWS.length - 1 : p - 1))}
                  className="px-4 py-2 bg-[#CE0F51] hover:bg-[#a10e40] text-white font-mono text-xs font-black retro-border-sm rounded-none cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#F3D03B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                  title="Previous Workflow"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[3px]" />
                  <span className="hidden sm:inline">PREV</span>
                </button>

                <div className="px-3 py-1 bg-black/40 font-mono text-sm text-[#F3D03B] font-black retro-border-sm min-w-[70px] text-center tracking-widest">
                  {comfyIdx + 1} / {COMFY_WORKFLOWS.length}
                </div>

                <button 
                  onClick={() => handleSelectWorkflow(p => (p === COMFY_WORKFLOWS.length - 1 ? 0 : p + 1))}
                  className="px-4 py-2 bg-[#F3D03B] hover:bg-[#dfbd21] text-[#024C38] font-mono text-xs font-black retro-border-sm rounded-none cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#CE0F51] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                  title="Next Workflow"
                >
                  <span className="hidden sm:inline">NEXT</span>
                  <ChevronRight className="w-4 h-4 stroke-[3px]" />
                </button>
              </div>
            </div>

            {/* Workflow main content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Larger Comfy Node Rendering Display with 3X Retro Magnifier */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div 
                  ref={wfImgRef}
                  onMouseMove={handleWfMouseMove}
                  onMouseLeave={handleWfMouseLeave}
                  className="w-full aspect-[16/10] bg-black retro-border overflow-hidden relative group cursor-crosshair select-none"
                >
                  {activeWorkflow.type === 'video' && activeWorkflow.videoUrl ? (
                    <video 
                      key={activeWorkflow.id}
                      src={activeWorkflow.videoUrl} 
                      autoPlay 
                      loop 
                      muted 
                      controlsList="nodownload noplaybackrate"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <img
                      src={activeWorkflow.imageUrl}
                      alt={activeWorkflow.title}
                      className="w-full h-full object-cover filter brightness-95 pointer-events-none"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {/* Watermark Protection */}
                  <WatermarkOverlay variant="light" />

                  {/* Node count label */}
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 bg-[#CE0F51] text-white font-mono text-[9px] font-black retro-border-sm z-10">
                    NODES: {activeWorkflow.nodesCount} CONNECTIONS
                  </div>

                  {/* Retro Lens Hint Badge */}
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/80 text-[#F3D03B] font-mono text-[10px] font-bold retro-border-sm border border-[#F3D03B]/40 z-10 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#CE0F51] animate-ping" />
                    <span>[ 🔍 悬浮鼠标体验 3X 细节放大镜 ]</span>
                  </div>

                  {/* Interactive 3X Retro Square Loupe Magnifier Lens */}
                  {magnifier.show && (
                    <div 
                      className="absolute w-48 h-48 sm:w-60 sm:h-60 border-3 border-[#CE0F51] bg-black overflow-hidden pointer-events-none z-30 shadow-[6px_6px_0px_0px_#F3D03B] retro-border-sm"
                      style={{
                        top: `${magnifier.y}px`,
                        left: `${magnifier.x}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {activeWorkflow.type === 'video' && activeWorkflow.videoUrl ? (
                        <video 
                          src={activeWorkflow.videoUrl} 
                          autoPlay 
                          loop 
                          muted 
                          className="absolute max-w-none w-full h-full object-cover"
                          style={{
                            width: `${wfImgRef.current?.clientWidth}px`,
                            height: `${wfImgRef.current?.clientHeight}px`,
                            transform: 'scale(3)',
                            transformOrigin: `${magnifier.xPct}% ${magnifier.yPct}%`,
                          }}
                        />
                      ) : (
                        <img
                          src={activeWorkflow.imageUrl}
                          alt={activeWorkflow.title}
                          className="absolute max-w-none w-full h-full object-cover"
                          style={{
                            width: `${wfImgRef.current?.clientWidth}px`,
                            height: `${wfImgRef.current?.clientHeight}px`,
                            transform: 'scale(3)',
                            transformOrigin: `${magnifier.xPct}% ${magnifier.yPct}%`,
                          }}
                        />
                      )}

                      {/* Retro Crosshair Overlay */}
                      <div className="absolute inset-0 border border-[#F3D03B]/30 pointer-events-none flex items-center justify-center">
                        <div className="w-full h-[1px] bg-[#CE0F51]/60" />
                        <div className="h-full w-[1px] bg-[#CE0F51]/60 absolute" />
                      </div>

                      {/* Retro Magnifier Badge */}
                      <div className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-[#CE0F51] text-white font-mono text-[9px] font-black border border-white/20 retro-shadow-green-sm">
                        3X LENS
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-[#024C38] text-[#F3D03B] font-mono text-[9px] font-black border border-[#F3D03B]/40">
                        INSPECT // {Math.round(magnifier.xPct)}%, {Math.round(magnifier.yPct)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Specifications, Tech Stack & Core Logic Pipeline */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                <div className="bg-[#F6F3EB]/10 p-5 retro-border-sm flex flex-col gap-4 border border-white/10">
                  {/* Code Name & Type Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
                    <span className="px-2.5 py-0.5 bg-[#F3D03B] text-[#024C38] font-mono text-[11px] font-black retro-border-sm">
                      {activeWorkflow.codeName || activeWorkflow.id.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#CE0F51] text-white font-mono text-[10px] font-bold">
                      {activeWorkflow.type.toUpperCase()} WORKFLOW
                    </span>
                  </div>
                  
                  {/* Workflow Title */}
                  <h4 className="font-display font-black text-xl text-[#F3D03B] leading-tight">
                    {activeWorkflow.title}
                  </h4>

                  {/* Core Logic Pipeline Sequence (Moved to Right Column) */}
                  {activeWorkflow.coreLogic && (
                    <div className="bg-black/30 p-3.5 retro-border-sm flex flex-col gap-2.5 border border-white/10">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-[#F3D03B]" />
                        <span className="font-mono text-[10px] text-[#F3D03B] font-black uppercase tracking-wider">
                          CORE LOGIC PIPELINE // 核心逻辑流程
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                        {activeWorkflow.coreLogic.split(' → ').map((step, sIdx) => (
                          <React.Fragment key={sIdx}>
                            <span className="px-2 py-0.5 bg-[#F6F3EB]/10 text-white font-medium retro-border-sm border border-white/15">
                              {step}
                            </span>
                            {sIdx < activeWorkflow.coreLogic!.split(' → ').length - 1 && (
                              <span className="text-[#CE0F51] font-black text-xs">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Design Notes */}
                  <div className="flex flex-col gap-1.5 text-xs text-gray-100 leading-relaxed font-sans">
                    <span className="font-mono text-[10px] text-[#F1C5C1] font-black uppercase tracking-wider">
                      DESIGN SPECIFICATION // 设计说明
                    </span>
                    <p className="bg-black/25 p-3.5 retro-border-sm text-gray-200 border border-white/10 font-normal leading-relaxed">
                      {activeWorkflow.designNotes || activeWorkflow.description}
                    </p>
                  </div>

                  {/* Technical Stack Grid */}
                  {activeWorkflow.techStack && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                      <span className="font-mono text-[10px] text-[#F3D03B] font-black uppercase tracking-wider">
                        TECHNICAL STACK // 技术栈配置
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                        {activeWorkflow.techStack.baseModel && (
                          <div className="bg-white/5 p-2.5 retro-border-sm border border-white/10 flex flex-col gap-1">
                            <span className="text-[9px] text-[#F1C5C1] font-bold uppercase">基座模型 BASE MODEL</span>
                            <span className="text-white font-semibold leading-snug">{activeWorkflow.techStack.baseModel}</span>
                          </div>
                        )}
                        {activeWorkflow.techStack.loras && (
                          <div className="bg-white/5 p-2.5 retro-border-sm border border-white/10 flex flex-col gap-1">
                            <span className="text-[9px] text-[#F1C5C1] font-bold uppercase">LoRA 组合 LORA COMBO</span>
                            <span className="text-white font-semibold leading-snug">{activeWorkflow.techStack.loras}</span>
                          </div>
                        )}
                        {activeWorkflow.techStack.controls && (
                          <div className="bg-white/5 p-2.5 retro-border-sm border border-white/10 flex flex-col gap-1">
                            <span className="text-[9px] text-[#F1C5C1] font-bold uppercase">核心/精准控制 CONTROL</span>
                            <span className="text-white font-semibold leading-snug">{activeWorkflow.techStack.controls}</span>
                          </div>
                        )}
                        {activeWorkflow.techStack.sampling && (
                          <div className="bg-white/5 p-2.5 retro-border-sm border border-white/10 flex flex-col gap-1">
                            <span className="text-[9px] text-[#F1C5C1] font-bold uppercase">采样策略 SAMPLING</span>
                            <span className="text-white font-semibold leading-snug">{activeWorkflow.techStack.sampling}</span>
                          </div>
                        )}
                        {activeWorkflow.techStack.imageProcessing && (
                          <div className="bg-white/5 p-2.5 retro-border-sm border border-white/10 flex flex-col gap-1">
                            <span className="text-[9px] text-[#F1C5C1] font-bold uppercase">图像/遮罩处理 PROCESSING</span>
                            <span className="text-white font-semibold leading-snug">{activeWorkflow.techStack.imageProcessing}</span>
                          </div>
                        )}
                        {activeWorkflow.techStack.postProcessing && (
                          <div className="bg-white/5 p-2.5 retro-border-sm border border-white/10 flex flex-col gap-1">
                            <span className="text-[9px] text-[#F1C5C1] font-bold uppercase">后处理 POST-PROCESS</span>
                            <span className="text-white font-semibold leading-snug">{activeWorkflow.techStack.postProcessing}</span>
                          </div>
                        )}
                        {activeWorkflow.techStack.flow && (
                          <div className="bg-white/5 p-2.5 retro-border-sm border border-white/10 flex flex-col gap-1">
                            <span className="text-[9px] text-[#F1C5C1] font-bold uppercase">流程控制 FLOW</span>
                            <span className="text-white font-semibold leading-snug">{activeWorkflow.techStack.flow}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Quick preset selector channels at the bottom of SECTION 1 */}
            <div className="mt-8 pt-6 border-t border-dashed border-[#F1C5C1]/20 flex flex-col gap-3">
              <span className="font-mono text-[10px] text-[#F1C5C1] font-black uppercase tracking-wider">
                // WORKFLOW CHANNELS SELECTOR (点击切换 7 大工作流预设):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {COMFY_WORKFLOWS.map((wf, idx) => (
                  <button
                    key={wf.id}
                    onClick={() => handleSelectWorkflow(idx)}
                    className={`p-2.5 font-mono text-[10px] font-black retro-border-sm transition-all cursor-pointer flex flex-col gap-1 text-left ${
                      comfyIdx === idx
                        ? 'bg-[#CE0F51] text-white shadow-[3px_3px_0px_0px_#F3D03B] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-black/30 hover:bg-black/50 text-[#F1C5C1] hover:text-[#F3D03B] border border-white/10'
                    }`}
                  >
                    <span className="text-[8px] opacity-75">CH 0{idx + 1}</span>
                    <span className="truncate font-bold text-[11px]">{wf.codeName || wf.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 2: LoRA Model Fine-Tuning (LoRA模型微调训练) */}
          {/* ============================================================ */}
          <div className="bg-white retro-border-lg p-6 sm:p-8 retro-shadow-green-lg flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-dashed border-[#024C38]/20 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-[#CE0F51] text-white flex items-center justify-center font-block text-sm retro-border-sm">
                  R
                </span>
                <div>
                  <span className="font-mono text-[9px] text-[#CE0F51] font-black uppercase block tracking-widest">LORA-RAD CHARACTER TUNING</span>
                  <h3 className="font-display font-black text-xl text-[#024C38] uppercase">
                    LoRA模型微调训练
                  </h3>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 bg-[#F6F3EB] px-3 py-1.5 retro-border-sm self-start sm:self-auto">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                <span className="font-mono text-[9px] text-[#024C38] font-black tracking-wider uppercase">
                  ● CHARACTER_MODEL: RAD_V1.5 // ACTIVE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* LEFT Column: Interactive Training Config & Philosophy Textarea */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* 1. Fine-tuning Hyperparameters */}
                <div className="bg-[#F6F3EB] p-5 retro-border retro-shadow-green flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-[#024C38]/10 pb-2">
                    <Sliders className="w-4 h-4 text-[#CE0F51]" />
                    <span className="font-mono text-xs text-[#CE0F51] font-black tracking-wider block uppercase">
                      LORA HYPERPARAMETERS // 微调参数设置
                    </span>
                  </div>

                  {/* Param 1: Learning Rate */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-[#024C38]">
                      <span className="font-mono">Learning Rate (学习率)</span>
                      <span className="font-mono bg-[#024C38] text-white px-2 py-0.5 text-[10px] retro-border-sm">
                        {learningRate.toFixed(5)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.00001"
                      max="0.001"
                      step="0.00005"
                      value={learningRate}
                      onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                      className="w-full accent-[#CE0F51] cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-gray-500 font-mono">
                      <span>Min: 1e-5</span>
                      <span>Max: 1e-3</span>
                    </div>
                  </div>

                  {/* Param 2: Training Epochs */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-[#024C38]">
                      <span className="font-mono">Max Epochs (训练轮数)</span>
                      <span className="font-mono bg-[#024C38] text-white px-2 py-0.5 text-[10px] retro-border-sm">
                        {epochs} EPOCHS
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="30"
                      step="2"
                      value={epochs}
                      onChange={(e) => setEpochs(parseInt(e.target.value))}
                      className="w-full accent-[#CE0F51] cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-gray-500 font-mono">
                      <span>Min: 2 E</span>
                      <span>Max: 30 E</span>
                    </div>
                  </div>

                  {/* Grid Split: Batch Size + Network Dim */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] font-black text-[#024C38] uppercase tracking-wider">// Batch Size</label>
                      <select 
                        value={batchSize} 
                        onChange={(e) => setBatchSize(parseInt(e.target.value))}
                        className="bg-white text-[#024C38] p-2 text-xs font-mono font-bold retro-border-sm"
                      >
                        <option value={1}>1 (Aggressive)</option>
                        <option value={2}>2 (Optimal)</option>
                        <option value={4}>4 (Smooth)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] font-black text-[#024C38] uppercase tracking-wider">// Network Dim (Rank)</label>
                      <select 
                        value={networkDim} 
                        onChange={(e) => setNetworkDim(parseInt(e.target.value))}
                        className="bg-white text-[#024C38] p-2 text-xs font-mono font-bold retro-border-sm"
                      >
                        <option value={16}>16 (Low VRAM)</option>
                        <option value={32}>32 (Medium)</option>
                        <option value={64}>64 (Detailed)</option>
                        <option value={128}>128 (Expressive)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Philosophy recording text box */}
                <div 
                  ref={philosophyRef}
                  className="bg-white p-5 retro-border-lg retro-shadow-green flex-grow flex flex-col gap-4 border-2 border-[#CE0F51]"
                >
                  <div className="flex justify-between items-center border-b-2 border-dashed border-[#CE0F51]/30 pb-2">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#CE0F51]" />
                      <span className="font-mono text-xs text-[#CE0F51] font-black tracking-wider block uppercase">
                        RAD PHILOSOPHY CONCEPT // 原创角色微调理念
                      </span>
                    </div>
                    <button
                      onClick={startTypewriter}
                      title="Replay Typewriter Effect"
                      className="px-2.5 py-1 bg-[#CE0F51] hover:bg-[#a10e40] text-white font-mono text-[9px] font-bold retro-border-sm cursor-pointer shadow-[1px_1px_0px_0px_#024C38] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1"
                    >
                      <RefreshCw className={`w-2.5 h-2.5 ${isTyping ? 'animate-spin' : ''}`} />
                      <span>REPLAY</span>
                    </button>
                  </div>

                  {/* Main text container with larger font, premium styling, using bold red colors */}
                  <div className="relative bg-[#FAF4EB] p-4 retro-border-sm flex-grow flex flex-col min-h-[320px] justify-between">
                    {/* Top corner decorative bracket */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#CE0F51]" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#CE0F51]" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#CE0F51]" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#CE0F51]" />

                    <div className="font-sans text-sm sm:text-base text-[#024C38] leading-relaxed font-bold whitespace-pre-wrap select-text">
                      {typedText}
                      {isTyping && (
                        <span className="inline-block w-2.5 h-4 bg-[#CE0F51] ml-1 animate-pulse" style={{ verticalAlign: 'middle' }} />
                      )}
                    </div>

                    <div className="mt-4 pt-2 border-t border-dashed border-[#024C38]/10 flex justify-between items-center text-[9px] font-mono text-gray-500">
                      <span className="text-[#CE0F51] font-bold">● DECODING STREAM STATUS</span>
                      <span>{typedText.length} / {RAD_INTRO_TEXT.length} CHARS</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT Column: Gorgeous Multi-Image Carousel showcasing RAD generated images */}
              <div className="lg:col-span-7 bg-[#FAF4EB] p-3 sm:p-5 retro-border retro-shadow-green flex flex-col justify-between gap-3 sm:gap-5">
                
                {/* Carousel Header */}
                <div className="flex justify-between items-center border-b border-[#024C38]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#024C38] font-black uppercase tracking-wider">
                      // RAD INFERENCE GENERATIONS (微调效果画廊)
                    </span>
                    <button
                      onClick={() => setIsRadAutoPlay(prev => !prev)}
                      className={`px-2 py-0.5 font-mono text-[9px] font-black retro-border-sm flex items-center gap-1 transition-all cursor-pointer ${
                        isRadAutoPlay 
                          ? 'bg-[#024C38] text-[#F3D03B]' 
                          : 'bg-[#F6F3EB] text-[#024C38] border border-[#024C38]/30'
                      }`}
                      title={isRadAutoPlay ? "点击暂停 2S 自动翻页" : "点击开启 2S 自动翻页"}
                    >
                      {isRadAutoPlay ? (
                        <>
                          <Pause className="w-2.5 h-2.5 text-[#CE0F51] fill-[#CE0F51]" />
                          <span>AUTO 2S</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-2.5 h-2.5 text-[#024C38] fill-[#024C38]" />
                          <span>PAUSED</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {RAD_IMAGES.map((_, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setRadIdx(idx)}
                        className={`w-2.5 h-2.5 retro-border-sm transition-all cursor-pointer ${
                          radIdx === idx ? 'bg-[#CE0F51] scale-125' : 'bg-[#024C38]/30 hover:bg-[#024C38]'
                        }`} 
                        title={`Go to Pose 0${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Main Image Viewport */}
                <div 
                  className="w-full bg-[#024C38] retro-border relative group aspect-[4/3] sm:aspect-[16/10]"
                  onMouseEnter={() => setIsRadHovered(true)}
                  onMouseLeave={() => setIsRadHovered(false)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={radIdx}
                      initial={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <SmartImage
                        src={RAD_IMAGES[radIdx].imgUrl}
                        alt={RAD_IMAGES[radIdx].title}
                        className={'w-full h-full transition-transform duration-700 group-hover:scale-105 ' + (RAD_IMAGES[radIdx].imgUrl.endsWith('.gif') ? 'object-contain' : 'object-cover')}
                        containerClassName="h-full"
                        targetWidth={RAD_IMAGES[radIdx].imgUrl.endsWith('.gif') ? undefined : 900}
                        targetHeight={RAD_IMAGES[radIdx].imgUrl.endsWith('.gif') ? undefined : 600}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* 2-Second Progress Countdown Line */}
                  {isRadAutoPlay && !isRadHovered && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-[#024C38]/40 z-20 pointer-events-none overflow-hidden">
                      <motion.div
                        key={radIdx}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: 'linear' }}
                        className="h-full bg-[#CE0F51]"
                      />
                    </div>
                  )}

                  {/* Grid Lines HUD Overlay */}
                  <div className="absolute inset-0 bg-radial-blueprint pointer-events-none opacity-[0.08] z-10" />

                  {/* Corner Crosshairs Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-10">
                    <div className="w-[90%] h-[1px] bg-[#024C38] border-t border-dashed border-[#024C38]" />
                    <div className="h-[90%] w-[1px] bg-[#024C38] border-l border-dashed border-[#024C38] absolute" />
                  </div>

                  {/* Viewport Floating Info */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#024C38]/95 text-white font-mono text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 retro-border-sm z-10">
                    RENDER TYPE: LORA_INFERENCE
                  </div>

                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#CE0F51]/95 text-white font-mono text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 retro-border-sm z-10">
                    WEIGHT: 0.85
                  </div>

                  <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-[#F3D03B]/95 text-[#024C38] font-mono text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 retro-border-sm z-10">
                    POSE 0{radIdx + 1} // {RAD_IMAGES[radIdx].zhTitle}
                  </div>

                  {/* Prominent Overlay Navigation Controls */}
                  <div className="absolute inset-x-2 sm:inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
                    <button
                      onClick={() => setRadIdx(p => (p === 0 ? RAD_IMAGES.length - 1 : p - 1))}
                      className="p-1.5 sm:p-3 bg-[#CE0F51] hover:bg-[#a10e40] text-white retro-border pointer-events-auto cursor-pointer shadow-[1.5px_1.5px_0px_0px_#024C38] sm:shadow-[3px_3px_0px_0px_#024C38] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none transition-all"
                      title="Previous RAD Pose"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5px] sm:stroke-[3px]" />
                    </button>

                    <button
                      onClick={() => setRadIdx(p => (p === RAD_IMAGES.length - 1 ? 0 : p + 1))}
                      className="p-1.5 sm:p-3 bg-[#F3D03B] hover:bg-[#dfbd21] text-[#024C38] retro-border pointer-events-auto cursor-pointer shadow-[1.5px_1.5px_0px_0px_#CE0F51] sm:shadow-[3px_3px_0px_0px_#CE0F51] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none transition-all"
                      title="Next RAD Pose"
                    >
                      <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5px] sm:stroke-[3px]" />
                    </button>
                  </div>
                </div>

                {/* Direct Presets Channel Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dashed border-[#024C38]/10">
                  <span className="font-mono text-[9px] text-[#024C38] font-black uppercase tracking-wider mr-2">
                    // JUMP TO POSE (姿态直达通道):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {RAD_IMAGES.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setRadIdx(idx)}
                        className={`px-3 py-1 font-mono text-[10px] font-black retro-border-sm transition-all cursor-pointer ${
                          radIdx === idx
                            ? 'bg-[#CE0F51] text-white shadow-[2px_2px_0px_0px_#F3D03B] translate-y-[-1px]'
                            : 'bg-[#F6F3EB] hover:bg-[#F3D03B] text-[#024C38]'
                        }`}
                      >
                        POSE 0{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 3: 3D Generation Pipeline (3D模型生成流程) */}
          {/* ============================================================ */}
          <div className="bg-[#F1C5C1] retro-border-lg p-6 sm:p-8 retro-shadow-green-lg flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b-2 border-dashed border-[#024C38]/20 pb-4">
              <span className="w-8 h-8 bg-[#F3D03B] text-[#024C38] flex items-center justify-center font-block text-sm retro-border-sm">
                3D
              </span>
              <div>
                <span className="font-mono text-[9px] text-[#CE0F51] font-black uppercase block tracking-widest">3D MODEL WORKFLOW & PROMPT TUNING</span>
                <h3 className="font-display font-black text-xl text-[#024C38] uppercase">
                  3D模型工作流及prompt调试
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              
              {/* Left Column: 3 Core Prompt Text Boxes (左侧提示词框) with Cascading Accordion & Compact Process Chain */}
              <div className="bg-white p-5 retro-border-lg retro-shadow-green flex flex-col justify-between h-full gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-[#024C38]/10 pb-2">
                    <span className="font-mono text-xs text-[#024C38] font-black tracking-wider block uppercase">
                      PROMPT COMPOSE LAB // 三维核心提示词矩阵
                    </span>
                    <span className="font-mono text-[9px] text-[#CE0F51] font-black bg-[#F3D03B] px-1.5 py-0.5 retro-border-sm uppercase">
                      Interactive
                    </span>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {promptBoxes.map((box) => (
                      <motion.div
                        key={box.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.4, delay: box.id * 0.12, ease: 'easeOut' }}
                        className={`flex flex-col bg-white retro-border-sm retro-shadow-green-sm overflow-hidden transition-all duration-200 ${
                          box.isNeg ? 'border border-[#CE0F51]/30' : ''
                        }`}
                      >
                        <button 
                          onClick={() => toggle3DPrompt(box.id)}
                          className="w-full text-left p-3 flex justify-between items-center bg-[#F6F3EB] hover:bg-[#FAF4EB] cursor-pointer transition-colors border-b border-[#024C38]/10"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 font-mono text-[10px] font-black flex items-center justify-center retro-border-sm ${
                              open3DPrompts[box.id] ? 'bg-[#CE0F51] text-white' : 'bg-[#024C38] text-white'
                            }`}>{box.num}</span>
                            <span className={`font-mono text-[10px] font-black tracking-wider ${
                              box.isNeg ? 'text-[#CE0F51]' : 'text-[#024C38]'
                            }`}>
                              {box.title}
                            </span>
                          </div>
                          {open3DPrompts[box.id] ? (
                            <ChevronUp className="w-4 h-4 text-[#CE0F51] stroke-[3px]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#024C38] stroke-[3px]" />
                          )}
                        </button>
                        <AnimatePresence initial={false}>
                          {open3DPrompts[box.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              whileInView={{ height: 'auto', opacity: 1 }}
                              viewport={{ once: true }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.45, delay: box.id * 0.15 + 0.08, ease: 'easeInOut' }}
                              className="overflow-hidden bg-[#FAF4EB]/30"
                            >
                              <div className="p-3 border-t border-[#024C38]/5">
                                <textarea
                                  rows={box.rows}
                                  value={box.value}
                                  onChange={(e) => box.setValue(e.target.value)}
                                  className={`w-full bg-[#FAF4EB] text-xs font-mono font-bold p-2.5 retro-border-sm focus:outline-none focus:bg-white resize-none leading-relaxed ${
                                    box.isNeg ? 'text-[#CE0F51] border border-[#CE0F51]/20' : 'text-[#024C38]'
                                  }`}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right Bottom moved here: Compact 3D Generation Flow (闭环链条流程) */}
                <div className="bg-[#FAF4EB] p-3.5 retro-border-sm flex flex-col gap-2.5">
                  <span className="font-mono text-[9px] text-[#CE0F51] font-black uppercase tracking-wider block border-b border-[#024C38]/10 pb-1">
                    // 3D GENERATION FLOW (闭环链条流程)
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { step: '01', title: '概念构思' },
                      { step: '02', title: '提示设计' },
                      { step: '03', title: '批量生成' },
                      { step: '04', title: '迭代转绘' },
                      { step: '05', title: '后期处理' }
                    ].map((stepItem, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white retro-border-sm py-1.5 px-0.5 flex flex-col items-center justify-center gap-1 hover:bg-[#F3D03B] transition-colors group cursor-default"
                      >
                        <span className="w-4 h-4 rounded-none bg-[#024C38] text-[#F3D03B] font-mono text-[8px] font-black flex items-center justify-center group-hover:bg-[#CE0F51] group-hover:text-white transition-colors">
                          {stepItem.step}
                        </span>
                        <span className="font-sans text-[9px] font-black text-[#024C38] tracking-tight text-center truncate w-full">
                          {stepItem.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: 4-Version Iteration Images in a stunning, clean 2x2 grid */}
              <div className="bg-white p-5 retro-border-lg retro-shadow-green flex flex-col justify-between h-full gap-4">
                <div className="flex flex-col gap-4 h-full justify-between">
                  <div className="flex justify-between items-center border-b border-[#024C38]/10 pb-2">
                    <span className="font-mono text-xs text-[#024C38] font-black uppercase block tracking-wider">
                      ITERATIVE MESH VERSIONS // 4个生成版本迭代图
                    </span>
                    <span className="font-mono text-[8px] text-white bg-[#CE0F51] px-1.5 py-0.5 retro-border-sm font-bold">
                      2X2 HIGH-RES MATRIX
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 flex-grow">
                    {versionImages.map((img, idx) => (
                      <div 
                        key={idx}
                        className="aspect-square retro-border-lg overflow-hidden relative group transition-all duration-300 opacity-90 hover:opacity-100 hover:scale-[1.01]"
                      >
                        {idx === 3 ? (
                          <video
                            src={img}
                            autoPlay
                            muted
                            loop
                            playsInline
                            controlsList="nodownload noplaybackrate"
                            disablePictureInPicture
                            onContextMenu={(e) => e.preventDefault()}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                        ) : (
                          <img 
                            src={img} 
                            alt={`Version ${idx + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="absolute top-2 left-2 bg-[#024C38]/90 font-mono text-[8px] font-black text-[#F3D03B] px-1.5 py-0.5 retro-border-sm">
                          MESH_V{idx + 1}.0
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          

        </div>

      {/* ------------------- COMFYUI BLUEPRINT MODAL ------------------- */}
      {isWfModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#024C38]/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsWfModalOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-[#CE0F51] text-white retro-border rounded-none flex items-center justify-center retro-shadow-green cursor-pointer z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full max-w-4xl bg-[#F6F3EB] retro-border-lg p-5 retro-shadow-green-lg flex flex-col gap-4 relative">
            <div className="flex justify-between items-center pb-2 border-b border-[#024C38]/20">
              <span className="px-2 py-0.5 bg-[#F3D03B] text-[#024C38] font-mono text-[9px] font-bold retro-border-sm">
                HIGH RES WORKFLOW BLUEPRINT // 拓扑结构详图
              </span>
              <span className="font-mono text-xs text-[#024C38] font-bold">WORKFLOW ID: {activeWorkflow.id}</span>
            </div>

            <div className="w-full aspect-[16/10] bg-white retro-border overflow-hidden flex items-center justify-center p-2 relative">
              <img
                src={activeWorkflow.imageUrl}
                alt={activeWorkflow.title}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#024C38] text-white font-mono text-[8px]">
                ZOOM_RATIO: 100% RAW LAYER
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-[11px] text-[#024C38] font-sans font-semibold leading-snug max-w-xl">
                {activeWorkflow.title} — 高密度的提示节点在 Latent 空间中持续反馈，经过双重降噪采样后进行高质量的重影合并。
              </p>
              <button
                onClick={() => setIsWfModalOpen(false)}
                className="px-4 py-1.5 bg-[#024C38] text-[#F6F3EB] font-mono text-xs font-bold retro-border-sm cursor-pointer"
              >
                CLOSE VIEW
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
