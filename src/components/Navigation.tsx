import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles, Compass } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Navigation({ activeSection, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'profile', label: '个人简介', en: 'ABOUT' },
    { id: 'visual', label: '视觉美学', en: 'AESTHETICS' },
    { id: 'technical', label: '技术工作流', en: 'TECH FLOW' },
    { id: 'commercial', label: '商业应用', en: 'COMMERCIAL' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav
      id="retro-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'py-2 bg-[#F6F3EB]/95 backdrop-blur-sm border-b-3 border-[#024C38] opacity-100 translate-y-0' 
          : 'opacity-0 pointer-events-none -translate-y-full'
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16">
        <div className="flex items-center justify-between retro-border bg-[#F1C5C1] p-2.5 sm:p-4 retro-shadow-green rounded-0">
          {/* Logo / Mascot Title */}
          <div 
            onClick={() => handleItemClick('hero')} 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F3D03B] retro-border rounded-none flex items-center justify-center retro-shadow-green-sm group-hover:rotate-12 transition-transform duration-200">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#024C38]" />
            </div>
            <div>
              <span className="font-block text-sm sm:text-2xl tracking-tight text-[#024C38]">
                CREATIVE<span className="text-[#CE0F51]">.AIGC</span>
              </span>
              <p className="font-mono text-[8px] sm:text-[9px] text-[#024C38] leading-none tracking-widest hidden sm:block">
                PORTFOLIO / ARCHIVE V1.0
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`px-2 py-1.5 lg:px-4 lg:py-2 font-display text-xs lg:text-sm font-bold retro-border-sm transition-all duration-150 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#024C38] text-[#F6F3EB] translate-x-[2px] translate-y-[2px] shadow-none'
                      : 'bg-[#F6F3EB] text-[#024C38] retro-shadow-green-sm hover:bg-[#F3D03B]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[10px] opacity-60 hidden xl:inline">({item.en})</span>
                </button>
              );
            })}

            {/* Accent CTA */}
            <button
              id="nav-hire-btn"
              onClick={() => handleItemClick('contact')}
              className="ml-1 lg:ml-2 px-2.5 py-1.5 lg:px-4 lg:py-2 bg-[#CE0F51] text-[#F6F3EB] font-display text-xs lg:text-sm font-black retro-border-sm retro-shadow-green-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#024C38] transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <span>期待合作</span> <ArrowUpRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 bg-[#F3D03B] text-[#024C38] retro-border-sm rounded-none flex items-center justify-center retro-shadow-green-sm hover:bg-[#F3D03B]/90 cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[84px] bg-[#F6F3EB] retro-border-lg border-t-0 p-6 retro-shadow-green-lg mx-4 z-40 transition-all">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-dashed border-[#024C38]">
              <Compass className="w-5 h-5 text-[#CE0F51] animate-spin" />
              <span className="font-display font-black text-sm text-[#024C38] tracking-widest">
                ARCHIVE SITEMAP
              </span>
            </div>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-btn-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full p-3 font-display font-black text-left retro-border-sm transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#024C38] text-[#F6F3EB]'
                      : 'bg-[#F1C5C1] text-[#024C38] retro-shadow-green-sm'
                  }`}
                >
                  <span className="text-base">{item.label}</span>
                  <span className="font-mono text-xs opacity-80">[{item.en}]</span>
                </button>
              );
            })}

            <button
              id="mobile-nav-hire"
              onClick={() => handleItemClick('contact')}
              className="w-full mt-2 p-3 bg-[#CE0F51] text-[#F6F3EB] font-display font-black text-center retro-border-sm retro-shadow-green-sm flex items-center justify-center gap-2"
            >
              <span>立即建立联系 / HIRE ME</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
