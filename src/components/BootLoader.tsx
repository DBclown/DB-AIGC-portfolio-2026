import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Zap, Sparkles, ShieldAlert, FastForward } from 'lucide-react';

interface BootLoaderProps {
  onComplete: () => void;
}

export default function BootLoader({ onComplete }: BootLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const logs = [
    'INITIALIZING STARDUST COMPUTATIONAL LAB MATRIX...',
    'ALLOCATING HIGH-DPI RETINA ASSET BUFFERS (100% RAW QUALITY)...',
    'PRE-WARMING COMFYUI & LORA MODEL PIPELINES...',
    'ENABLING LAZY-LOADING QUEUE & CONCURRENCY THROTTLE...',
    'MATRIX SYNCHRONIZED. SYSTEM ONLINE.'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsDone(true);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 15) + 12;
        const bounded = Math.min(next, 100);

        if (bounded >= 80) setCurrentStep(4);
        else if (bounded >= 60) setCurrentStep(3);
        else if (bounded >= 40) setCurrentStep(2);
        else if (bounded >= 20) setCurrentStep(1);

        return bounded;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setProgress(100);
    setIsDone(true);
    setTimeout(() => {
      onComplete();
    }, 100);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#024C38] text-[#F3D03B] flex flex-col justify-between p-6 sm:p-12 transition-all duration-500 selection:bg-[#CE0F51] selection:text-white ${
        isDone ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      {/* Top Header Status */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-[#F3D03B] pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#CE0F51] text-white retro-border-sm animate-pulse">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-block text-xl sm:text-2xl text-white tracking-wide uppercase">
              STARDUST CORE MATRIX // BOOT
            </h1>
            <p className="font-mono text-xs text-[#F1C5C1]">
              AIGC COMPUTATIONAL LAB • LI HAO (李浩)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs font-bold">
          <span className="px-3 py-1 bg-[#F3D03B] text-[#024C38] retro-border-sm flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#CE0F51]" /> HIGH-DPI MODE: ACTIVE
          </span>
          <button
            onClick={handleSkip}
            className="px-3 py-1 bg-[#CE0F51] hover:bg-[#a80b41] text-white retro-border-sm flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
          >
            <FastForward className="w-3.5 h-3.5" /> FAST BOOT / 跳过
          </button>
        </div>
      </div>

      {/* Middle Interactive Terminal Matrix */}
      <div className="relative z-10 my-auto max-w-4xl mx-auto w-full bg-[#013527] retro-border-lg p-6 sm:p-8 retro-shadow-rose">
        <div className="flex items-center justify-between border-b-2 border-dashed border-[#F3D03B]/30 pb-3 mb-4 font-mono text-xs font-bold text-[#F1C5C1]">
          <span className="flex items-center gap-2 text-[#F3D03B]">
            <Terminal className="w-4 h-4 text-[#CE0F51]" /> SYSTEM BOOT LOG // RUNTIME_V2.5
          </span>
          <span>GPU_ALLOCATION: OPTIMAL</span>
        </div>

        {/* Terminal Line Output */}
        <div className="font-mono text-xs sm:text-sm flex flex-col gap-2.5 min-h-[140px] justify-center">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 transition-all duration-300 ${
                idx <= currentStep
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-20 -translate-x-2'
              }`}
            >
              <span className="text-[#CE0F51] font-bold shrink-0">
                {idx <= currentStep ? '▶ [OK]' : '▷ [WAIT]'}
              </span>
              <span
                className={
                  idx === currentStep
                    ? 'text-[#F3D03B] font-bold underline decoration-[#CE0F51]'
                    : 'text-gray-300'
                }
              >
                {log}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar Container */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between items-center font-block text-sm sm:text-base">
            <span className="text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F3D03B]" /> PRE-BUFFERING GRAPHIC MATRIX
            </span>
            <span className="text-[#F3D03B] font-mono text-lg">{progress}%</span>
          </div>

          <div className="w-full h-6 bg-[#024C38] retro-border-lg p-1 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F3D03B] via-[#CE0F51] to-[#F3D03B] transition-all duration-200 relative"
              style={{ width: `${progress}%` }}
            >
              {/* Retro stripe effect */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.15)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.15)_75%,transparent_75%,transparent)] bg-[length:12px_12px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Specs */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center border-t-2 border-dashed border-[#F3D03B]/30 pt-4 font-mono text-xs text-[#F1C5C1] gap-2">
        <span className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-[#F3D03B]" /> NO-LOSS HIGH-RES QUALITY ASSURANCE ENABLED
        </span>
        <span>LAZY STREAMING & CONCURRENCY THROTTLE ACTIVE</span>
      </div>
    </div>
  );
}
