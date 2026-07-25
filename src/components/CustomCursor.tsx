import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState<'default' | 'pointer' | 'text' | 'drag' | 'zoom'>('default');
  const [hoverLabel, setHoverLabel] = useState<string>('');
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Smooth mouse coordinates using springs
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 280, mass: 0.6 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  const lastParticleTime = useRef<number>(0);
  const particleId = useRef<number>(0);

  useEffect(() => {
    // Check if device is mobile/touch-only
    const checkDevice = () => {
      const mobileQuery = window.matchMedia('(pointer: coarse)');
      setIsMobile(mobileQuery.matches);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Trailing particles generation with 40ms throttling
      const now = Date.now();
      if (now - lastParticleTime.current > 40) {
        lastParticleTime.current = now;
        
        // Pick colors matching page pop art palette: Red, Green, Yellow, Cream
        const colors = ['#CE0F51', '#024C38', '#F3D03B', '#FAF4EB'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const size = Math.floor(Math.random() * 4) + 5; // 5px - 8px
        const offsetX = (Math.random() - 0.5) * 8;
        const offsetY = (Math.random() - 0.5) * 8;

        const currentId = particleId.current++;
        const newParticle: Particle = {
          id: currentId,
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
          color: randomColor,
          size,
        };

        setParticles((prev) => [...prev.slice(-12), newParticle]);

        // Auto remove after 600ms (matching the fade out transition)
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== currentId));
        }, 600);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Dynamic hover detection across the entire DOM
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find closest element with interactive tags or attributes
      const interactiveEl = target.closest('button, a, select, input, textarea, [role="button"], .cursor-pointer, [data-cursor]');
      
      if (interactiveEl) {
        const type = interactiveEl.tagName.toLowerCase();
        const cursorAttr = interactiveEl.getAttribute('data-cursor');

        if (cursorAttr) {
          setHoverState(cursorAttr as any);
          const labelAttr = interactiveEl.getAttribute('data-cursor-label');
          setHoverLabel(labelAttr || '');
        } else if (type === 'input' || type === 'textarea') {
          setHoverState('text');
          setHoverLabel('WRITE');
        } else if (interactiveEl.classList.contains('cursor-pointer') || type === 'button' || type === 'a') {
          setHoverState('pointer');
          // Set intelligent labels based on text or button intent
          const text = interactiveEl.textContent?.trim() || '';
          if (text.includes('展开') || text.includes('查看') || text.includes('COLLAPSE') || text.includes('EXPAND')) {
            setHoverLabel('TOGGLE');
          } else if (text.includes('期待合作') || text.includes('联系') || text.includes('合作') || text.includes('发送') || text.includes('SEND')) {
            setHoverLabel('HIRE ME');
          } else if (interactiveEl.getAttribute('title')?.includes('Next') || interactiveEl.getAttribute('title')?.includes('Previous')) {
            setHoverState('drag');
            setHoverLabel('SLIDE');
          } else {
            setHoverLabel('CLICK');
          }
        }
      } else {
        setHoverState('default');
        setHoverLabel('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // If mobile or pointer device is touch, disable custom cursor
  if (isMobile) return null;

  // Render state calculations
  const getCursorScale = () => {
    if (isClicked) return 0.8;
    switch (hoverState) {
      case 'pointer': return 1.3;
      case 'text': return 1.1;
      case 'drag': return 1.4;
      case 'zoom': return 1.5;
      default: return 1.0;
    }
  };

  const getOuterBorderColor = () => {
    switch (hoverState) {
      case 'pointer': return '#CE0F51'; // Crimson Red
      case 'text': return '#024C38';    // Deep Cold Green
      case 'drag': return '#F3D03B';    // Vibrant Yellow
      case 'zoom': return '#CE0F51';
      default: return '#024C38';
    }
  };

  const getInnerBgColor = () => {
    switch (hoverState) {
      case 'pointer': return '#F3D03B'; // Yellow accent for dot
      case 'text': return '#CE0F51';    // Crimson
      case 'drag': return '#024C38';    // Green
      default: return '#CE0F51';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* 0. Trailing Dynamic Particles */}
      {isVisible && particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-none pointer-events-none border border-[#024C38]/20 animate-particle-fade-out"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}

      <AnimatePresence>
        {isVisible && (
          <>
            {/* 1. Trailing Retro Outer Target / Bracket */}
            <motion.div
              style={{
                x: trailX,
                y: trailY,
                translateX: '-50%',
                translateY: '-50%',
              }}
              animate={{
                scale: getCursorScale(),
                rotate: hoverState === 'pointer' ? 45 : hoverState === 'drag' ? 90 : 0,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="absolute w-8 h-8 flex items-center justify-center pointer-events-none"
            >
              {hoverState === 'pointer' ? (
                // Pop-art Bracket / Diamond corner corners
                <div 
                  className="w-full h-full relative border-2 transition-colors duration-200"
                  style={{ 
                    borderColor: getOuterBorderColor(),
                    boxShadow: '2px 2px 0px 0px rgba(2, 76, 56, 0.4)'
                  }}
                />
              ) : hoverState === 'text' ? (
                // Text Bracket Beam
                <div className="flex justify-between w-4 h-6 items-center">
                  <div className="w-[2px] h-full bg-[#024C38]" />
                  <div className="w-[10px] h-[2px] bg-[#024C38] opacity-50" />
                  <div className="w-[2px] h-full bg-[#024C38]" />
                </div>
              ) : hoverState === 'drag' ? (
                // Retro Diamond compass
                <div 
                  className="w-7 h-7 border-2 rotate-45 border-dashed transition-colors duration-200"
                  style={{ borderColor: getOuterBorderColor() }}
                />
              ) : (
                // Classic crisp pixel box outline
                <div 
                  className="w-6 h-6 border-2 transition-colors duration-200"
                  style={{ borderColor: getOuterBorderColor() }}
                />
              )}
            </motion.div>

            {/* 2. Instant Centered Pop-Art Point */}
            <motion.div
              style={{
                x: mouseX,
                y: mouseY,
                translateX: '-50%',
                translateY: '-50%',
              }}
              animate={{
                scale: isClicked ? 0.7 : 1,
              }}
              className="absolute pointer-events-none flex items-center justify-center z-10"
            >
              {/* Retro square dot cursor */}
              <div 
                className="w-2.5 h-2.5 transition-colors duration-150 rotate-45"
                style={{ 
                  backgroundColor: getInnerBgColor(),
                  border: '1px solid #024C38'
                }}
              />
            </motion.div>

            {/* 3. Floating Retro Tag Label */}
            {hoverLabel && (
              <motion.div
                style={{
                  x: mouseX,
                  y: mouseY,
                }}
                className="absolute pointer-events-none z-20"
              >
                {/* 
                  IMPORTANT BUGFIX: To prevent x & y in initial/animate properties from 
                  mutating the shared mouseX & mouseY motion value states, we wrap the 
                  floating label inside a static tracking container and animate the offsets 
                  on this child component instead.
                */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 18, y: 18 }}
                  animate={{ opacity: 1, scale: 1, x: 18, y: 18 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div 
                    className="px-2 py-0.5 bg-[#FAF4EB] text-[#024C38] font-mono text-[9px] font-black border-2 border-[#024C38] shadow-[2.5px_2.5px_0px_0px_#CE0F51] whitespace-nowrap tracking-wider"
                  >
                    {hoverLabel}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
