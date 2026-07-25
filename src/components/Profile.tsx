import React, { useState } from 'react';
import { Mail, MapPin, GraduationCap, Award, Terminal, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface Skill {
  name: string;
  level: number;
  color: string;
  details: string;
  tools: string[];
}

export default function Profile() {
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);

  const handleSkillClick = (index: number) => {
    setSelectedSkill(prev => (prev === index ? null : index));
  };

  const skills: Skill[] = [
    {
      name: 'ComfyUI Node-Based Workflow Engineering (ComfyUI 节点工作流工程)',
      level: 95,
      color: '#024C38',
      details: '熟练掌握 ComfyUI 节点搭建、Latent 空间重采样、自定义节点开发与高级条件组合。拥有大型 AnimateDiff、IP-Adapter 复杂管线与商业级 SDXL/FLUX 工作流的深度定制和性能优化能力。',
      tools: ['ComfyUI', 'AnimateDiff', 'IP-Adapter', 'FLUX.1', 'Adetailer']
    },
    {
      name: 'Fine Art Teaching & Pedagogy (美术教学与艺术造型能力)',
      level: 92,
      color: '#CE0F51',
      details: '结合湖南师范大学美术学学士与中国艺术研究院硕士背景，具备深厚的素描造型、色彩理论与艺术史功底。能将传统美术教学体系与 AIGC 视觉训练完美融合，引导学员建立系统化的美学判断与创作思维。',
      tools: ['美术造型', '色彩理论', '构图原理', 'AIGC教学', '艺术史论']
    },
    {
      name: 'Midjourney Prompt Architecture (Midjourney 提示词架构)',
      level: 90,
      color: '#F3D03B',
      details: '精通多层参数融合（--sref, --cref）、权重配比控图及变焦平移。善于构建高一致性商业设计图集。',
      tools: ['MJ v6', 'Style Reference', 'Character Ref', 'Pan/Zoom', 'Vary Region']
    },
    {
      name: 'Vibe Coding & Full-Stack Prototyping (Vibe Coding 编程与交互开发)',
      level: 88,
      color: '#024C38',
      details: '具备强悍的 AI 辅助编程（Vibe Coding）实战能力，善于利用 LLM 与 Agent 快速完成原型构建、前端 React/Tailwind 动态交互开发及可视化界面集成，实现设计与代码的无缝贯通。',
      tools: ['React 18', 'Tailwind CSS', 'Vite', 'LLM Agent', 'Vibe Coding']
    },
    {
      name: 'Stable Diffusion LoRA & ControlNet Tuning (SD 模型调优)',
      level: 86,
      color: '#F1C5C1',
      details: '精通 SD1.5/SDXL/FLUX 下的 ControlNet 控图（Depth、Canny、OpenPose）。具备高质模型调优经验，定制开发多款风格化 LoRA 模型。',
      tools: ['SDXL', 'ControlNet Depth/LineArt', 'WebUI', 'Kohya_ss']
    },
    {
      name: '3D Voxel & PBR Prompt Crafting (3D 资产与 PBR 渲染生成)',
      level: 82,
      color: '#CE0F51',
      details: '结合 Meshy、Tripo3D 及 Luma AI 等生成平台，通过硬表面三维几何提示词进行高效模型初创，辅以材质通道（PBR）细化控制。',
      tools: ['Tripo3D', 'Meshy', 'Blender Cycles', 'Octane Render']
    },
    {
      name: 'AIGC Audio Synthesis & Voice Clones (音频合成与语音复刻)',
      level: 80,
      color: '#F3D03B',
      details: '通过 ElevenLabs、GPT-SoVITS 及 RVC 声音复刻技术，完成声音微调克隆与多情感 TTS 音频合成，支持复杂声效纯提示生成。',
      tools: ['ElevenLabs', 'GPT-SoVITS', 'Suno v3', 'Foley Generator']
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 relative">
      
      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Polaroid Bio Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#F6F3EB] retro-border-lg p-5 sm:p-6 retro-shadow-green-lg flex flex-col gap-6">
              
              {/* Polaroid Photo Frame */}
              <div className="bg-white retro-border p-4 pb-8 retro-shadow-green-sm hover:rotate-1 transition-transform duration-200">
                <div className="w-full aspect-[4/3] bg-[#F1C5C1] retro-border overflow-hidden relative">
                  <img
                    src="/introduce/About Me.jpg"
                    alt="AIGC Designer Avatar"
                    className="w-full h-full object-cover filter contrast-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/designeravatar/600/450';
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#024C38] text-[#F3D03B] font-mono text-[9px] font-bold">
                    AIGC DESIGNER & ART TEACHER / LI HAO
                  </div>
                </div>
                <div className="mt-4 text-center font-mono text-xs font-bold text-[#024C38] tracking-widest">
                  LI HAO @ DIGITAL ARCHIVE
                </div>
              </div>

              {/* Designer Information List */}
              <div className="flex flex-col gap-3 font-display">
                
                <div className="flex items-center justify-between border-b border-[#024C38]/20 pb-2">
                  <span className="font-bold text-sm text-[#024C38] flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-[#CE0F51]" /> 姓名 / Name
                  </span>
                  <span className="font-mono text-sm font-bold text-[#024C38] bg-[#F3D03B] px-2 py-0.5 retro-border-sm">
                    李浩 / Harry
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#024C38]/20 pb-2">
                  <span className="font-bold text-sm text-[#024C38] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#CE0F51]" /> 职位 / Role
                  </span>
                  <span className="text-sm font-bold text-[#024C38]">AIGC设计师 & 美术老师</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#024C38]/20 pb-2">
                  <span className="font-bold text-sm text-[#024C38] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#CE0F51]" /> 所在地 / Base
                  </span>
                  <span className="text-sm font-bold text-[#024C38]">北京 (Beijing)</span>
                </div>

                <div className="flex items-start justify-between border-b border-[#024C38]/20 pb-2">
                  <span className="font-bold text-sm text-[#024C38] flex items-center gap-1.5 pt-0.5">
                    <GraduationCap className="w-4 h-4 text-[#CE0F51] shrink-0" /> 毕业院校 / Edu
                  </span>
                  <div className="text-sm font-bold text-[#024C38] text-right flex flex-col items-end gap-0.5">
                    <span>湖南师范大学美术学院 - 美术学学士</span>
                    <span className="text-[#CE0F51]">中国艺术研究院 - 在读硕士</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2">
                  <span className="font-bold text-sm text-[#024C38] flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#CE0F51]" /> 邮箱 / Email
                  </span>
                  <a href="mailto:2594454421@qq.com" className="font-mono text-sm font-bold text-[#024C38] underline hover:text-[#CE0F51]">2594454421@qq.com</a>
                </div>

              </div>

            </div>
          </div>

          {/* RIGHT: AIGC Skill Mastery Chart */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="p-6 bg-[#024C38] text-[#F6F3EB] retro-border-lg retro-shadow-green-lg">
              <h3 className="font-display font-black text-xl text-[#F3D03B] mb-3 uppercase flex items-center gap-2">
                <Terminal className="w-5 h-5" /> Design Philosophy / 创作哲学
              </h3>
              <p className="text-sm leading-relaxed text-gray-200">
                “作为一名拥有扎实美术学学术背景（湖南师范大学美术学学士、中国艺术研究院在读硕士）的 AIGC 设计师与美术老师，我将传统美术功底、造型理论与前沿生成式 AI 工作流相结合。对我而言，AI 不仅是高效的技术工具，更是探索视觉美学的无限画布。”
              </p>
              
              <div className="mt-4 flex items-center gap-2 text-xs text-[#F1C5C1] font-mono">
                <Heart className="w-4 h-4 fill-current text-[#CE0F51]" />
                <span>BACKGROUND: BFA (HUNAN NORMAL UNIV) + MFA CANDIDATE (CAC) + AIGC DESIGN</span>
              </div>
            </div>

            {/* Interactive Bars Container */}
            <div className="bg-[#F1C5C1] retro-border-lg p-5 sm:p-6 retro-shadow-green-lg flex flex-col gap-5">
              <div className="flex justify-between items-center pb-2 border-b-2 border-[#024C38] border-dashed">
                <h3 className="font-display font-black text-lg text-[#024C38] uppercase flex items-center gap-2">
                  <span>AIGC SKILLS & COMPETENCE</span>
                </h3>
                <span className="font-mono text-xs bg-[#024C38] text-white px-2.5 py-0.5 retro-border-sm font-bold animate-pulse">
                  CLICK TO DEEP DIVE
                </span>
              </div>

              {/* Skill Bars List */}
              <div className="flex flex-col gap-4">
                {skills.map((skill, index) => {
                  const isSelected = selectedSkill === index;

                  return (
                    <div 
                      key={index} 
                      className="flex flex-col gap-1 cursor-pointer group select-none"
                      onClick={() => handleSkillClick(index)}
                    >
                      <div className="flex justify-between items-center text-sm font-bold text-[#024C38]">
                        <span className="font-display uppercase tracking-wide group-hover:text-[#CE0F51] transition-colors flex items-center gap-1.5">
                          <span>{skill.name}</span>
                        </span>
                        <span className="font-mono text-xs font-black bg-[#024C38] text-[#F3D03B] px-1.5 py-0.2 retro-border-sm">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Bar Track with Clean Motion Progress Animation */}
                      <div className="w-full bg-[#F6F3EB] h-6 retro-border-sm overflow-hidden relative">
                        <motion.div 
                          key={`skill-bar-${index}`}
                          initial={{ width: '0%' }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ 
                            duration: 0.9, 
                            delay: index * 0.1, 
                            ease: [0.16, 1, 0.3, 1] 
                          }}
                          className="h-full relative flex items-center pl-3 overflow-hidden"
                          style={{ backgroundColor: skill.color }}
                        >
                          <span className="font-mono text-[10px] text-white font-black drop-shadow-md select-none opacity-90 z-20 flex items-center gap-1.5 whitespace-nowrap">
                            <span>LEVEL // 0{index + 1}</span>
                          </span>
                        </motion.div>
                      </div>

                      {/* Expandable Details Panel */}
                      {isSelected && (
                        <motion.div 
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 p-3 bg-white retro-border-sm retro-shadow-green-sm flex flex-col gap-2"
                        >
                          <p className="text-xs text-[#024C38] leading-relaxed font-sans font-medium">
                            {skill.details}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {skill.tools.map((t, idx) => (
                              <span 
                                key={idx} 
                                className="px-2 py-0.5 bg-[#F6F3EB] text-[#024C38] font-mono text-[9px] font-black retro-border-sm"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </motion.div>
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
