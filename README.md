# STARDUST COMPUTATIONAL LAB — AIGC Creative Portfolio

> 一个基于 React + Vite + Tailwind CSS 构建的 **AIGC 个人创意与技术作品集**，全方位展现 AIGC 视觉美学、ComfyUI 节点式工作流、LoRA 模型微调、3D 资产生成及商业场景落地的综合实力。

## ✨ 作品集内容

### 1. 视觉美学 (Visual Aesthetics)
- **平面视觉系列**：多巴胺高饱和海报、森之梦呓塔罗牌（全套22张大阿卡纳）、超现实拼贴、Star Dust 像素系列、蜉蝣星梦邮票
- **AI 短剧**：《拓本惊变之荆轲刺秦》— 汉代画像石美学 × AI 动态视频
- **3D 模型系列**：11 个 AI 生成 3D 资产（支持实时交互预览）

### 2. 技术展示 (Technical Presentation)
- **ComfyUI 工作流**：舞蹈动作生成、视频无缝续接、背景迁移重绘、双模型级联循环生成、姿态控制、智能抠图等
- **LoRA 模型微调**：专属风格 LoRA 训练与效果展示
- **3D 生成流程**：从草图 → 灵感 → 优化 → 成品的全链路
- **音效生成与 TTS 音频克隆**

### 3. 商业落地案例 (Commercial Applications)
- 图像迁移 / 背景替换 / 风格迁移
- 创意实施：Banner、IP 形象、主题视觉、VI 设计

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS v4 |
| 3D 渲染 | Three.js + React Three Fiber + Drei |
| 动画 | Motion (Framer Motion) |
| 图标 | Lucide React |
| 大文件管理 | Git LFS |

## 🎨 设计风格

采用 **Neo-Brutalism / 波普极客拼贴** 视觉语言：
- 高对比度配色：深绿 `#024C38` / 暖黄 `#F3D03B` / 洋红 `#CE0F51` / 暖米白 `#F6F3EB`
- 硬朗外边框 + 像素偏移阴影
- 复古等宽字体 + 大写标题排版

## 🚀 本地运行

**环境要求：** Node.js ≥ 18

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:3000)
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 📁 项目结构

```
├── public/                    # 静态资源（图片、视频、3D 模型）
│   ├── 1_Visual Aesthetics/   # 视觉美学素材
│   ├── 2_Technical Presentation/ # 技术展示素材
│   ├── 3_Commercial Application Cases/ # 商业案例素材
│   └── introduce/             # 个人介绍
├── src/
│   ├── components/            # React 组件
│   ├── hooks/                 # 自定义 Hooks
│   ├── utils/                 # 工具函数
│   ├── data.ts                # 作品集数据配置
│   ├── types.ts               # TypeScript 类型定义
│   └── index.css              # 全局样式 + Tailwind
└── vite.config.ts             # Vite 配置
```

## 📄 License

本项目为个人作品集展示用途，所有视觉素材版权归作者所有。
