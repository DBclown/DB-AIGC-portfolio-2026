import React, { useState, useEffect } from 'react';
import { ArrowUp, Sparkles, Code, Cpu, ShieldAlert } from 'lucide-react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Profile from './components/Profile';
import VisualAesthetics from './components/VisualAesthetics';
import TechnicalShowcase from './components/TechnicalShowcase';
import CommercialCases from './components/CommercialCases';
import ContactForm from './components/ContactForm';
import CollapsibleSection from './components/CollapsibleSection';
import CustomCursor from './components/CustomCursor';
import BootLoader from './components/BootLoader';
import { useContentProtection } from './hooks/useContentProtection';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isBooted, setIsBooted] = useState(false);
  const { devToolsOpen, setDevToolsOpen } = useContentProtection();
  
  // Check if session already booted to make re-visits instant
  useEffect(() => {
    const booted = sessionStorage.getItem('stardust_booted');
    if (booted === 'true') {
      setIsBooted(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('stardust_booted', 'true');
    setIsBooted(true);
  };
  
  // Collapse state for each main section (collapsed by default)
  const [sectionsOpen, setSectionsOpen] = useState({
    profile: false,
    visual: false,
    technical: false,
    commercial: false,
    contact: false,
  });

  // Monitor scrolling to highlight navbar items and show Scroll-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sections = ['profile', 'visual', 'technical', 'commercial', 'contact'];
      let currentSection = 'hero';

      for (const sectionId of sections) {
        const el = document.getElementById(`${sectionId}-container`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the top of the section is near the middle of the screen
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = sectionId;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    if (sectionId in sectionsOpen) {
      // Auto-expand if collapsed
      setSectionsOpen(prev => ({
        ...prev,
        [sectionId]: true
      }));

      // Wait a tiny moment for layout/render to catch up, then scroll smoothly
      setTimeout(() => {
        const el = document.getElementById(`${sectionId}-container`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      setActiveSection(sectionId);
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('hero');
    }
  };

  const toggleSection = (sectionId: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="relative min-h-screen bg-[#F6F3EB] flex flex-col text-[#024C38] selection:bg-[#CE0F51] selection:text-white">
      {/* Retro Brutalism Interactive Boot Matrix Loader */}
      {!isBooted && <BootLoader onComplete={handleBootComplete} />}

      {/* Personalized Custom Cursor */}
      <CustomCursor />

      {/* Dynamic Pop-Art Background Grid Lines */}
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Top Banner Ribbon */}
      <div className="bg-[#CE0F51] text-[#F3D03B] border-b-4 border-[#024C38] py-2 z-50 relative flex items-center overflow-hidden font-block text-sm sm:text-base tracking-wider uppercase">
        <div className="flex whitespace-nowrap gap-8 animate-[infinite-scroll_25s_linear_infinite]">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex gap-8 items-center shrink-0">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F6F3EB]" /> DESIGN & ENGINEERING
              </span>
              <span className="text-[#024C38]">•</span>
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#F6F3EB]" /> AI GENERATIVE EXPERIMENTS
              </span>
              <span className="text-[#024C38]">•</span>
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#F6F3EB]" /> CREATIVE PORTFOLIO
              </span>
              <span className="text-[#024C38]">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive Custom Navigation Menu */}
      <Navigation activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content Layout with Staggered Visual Blocks */}
      <main className="flex-grow z-10 relative flex flex-col pt-4">
        <Hero onExplore={handleNavigate} />
        
        {/* PROFILE SECTION */}
        <CollapsibleSection
          id="profile"
          indexStr="00"
          title="个人简介"
          subtitle="About"
          description="十年数字设计底蕴 + 深度 AIGC 探索：构建具有物理灵魂的数字艺术"
          themeColor="#CE0F51"
          isOpen={sectionsOpen.profile}
          onToggle={() => toggleSection('profile')}
        >
          <Profile />
        </CollapsibleSection>
        
        {/* VISUAL AESTHETICS SECTION */}
        <CollapsibleSection
          id="visual"
          indexStr="01"
          title="视觉美学展示"
          subtitle="Visual Aesthetics"
          description="四组平面视觉系列、动态分镜与三维生成作品。每个系列附创作背景、目标与技术档案；点击任意作品可放大浏览，蓝色按钮进入完整系列轮播。"
          themeColor="#024C38"
          isOpen={sectionsOpen.visual}
          onToggle={() => toggleSection('visual')}
        >
          <VisualAesthetics />
        </CollapsibleSection>
        
        {/* TECHNICAL WORKFLOW SECTION */}
        <CollapsibleSection
          id="technical"
          indexStr="02"
          title="技术呈现展示"
          subtitle="Technical Craft"
          description="从节点式工作流到模型微调，从三维生成管线到音频复刻——展示作品背后的方法论与可复用的生产体系。"
          themeColor="#F3D03B"
          isOpen={sectionsOpen.technical}
          onToggle={() => toggleSection('technical')}
        >
          <TechnicalShowcase />
        </CollapsibleSection>
        
        {/* COMMERCIAL CASES SECTION */}
        <CollapsibleSection
          id="commercial"
          indexStr="03"
          title="商业应用案例"
          subtitle="Commercial Work"
          description="AIGC 不止于实验室——图像编辑、创意物料与商业宣传片，都是已在真实业务里跑通的交付形态。"
          themeColor="#F1C5C1"
          isOpen={sectionsOpen.commercial}
          onToggle={() => toggleSection('commercial')}
        >
          <CommercialCases />
        </CollapsibleSection>
        
        {/* CONTACT FORM SECTION */}
        <CollapsibleSection
          id="contact"
          indexStr="04"
          title="期待合作交流"
          subtitle="Say Hello"
          description="连结物理现实与合成艺术：开启下一阶段的颠覆级创意协作。"
          themeColor="#CE0F51"
          isOpen={sectionsOpen.contact}
          onToggle={() => toggleSection('contact')}
        >
          <ContactForm />
        </CollapsibleSection>
      </main>

      {/* Footer Area with licencing and design credits */}
      <footer className="relative z-10 bg-[#024C38] text-[#F6F3EB] border-t-4 border-[#024C38] py-12">
        <div className="max-w-[1800px] mx-auto px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-[#F1C5C1]/20 pb-10">
            
            {/* Column 1: Studio logo */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <h3 className="font-block text-3xl tracking-tight text-[#F3D03B] uppercase">
                STARDUST<br />COMPUTATIONAL.LAB
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans font-medium max-w-sm">
                立足于人工智能生成与高精视觉物理逻辑重构的分布式设计科学实验室。拥有十余年前端交互开发底蕴，为下一代产品赋能具有生命质感的美学外壳。
              </p>
            </div>

            {/* Column 2: Quick navigation */}
            <div className="md:col-span-3 flex flex-col gap-3 font-mono text-xs">
              <span className="text-[#F1C5C1] font-black uppercase">DIRECTORIES // 精选分类</span>
              <button onClick={() => handleNavigate('profile')} className="text-left text-gray-300 hover:text-[#F3D03B] cursor-pointer font-bold">▷ ABOUT / 个人简介</button>
              <button onClick={() => handleNavigate('visual')} className="text-left text-gray-300 hover:text-[#F3D03B] cursor-pointer font-bold">▷ AESTHETICS / 视觉项目</button>
              <button onClick={() => handleNavigate('technical')} className="text-left text-gray-300 hover:text-[#F3D03B] cursor-pointer font-bold">▷ WORKFLOW / 节点工程</button>
              <button onClick={() => handleNavigate('commercial')} className="text-left text-gray-300 hover:text-[#F3D03B] cursor-pointer font-bold">▷ COMMERCIAL / 商业案例</button>
            </div>

            {/* Column 3: Contact quick links */}
            <div className="md:col-span-4 flex flex-col gap-3 font-mono text-xs">
              <span className="text-[#F1C5C1] font-black uppercase">COMMUNICATION // 商业与教学合作</span>
              <div className="text-gray-300 font-bold">EMAIL: 2594454421@qq.com</div>
              <div className="text-gray-300 font-bold">BASE: 北京 // BEIJING</div>
              <div className="text-gray-300 font-bold mt-2">
                <span className="bg-[#CE0F51] text-white px-2 py-0.5 retro-border-sm font-black animate-pulse">
                  AVAILABLE FOR AIGC DESIGN & ART TEACHING
                </span>
              </div>
            </div>

          </div>

          {/* Footer Bottom copyright and statements */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-gray-400">
            <div className="flex items-center gap-2 font-bold">
              <Code className="w-4 h-4 text-[#F3D03B]" />
              <span>STARDUST COMPUTATIONAL DESIGN CO. © 2026 // ALL RIGHTS RESERVED.</span>
            </div>
            
            <div className="flex gap-4 items-center font-bold">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#F3D03B]" /> STABILITY: 100% SECURE
              </span>
              <span>|</span>
              <span className="flex items-center gap-1 text-[#F1C5C1]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AIGC POWERED
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/* DevTools Detection Warning Overlay */}
      {devToolsOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#024C38]/95 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#F6F3EB] retro-border-lg retro-shadow-green-lg p-8 max-w-md text-center">
            <ShieldAlert className="w-12 h-12 text-[#CE0F51] mx-auto mb-4" />
            <h2 className="font-block text-xl text-[#024C38] uppercase mb-3">ACCESS RESTRICTED</h2>
            <p className="text-sm text-[#024C38]/80 font-medium leading-relaxed mb-2">
              本站作品均为原创设计成果，受知识产权法保护。<br />
              禁止通过开发者工具抓取、复制或下载任何视觉资源。
            </p>
            <p className="font-mono text-[10px] text-[#CE0F51] font-bold mb-5">
              ALL ASSETS ARE COPYRIGHTED. UNAUTHORIZED EXTRACTION IS PROHIBITED.
            </p>
            <button
              onClick={() => setDevToolsOpen(false)}
              className="px-6 py-2.5 bg-[#F3D03B] text-[#024C38] font-black font-display text-sm uppercase retro-border retro-shadow-green-sm hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              I UNDERSTAND / 我已知晓
            </button>
          </div>
        </div>
      )}

      {/* Floating Retro Scroll-To-Top Button */}
      {showScrollTop && (
        <button
          onClick={() => handleNavigate('hero')}
          className="fixed bottom-6 right-6 w-12 h-12 bg-[#F3D03B] hover:bg-[#e1be1a] text-[#024C38] retro-border z-40 flex items-center justify-center retro-shadow-green hover:translate-y-[-2px] transition-all cursor-pointer"
          title="Scroll to Top"
          id="scroll-to-top-btn"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
