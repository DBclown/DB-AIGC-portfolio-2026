import React, { useRef, useEffect } from 'react';
import { ArrowDown, Sparkles, Play, Code, Cpu, Flame } from 'lucide-react';
import mascotImg from '../assets/images/kkk.png';

interface HeroProps {
  onExplore: (sectionId: string) => void;
}

export default function Hero({ onExplore }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas particle star dust animation (reactive to mouse)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = 500;
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      decay: number;

      constructor(x?: number, y?: number) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.size = Math.random() * 4 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.alpha = Math.random() * 0.5 + 0.5;
        this.decay = Math.random() * 0.015 + 0.005;

        // Custom retro palette colors
        const colors = ['#F3D03B', '#CE0F51', '#024C38', '#F1C5C1', '#F6F3EB'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(mx?: number, my?: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse attraction
        if (mx && my) {
          const dx = mx - this.x;
          const dy = my - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            this.x += dx * 0.02;
            this.y += dy * 0.02;
          }
        }

        // Wrap boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        this.alpha -= this.decay;
        if (this.alpha <= 0) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.alpha = Math.random() * 0.5 + 0.5;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw elegant star shapes occasionally
        if (this.size > 3.5) {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(this.x - this.size * 2, this.y);
          ctx.lineTo(this.x + this.size * 2, this.y);
          ctx.moveTo(this.x, this.y - this.size * 2);
          ctx.lineTo(this.x, this.y + this.size * 2);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    const particlesArray: Particle[] = [];
    const numberOfParticles = Math.min(width / 8, 120);
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }

    let mouse = { x: undefined as number | undefined, y: undefined as number | undefined };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = undefined;
      mouse.y = undefined;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.fillStyle = 'rgba(246, 243, 235, 0.15)'; // Trail effect
      ctx.fillRect(0, 0, width, height);

      // Grid background overlay
      ctx.strokeStyle = 'rgba(2, 76, 56, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      particlesArray.forEach((p) => {
        p.update(mouse.x, mouse.y);
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    // 仅在 Hero 可见时运行动画，滚出视口立即停止，释放 GPU 给视频解码
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
        } else {
          cancelAnimationFrame(animationId);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen pt-16 sm:pt-20 flex flex-col justify-between overflow-hidden bg-grid-pattern">
      {/* Dynamic Star Dust Interactive Canvas container */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-70">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 pt-2 pb-8 flex-grow flex flex-col justify-center gap-6 2xl:gap-10">
        
        {/* Left-Right Split Banner exactly mimicking image logic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center mt-2">
          
          {/* LEFT: Branding Title, Vision & Tags */}
          <div className="lg:col-span-8 flex flex-col justify-center gap-7 z-10 overflow-visible relative">
            
            {/* Retro label tag */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-3 py-1 bg-[#F3D03B] text-[#024C38] font-mono text-xs font-black border-2 border-[#024C38] shadow-[2px_2px_0px_0px_#024C38] uppercase">
                CREATIVE EXPERIMENT V1.0
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs font-black text-[#CE0F51] uppercase">
                <Flame className="w-4 h-4 text-[#CE0F51]" /> 10+ YEARS EXPERIENCE
              </span>
            </div>

            {/* Blocky Display Heading exactly inspired by "CHEESE" */}
            <h1 className="font-block text-4xl sm:text-5xl md:text-[4.5rem] lg:text-[5rem] xl:text-[6rem] 2xl:text-[7.5rem] 3xl:text-[9rem] leading-[0.85] tracking-tighter text-[#024C38] uppercase select-none relative">
               PORTFOLIOS
              <br />
              <span className="text-[#CE0F51] text-stroke-thick text-fill-[#CE0F51] drop-shadow-[4px_4px_0px_#024C38] lg:drop-shadow-[6px_6px_0px_#024C38] block mt-2 hover:scale-[1.01] transition-all duration-200">
                BY-LIHAO⭐
              </span>
            </h1>

            {/* English Tagline / quote */}
            <div className="p-5 lg:p-6 bg-[#F1C5C1] border-3 border-[#024C38] shadow-[4px_4px_0px_0px_#024C38] max-w-3xl">
              <p className="font-display font-black text-xs sm:text-sm uppercase text-[#024C38] leading-relaxed tracking-wider">
                "CRAFTING VISUAL SYNTHESIS: RECONSTRUCTING THE BOUNDARIES OF IMAGINATION. BRIDGING ADVANCED AI WORKFLOWS WITH DECADE-LONG FRONTEND DESIGN MATURITY."
              </p>
              <p className="font-mono text-xs text-[#CE0F51] mt-3 font-black text-right uppercase">
                — AIGC DESIGN STATEMENT 2026
              </p>
            </div>

            {/* Design features badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-4 py-2 bg-transparent border-2 border-[#024C38] text-[#024C38] text-xs font-mono font-black uppercase flex items-center gap-1.5 hover:bg-[#F3D03B] transition-colors cursor-default select-none">
                &lt;&gt; Functional UI
              </span>
              <span className="px-4 py-2 bg-transparent border-2 border-[#024C38] text-[#024C38] text-xs font-mono font-black uppercase flex items-center gap-1.5 hover:bg-[#F3D03B] transition-colors cursor-default select-none">
                <Cpu className="w-4 h-4 text-[#024C38]" /> Node Architecture
              </span>
              <span className="px-4 py-2 bg-transparent border-2 border-[#024C38] text-[#024C38] text-xs font-mono font-black uppercase flex items-center gap-1.5 hover:bg-[#F3D03B] transition-colors cursor-default select-none">
                <Sparkles className="w-4 h-4 text-[#024C38]" /> High Aesthetics
              </span>
            </div>
          </div>

          {/* RIGHT: Visual Mockup mirroring the image's layout split */}
          <div className="lg:col-span-4 w-full flex flex-col justify-center z-20 relative">
            <div className="bg-[#024C38] border-4 border-[#024C38] pt-5 pb-5 pr-5 pl-5 lg:pl-[24px] lg:ml-2 xl:ml-8 mr-0 shadow-[8px_8px_0px_0px_#024C38] text-[#F6F3EB] flex flex-col gap-5 relative">
              
              {/* Title inside green pouch container */}
              <div className="border-b-2 border-dashed border-[#F1C5C1]/30 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F3D03B] text-[#024C38] border-2 border-[#024C38] flex items-center justify-center font-block text-sm">
                    AI
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base text-[#F6F3EB] tracking-wide uppercase">
                      Nice to meet you
                    </h3>
                    <p className="text-[10px] text-gray-300 font-mono">MODEL: FLUX.1 + MIDJOURNEY V6</p>
                  </div>
                </div>
                <span className="text-[#F3D03B] text-xl font-bold animate-pulse">✦</span>
              </div>
 
              {/* Generated Mascot Frame - Tall Aspect Ratio with max-height controls */}
              <div className="w-full aspect-[4/5] sm:aspect-[3/4] max-h-[360px] sm:max-h-[460px] lg:max-h-[380px] xl:max-h-[480px] border-2 border-[#024C38] bg-[#F6F3EB] flex items-center justify-center overflow-hidden relative group">
                {/* Real generated mascot image */}
                <img
                  src={mascotImg}
                  alt="AIGC Generated Retro Mascot"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#F3D03B] text-[#024C38] font-mono text-[9px] font-black border-2 border-[#024C38]">
                  DEFAULT MASCOT
                </div>
              </div>

              {/* Footer info in pouch layout */}
              <div className="flex justify-between items-center text-[10px] font-mono pt-1 text-gray-300">
                <span>QUALITY: 100% RAW</span>
                <span className="text-[#F3D03B] font-black uppercase">AESTHETICS OVERRIDE</span>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll action button */}
        <div className="flex justify-center pt-8 pb-4">
          <button
            onClick={() => onExplore('profile')}
            className="w-14 h-14 bg-[#F3D03B] hover:bg-[#e0be22] text-[#024C38] retro-border rounded-full flex items-center justify-center retro-shadow-green cursor-pointer hover:translate-y-[-4px] transition-all duration-150 animate-bounce"
            id="hero-scroll-btn"
            title="Explore Biography & Skills"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* Infinite scrolling ticker tapes (Staggered Aesthetic) */}
      <div className="w-full relative flex flex-col pb-0 pt-4 select-none overflow-hidden -mt-2 -mb-4">
        
        {/* Strip 1 */}
        <div className="w-[110%] -ml-[5%] bg-[#024C38] border-y-[6px] border-[#024C38] py-8 sm:py-10 rotate-[2deg] z-10 relative shadow-2xl overflow-hidden">
          <div className="flex whitespace-nowrap gap-12 animate-[infinite-scroll_35s_linear_infinite] font-block text-3xl sm:text-4xl text-[#F6F3EB]">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex gap-12 items-center shrink-0">
                <span className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#F3D03B]" /> VISUAL ART PROJECTS
                </span>
                <span className="text-[#F1C5C1]">•</span>
                <span className="flex items-center gap-3">
                  <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-[#F3D03B]" /> COMFYUI NODE WORKFLOWS
                </span>
                <span className="text-[#F1C5C1]">•</span>
                <span className="flex items-center gap-3">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#F3D03B]" /> COMMERCIAL PRODUCTION
                </span>
                <span className="text-[#F1C5C1]">•</span>
                <span className="flex items-center gap-3">
                  <Code className="w-8 h-8 sm:w-10 sm:h-10 text-[#F3D03B]" /> ADVANCED FE DESIGN
                </span>
                <span className="text-[#F1C5C1]">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strip 2 */}
        <div className="w-[110%] -ml-[5%] bg-[#CE0F51] border-y-[6px] border-[#CE0F51] py-8 sm:py-10 -rotate-[1.5deg] z-20 relative -mt-4 shadow-2xl overflow-hidden">
          <div className="flex whitespace-nowrap gap-12 animate-[infinite-scroll-reverse_30s_linear_infinite] font-block text-3xl sm:text-4xl text-[#F3D03B]">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex gap-12 items-center shrink-0">
                <span className="flex items-center gap-3">
                  <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-[#F6F3EB]" /> GENERATIVE EXPERIMENTS
                </span>
                <span className="text-[#024C38] opacity-50">•</span>
                <span className="flex items-center gap-3">
                  <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-[#F6F3EB]" /> AI MODEL CLONING
                </span>
                <span className="text-[#024C38] opacity-50">•</span>
                <span className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#F6F3EB]" /> CREATIVE DIRECTION
                </span>
                <span className="text-[#024C38] opacity-50">•</span>
                <span className="flex items-center gap-3">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#F6F3EB]" /> DIGITAL INNOVATION
                </span>
                <span className="text-[#024C38] opacity-50">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strip 3 */}
        <div className="w-[110%] bg-[#F3D03B] border-y-[6px] border-[#F3D03B] py-8 sm:py-10 rotate-[1deg] z-30 relative -mt-7 shadow-2xl overflow-hidden ml-0">
          <div className="flex whitespace-nowrap gap-12 animate-[infinite-scroll_25s_linear_infinite] font-block text-3xl sm:text-4xl text-[#024C38]">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex gap-12 items-center shrink-0">
                <span className="flex items-center gap-3">
                  <Code className="w-8 h-8 sm:w-10 sm:h-10 text-[#CE0F51]" /> FULL STACK ENGINEERING
                </span>
                <span className="text-[#CE0F51] opacity-50">•</span>
                <span className="flex items-center gap-3">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#CE0F51]" /> HIGH END AESTHETICS
                </span>
                <span className="text-[#CE0F51] opacity-50">•</span>
                <span className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#CE0F51]" /> INTERACTIVE PROTOTYPES
                </span>
                <span className="text-[#CE0F51] opacity-50">•</span>
                <span className="flex items-center gap-3">
                  <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-[#CE0F51]" /> PASSION DRIVEN
                </span>
                <span className="text-[#CE0F51] opacity-50">•</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add infinite-scroll custom animation in keyframe */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes infinite-scroll-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
