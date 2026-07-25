# AGENTS.md - 开发规范与项目指导文档

## 1. 项目整体介绍 (Project Overview)
本项目是一个基于 **React 18 + Vite + Tailwind CSS** 构建的高质量 **AIGC 个人创意与技术作品集 (STARDUST COMPUTATIONAL LAB)** 静态网页。作品集旨在全方位展现设计师与开发者在 AIGC 视觉美学、ComfyUI 节点式工作流、LoRA 专属模型微调、3D 资产生成以及商业场景落地等维度的综合实力。

网页整体采用 **复古粗犷主义 (Neo-Brutalism) / 波普极客拼贴** 视觉设计风格，配合高对比度配色（深绿 `#024C38`、暖黄 `#F3D03B`、洋红 `#CE0F51`、暖米白 `#F6F3EB`）、硬朗的外边框与像素阴影，打造极具辨识度的科技美学体验。

---

## 2. 前端目录结构 (Frontend Directory Structure)

```
/
├── public/                                      # 静态资源目录（图片、资源文件）
│   ├── introduce/                               # 个人介绍及头像相关图片
│   ├── 1_Visual Aesthetics/                     # 视觉美学项目本地图片资源
│   │   ├── 1_Graphic Visual Series Projects/    # 平面视觉系列（多巴胺、塔罗牌等）
│   │   └── ...
├── src/
│   ├── components/                              # 页面与功能组件
│   │   ├── Navigation.tsx                       # 顶部平滑导航栏
│   │   ├── Hero.tsx                             # 首页 Banner 与视觉引导
│   │   ├── Profile.tsx                          # 个人简介与能力矩阵
│   │   ├── VisualAesthetics.tsx                 # 视觉美学展厅（包含 Lightbox 与系列轮播）
│   │   ├── TechnicalShowcase.tsx                # 技术工作流、ComfyUI 拓扑图与 LoRA 微调解析
│   │   ├── CommercialCases.tsx                  # 商业落地案例对比与应用
│   │   ├── ContactForm.tsx                      # 合作交流与联系表单
│   │   ├── CollapsibleSection.tsx               # 通用可折叠板块外壳组件（高复用）
│   │   ├── CustomCursor.tsx                     # 像素风自定义光标
│   │   └── Model3DViewer.tsx                    # 3D 交互资产渲染组件
│   ├── App.tsx                                  # 主应用入口及全局滚动/折叠状态管理
│   ├── data.ts                                  # 静态作品集数据、工作流结构及案例配置
│   ├── types.ts                                 # 全局 TypeScript 接口定义
│   ├── index.css                                # Tailwind 指令及复古粗犷主义样式定义
│   └── main.tsx                                 # React DOM 渲染入口
├── metadata.json                                # 应用元数据说明
├── package.json                                 # 项目依赖及运行脚本
└── tsconfig.json                                # TypeScript 配置文件
```

---

## 3. 设计系统架构 (Design System Architecture)

### 3.1 色彩规范 (Color System)
- **主品牌深绿 (Dark Green)**: `#024C38` - 用于主外框、深色卡片背景与主体文字。
- **高亮暖黄 (Bright Yellow)**: `#F3D03B` - 用于重要高亮标签、强调按钮与交互状态。
- **警示洋红 (Magenta / Pink)**: `#CE0F51` - 用于核心提示、微型 Tag 与关键 CTA。
- **基底暖米白 (Soft Warm Canvas)**: `#F6F3EB` - 网页整体背景色，提供舒适的视觉阅读对比。
- **辅助浅粉 (Soft Pink Accent)**: `#F1C5C1` - 用于次级卡片背景与柔和色块衬底。

### 3.2 边框与阴影类 (Retro Style Classes)
- `.retro-border` / `.retro-border-sm` / `.retro-border-lg`: 提供 2px / 3px / 4px 的经典实线外边框（统一匹配 `#024C38` 色值）。
- `.retro-shadow-green` / `.retro-shadow-green-lg`: 偏移式硬阴影，呈现拟物重像素质感。

### 3.3 排版体系 (Typography)
- **标题与展示**: 使用 `font-display` 与 `font-block`，配合 `uppercase` 与大字重。
- **代码与参数注脚**: 使用 `font-mono` 搭配微型底色圆角标签（如 `text-[9px]` / `text-[10px]`）。

---

## 4. 组件复用规范 (Component Reuse Guidelines)

为了保证代码库的干净整洁、可维护性与极致的前端性能，在开发和调整页面时必须严格遵守以下规范：

1. **优先复用已有组件 (Mandatory Reuse First)**：
   - 在新增或改版任何页面模块时，**必须优先查找并复用已有的组件**（如 `CollapsibleSection`、卡片模式、模态框交互等）。
2. **扩展胜于新建 (Extend, Do Not Recreate)**：
   - 如果现有组件的功能或外观与新需求相近，**应优先通过添加 `props`、`variant`、`className` 或 `children` 插槽等方式扩展现有组件**，严禁新建结构相似的重复组件。
3. **严格按需新增 (Strict Component Creation Threshold)**：
   - **只有在现有组件彻底无法满足业务需求、且无法合理扩展时，才允许新增组件**。
4. **组件职责划分**：
   - 展示型卡片与布局应解耦，数据统一从 `data.ts` 导入，保持 UI 组件的纯粹性与复用能力。

---

## 5. 后续开发注意事项 (Future Development Guidelines)

1. **静态纯净性与死代码清理**：
   - 本项目为静态作品集展示页面，严禁残留未调用的状态变量、注释废弃代码或无效的网络请求。
2. **静态资源路径引用规范**：
   - 放置在 `public/` 目录下的静态资源（如图片），在 React 代码或 `data.ts` 中引用时**必须使用以 `/` 开头的根路径**（例如：`/introduce/intro.png` 或 `/1_Visual Aesthetics/...`），**严禁带有 `public/` 前缀**。
3. **TypeScript 严格模式**：
   - 所有新增数据或组件均需符合 `src/types.ts` 中的类型约束，每次改动后确保执行 `npm run lint`（`tsc --noEmit`）无错误。
4. **响应式与触控兼容**：
   - 必须确保所有卡片、按钮和交互模态框在移动端与桌面端均具备良好的触控尺寸（最小 44px）与高对比度显示。
