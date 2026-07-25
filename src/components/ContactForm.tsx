import React, { useState, useEffect } from 'react';
import { 
  Send, Terminal, Check, 
  Github, Twitter, Youtube 
} from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  time: string;
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);

  // Load submissions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aigc_portfolio_messages');
      if (stored) {
        setSubmissions(JSON.parse(stored));
      } else {
        // Preset seed messages so the inbox doesn't look empty and sad
        const seeds: ContactSubmission[] = [
          { id: '1', name: '王经理 // Tech Director', email: 'director@cyberagency.com', message: '您好，看了您的 ComfyUI 转绘工作流，非常有质感。我们下周有个商业短片需要引入这种风格，期待合作！', time: '2026-07-18 14:35' },
          { id: '2', name: 'Sarah Wu // Visual Lead', email: 'sarah@artstudio.io', message: 'Hi Chen, your Gold Obsidian Tarot series is absolutely stunning. Let\'s connect for a dual-media digital exhibition next month.', time: '2026-07-19 09:12' }
        ];
        localStorage.setItem('aigc_portfolio_messages', JSON.stringify(seeds));
        setSubmissions(seeds);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('请完整填写姓名、邮箱和留言！');
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(10);

    // Simulated transmission progress bar
    const interval = setInterval(() => {
      setSubmitProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Complete and append
          const newMsg: ContactSubmission = {
            id: Date.now().toString(),
            name,
            email,
            message,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
          
          const updated = [newMsg, ...submissions];
          setSubmissions(updated);
          localStorage.setItem('aigc_portfolio_messages', JSON.stringify(updated));

          // Also trigger a pre-filled mailto link so the user can send via real email client if installed
          const subject = encodeURIComponent(`【作品集合作咨询】来自 ${name}`);
          const body = encodeURIComponent(`发件人姓名：${name}\n联系邮箱：${email}\n\n合作留言内容：\n${message}`);
          window.location.href = `mailto:2594454421@qq.com?subject=${subject}&body=${body}`;

          // Clear form
          setName('');
          setEmail('');
          setMessage('');
          setIsSubmitting(false);
          return 100;
        }
        return prev + 15;
      });
    }, 120);
  };

  const [activeRoadmap, setActiveRoadmap] = useState<number | null>(0);

  const roadmapItems = [
    {
      year: '2026 Q3 - Q4',
      title: '耳机定制商业宣传片 (Custom Earphones Commercial Video)',
      stack: 'ComfyUI + AnimateDiff + FLUX.1 + 商业分镜管线',
      desc: '针对高端定制耳机品牌打造的全 AIGC 商业级广告宣传片。结合 ControlNet 机械声学建模与动态质感渲染，无缝呈现工业美学、音质波形与精细材质的沉浸视觉。'
    },
    {
      year: '2027 Q1 - Q2',
      title: '《星尘之叹》AI 全维度互动情感合成影片 (Neural Film)',
      stack: 'AnimateDiff + Suno v4 + Web Audio API + RVC Clones',
      desc: '一部剧集式交互短片。根据玩家点击对话及输入情绪，系统通过实时 TTS 与视频流合成，现场渲染出完全个性化的后传分镜及背景配乐。'
    },
    {
      year: '2027 Q3 - Q4',
      title: '《我随机重生》AI Coding 随机人生重构游戏 (Random Rebirth AI Game)',
      stack: 'Vibe Coding + LLM Agent + React 18 + Tailwind CSS',
      desc: '基于 AI 编程与 Agent 智脑（Vibe Coding）全流程构建的随机人生重构游戏。玩家将通过生成式实时剧情演化与动态分支算法，开启拥有无限随机属性与异世界命运抉择的重生之旅。'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 relative">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* LEFT COLUMN: CONTACT DETAILS, THINKING, AND SIMULATOR INBOX */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Contacts card */}
            <div className="bg-[#024C38] text-[#F6F3EB] retro-border-lg p-5 sm:p-6 retro-shadow-green-lg relative">
              <div className="absolute top-2 right-2 text-[#F3D03B] text-lg font-bold">✦ ✦</div>
              
              <span className="font-mono text-[9px] text-[#F1C5C1] font-black uppercase tracking-wider block mb-1">DESIGNER META INFO</span>
              <h3 className="font-display font-black text-xl text-[#F3D03B] mb-4">
                李浩 / AIGC DESIGNER & ART TEACHER
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono mb-4 text-gray-200">
                <div className="flex flex-col gap-1.5 bg-white/5 p-3 retro-border-sm">
                  <span className="text-[#F1C5C1] font-bold uppercase">LOCATION // 所在地</span>
                  <span className="text-white font-bold">北京 (Beijing)</span>
                </div>
                <div className="flex flex-col gap-1.5 bg-white/5 p-3 retro-border-sm">
                  <span className="text-[#F1C5C1] font-bold uppercase">EMAIL // 电子邮件</span>
                  <a href="mailto:2594454421@qq.com" className="text-[#F3D03B] underline font-bold">
                    2594454421@qq.com
                  </a>
                </div>
              </div>

              {/* Slogan details */}
              <p className="text-xs leading-relaxed text-gray-300 font-sans font-medium">
                “凭借美术学专业功底与 AIGC 前沿工作流，我期待与艺术机构、商业品牌、科技团队及教育平台展开深度合作。无论是复杂的 ComfyUI 节点管线搭建、LoRA 模型定制微调，还是系统化的 AIGC 视觉课程教学与商业设计落地，均能提供高标准与深厚美学底蕴的专业赋能。”
              </p>

              {/* Social links */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#F1C5C1] font-bold uppercase">SOCIAL CONNECTIONS // 社交阵地:</span>
                <div className="flex gap-2.5">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white text-[#024C38] retro-border-sm flex items-center justify-center hover:bg-[#F3D03B] transition-colors">
                    <Github className="w-4.5 h-4.5" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white text-[#024C38] retro-border-sm flex items-center justify-center hover:bg-[#F3D03B] transition-colors">
                    <Twitter className="w-4.5 h-4.5" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white text-[#024C38] retro-border-sm flex items-center justify-center hover:bg-[#F3D03B] transition-colors">
                    <Youtube className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* REAL RECEIVED INBOX SIMULATOR DISPLAY (设计师收件箱模拟器) */}
            <div className="bg-[#F1C5C1] retro-border-lg p-5 sm:p-6 retro-shadow-green-lg">
              <div className="flex justify-between items-center pb-2 border-b-2 border-dashed border-[#024C38] mb-3">
                <h4 className="font-display font-black text-sm text-[#024C38] uppercase flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" /> 设计师本地信箱模拟器 (DESIGNER INBOX LOG)
                </h4>
                <span className="font-mono text-[9px] bg-[#024C38] text-white px-2 py-0.5 retro-border-sm">
                  TOTAL MSG: {submissions.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                {submissions.map((msg) => (
                  <div key={msg.id} className="bg-white p-3 retro-border-sm retro-shadow-green-sm flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-[#024C38]/10 pb-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#CE0F51]">{msg.name}</span>
                        <span className="text-gray-400">({msg.email})</span>
                      </div>
                      <span className="text-gray-500 font-bold">{msg.time}</span>
                    </div>
                    <p className="text-xs text-[#024C38] font-sans font-medium leading-relaxed break-words">
                      {msg.message}
                    </p>
                    <div className="flex justify-end">
                      <span className="px-1.5 py-0.2 bg-[#E2E8F0] text-gray-600 font-mono text-[8px] font-bold retro-border-sm flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> ✓ QUEUED_FOR_AIGC_REPLY
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CONTACT FORM & ROADMAP OUTLOOK (未来项目展望的界面) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Interactive Feedback Contact Form */}
            <div className="bg-white retro-border-lg p-5 sm:p-6 retro-shadow-green-lg flex flex-col gap-4">
              <span className="font-mono text-[10px] text-[#CE0F51] font-black uppercase tracking-wider block border-b border-gray-100 pb-2">
                COOPERATION FORM // 建立连接与合作
              </span>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 font-display">
                
                {/* Field 1: Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] font-bold text-[#024C38] uppercase">YOUR NAME // 姓名</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例如：王策划 / Visual Director"
                    className="w-full bg-[#F6F3EB] text-[#024C38] p-2.5 text-xs font-bold retro-border-sm focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Field 2: Email */}
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] font-bold text-[#024C38] uppercase">YOUR EMAIL // 电子邮箱</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@domain.com"
                    className="w-full bg-[#F6F3EB] text-[#024C38] p-2.5 text-xs font-bold retro-border-sm focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Field 3: Message */}
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] font-bold text-[#024C38] uppercase">LEAVE MESSAGE // 留言内容</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="您想跟李浩沟通什么项目构想、课程授课、AIGC视觉定制或设计雇佣合作？"
                    className="w-full bg-[#F6F3EB] text-[#024C38] p-2.5 text-xs font-bold retro-border-sm focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                {/* Simulated generative processing log */}
                {isSubmitting && (
                  <div className="flex flex-col gap-1 bg-[#024C38] text-[#F3D03B] p-2.5 retro-border-sm font-mono text-[9px] font-bold">
                    <span>▶ INITIALIZING STARDUST MESSAGE MATRIX...</span>
                    <span>▶ ROUTING ENCRYPTED EMAIL TO 2594454421@QQ.COM...</span>
                    <div className="w-full bg-[#F6F3EB]/20 h-2.5 retro-border-sm mt-1 overflow-hidden">
                      <div className="bg-[#CE0F51] h-full" style={{ width: `${submitProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 bg-[#CE0F51] hover:bg-[#9f0a3c] text-white font-mono text-xs font-black retro-border retro-shadow-green-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#024C38] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'PROMPTING MATRIX...' : 'SEND INBOX MESSAGE / 提交合作留言'}</span>
                </button>

                <p className="font-mono text-[10px] text-gray-500 leading-normal">
                  💡 提交后留言将即时呈现于左侧【设计师信箱模拟器】，并自动触发 <span className="font-bold text-[#CE0F51]">mailto</span> 调起您的邮件客户端直发至 <span className="underline font-bold text-[#024C38]">2594454421@qq.com</span>。
                </p>

              </form>
            </div>

            {/* FUTURE RESEARCH & DEVELOPMENT ROADMAP VIEW (未来项目展望的界面) */}
            <div className="bg-[#F3D03B] text-[#024C38] retro-border-lg p-5 sm:p-6 retro-shadow-green-lg">
              <span className="font-mono text-[10px] text-[#CE0F51] font-black uppercase tracking-wider block mb-1">
                RESEARCH & DEVELOPMENT OUTLOOK
              </span>
              <h3 className="font-display font-black text-lg text-[#024C38] mb-4 uppercase">
                未来项目技术展望 (2026-2027)
              </h3>

              <div className="flex flex-col gap-3">
                {roadmapItems.map((item, idx) => {
                  const isActive = activeRoadmap === idx;
                  return (
                    <div 
                      key={idx} 
                      className="bg-[#F6F3EB] retro-border-sm p-3 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_#024C38] transition-all cursor-pointer"
                      onClick={() => setActiveRoadmap(isActive ? null : idx)}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#CE0F51] border-b border-gray-200 pb-1.5 mb-1.5">
                        <span>{item.year}</span>
                        <span className="text-[8px] bg-[#024C38] text-white px-1.5 py-0.2">ROADMAP_STAGE_0{idx + 1}</span>
                      </div>
                      
                      <h4 className="font-display font-black text-xs text-[#024C38] leading-tight flex items-center gap-1">
                        <span>{item.title}</span>
                      </h4>

                      {isActive && (
                        <div className="mt-2 text-[11px] flex flex-col gap-2 font-sans text-gray-700 leading-normal border-t border-dashed border-gray-200 pt-2 animate-fade-in">
                          <p>{item.desc}</p>
                          <div className="font-mono text-[9px] text-[#CE0F51] font-bold">
                            TECH_STACK: {item.stack}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

    </div>
  );
}
