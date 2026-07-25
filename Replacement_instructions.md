# 资源替换与交接说明文档 (Replacement Instructions)
> **STARDUST COMPUTATIONAL LAB — AIGC 个人创意与技术作品集**

本文档旨为后续交接与个人作品替换提供清晰、模块化的指引。帮助您快速定位作品集中各模块（平面视觉、AI 视频短剧、3D 资产、ComfyUI 拓扑图、商业案例、个人头像）所对应的代码文件与静态资源路径，并说明如何高效地将现有占位图替换为真实的个人作品。

---

## 一、 核心架构与替换原则 (Core Rules)

1. **统一数据中心 (`src/data.ts`)**：
   大部分作品的文本描述、图片路径数组、视频 URL 和技术参数均集中管理于 `src/data.ts` 中。只需修改该文件中的数据结构，全站视图将自动更新渲染。

2. **静态资源存放规范 (`public/` 目录)**：
   - 所有本地图片/视频建议放置在 `public/` 子目录中（如 `/public/introduce/` 或 `/public/1_Visual Aesthetics/`）。
   - **引用规则**：在代码或 `src/data.ts` 中引用时，**必须以 `/` 开头且严禁包含 `public/` 前缀**。
     - ❌ 错误：`public/introduce/intro.png`
     - ✅ 正确：`/introduce/intro.png`

3. **高性能加载与图片自适应**：
   网站已全量集成 `SmartImage` 智能并发加载组件与视口预加载机制，支持网络在线 URL（如 CDN 链接）与本地相对路径，无损保留 High-DPI 画质。

---

## 二、 页面各模块资源分布与替换指引 (Assets Mapping)

### 1. 个人形象照与头像 (Profile Avatar)
* **展示位置**：个人简介 (Profile) 模块左侧拍立得相框
* **代码文件**：`src/components/Profile.tsx` (约第 86 行)
* **默认存储路径**：`/public/introduce/intro.png`
* **替换方法**：
  * **方法 A（同名替换）**：将您的个人照片重命名为 `intro.png`，直接覆盖 `/public/introduce/intro.png` 文件。
  * **方法 B（路径替换）**：在 `src/components/Profile.tsx` 第 86 行修改 `<img src="/introduce/intro.png" ... />` 的 `src` 属性为您新的图片路径或在线 URL。

---

### 2. 视觉美学展厅 (Visual Aesthetics Projects)
* **展示位置**：视觉美学展厅 (Visual Aesthetics)
* **数据存储位置**：`src/data.ts` 中的 `VISUAL_PROJECTS` 数组 (第 3 - 133 行)
* **各子系列替换说明**：

| 系列名称 | 对应项目 `id` | 图片存储路径 / 数据属性 | 说明与替换建议 |
| :--- | :--- | :--- | :--- |
| **多巴胺高饱和插画** | `dopamine` | `/public/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/` | 替换文件夹内图片，或修改 `VISUAL_PROJECTS[0].images` 数组路径 |
| **森之梦呓-塔罗牌** | `tarot` | `/public/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/` | 替换文件夹内图片，或修改 `VISUAL_PROJECTS[1].images` 数组路径 |
| **复古超现实拼贴** | `collage` | `/public/1_Visual Aesthetics/1_Graphic Visual Series Projects/3_Collage Visual/` | 替换文件夹内图片，或修改 `VISUAL_PROJECTS[2].images` 数组路径 |
| **Star Dust 像素系列** | `stardust` | `VISUAL_PROJECTS[3].images` 数组 | 当前使用在线占位 URL，可替换为个人像素作品本地路径数组 |
| **蜉蝣星梦邮票系列** | `mayfly` | `VISUAL_PROJECTS[4].images` 数组 | 当前使用在线占位 URL，可替换为个人邮票作品本地路径数组 |

---

### 3. AI 视频与短剧展厅 (AI Video Projects & Storyboard)
* **展示位置**：视频与戏剧创作模块
* **数据存储位置**：`src/data.ts` 中的 `VIDEO_PROJECTS` 数组 (第 135 - 163 行)
* **案例配置项说明**（以《拓本惊变之荆轲刺秦》为例）：
  * **视频播放地址 (`videoUrl`)**：支持 MP4 / WebM 直链或 CDN 视频地址。
  * **视频封面图 (`thumbnail`)**：展示于视频播放器加载前的海报图。
  * **分镜剧照列表 (`storyboard`)**：数组中的每项包含 `time` (时间轴)、`description` (分镜描述) 和 `image` (分镜高精图 URL)。

---

### 4. 3D 资产与模型展示 (3D Models Gallery)
* **展示位置**：技术工作流中的 3D 资产可交互模态框
* **数据存储位置**：`src/data.ts` 中的 `MODELS_3D` 数组 (第 165 - 177 行)
* **配置字段解构**：
  ```typescript
  {
    id: 'm1',
    title: '模型标题',
    image: 'https://...', // 替换为模型的 3D 高精渲染图路径/URL
    category: '分类标签',
    triangles: '面数统计 (如 124,500)',
    renderer: '渲染器 (如 Octane / Tripo3D)',
    pbrPrompt: '生成提示词',
    wireframe: false
  }
  ```
* **替换方式**：直接修改 `MODELS_3D` 数组中各元素的 `image` 字段为您的 3D 渲染图。

---

### 5. ComfyUI 节点工作流 (ComfyUI Workflows)
* **展示位置**：技术工作流 (Technical Showcase) 中的 ComfyUI 拓扑图卡片
* **数据存储位置**：`src/data.ts` 中的 `COMFY_WORKFLOWS` 数组 (第 179 - 303 行)
* **关键属性**：
  * `imageUrl`: ComfyUI 节点网络截图或工作流预览图。
  * `videoUrl`: 动态效果演示视频 URL (若该工作流类型为 `video`)。
  * `techStack`: 关联的底层大模型、ControlNet 及 LoRA 配置信息。

---

### 6. RAD 微调角色效果轮播图 (RAD Fine-tuned Model Gallery)
* **展示位置**：技术工作流中的“RAD 专属角色模型微调”画廊
* **代码文件**：`src/components/TechnicalShowcase.tsx` (第 12 - 41 行)
* **常量名称**：`RAD_IMAGES`
* **替换方式**：直接在 `TechnicalShowcase.tsx` 顶部修改 `RAD_IMAGES` 数组各元素的 `imgUrl` 属性为您的训练效果图。

---

### 7. 商业落地案例 (Commercial Cases)
* **展示位置**：商业落地案例 (Commercial Cases)
* **数据存储位置**：`src/data.ts` 中的 `BRAND_EDIT_IMAGES` 与 `BRAND_GENERATE_IMAGES` (第 305 - 362 行)
* **分类说明**：
  * **图生图 / 商业重绘**：`BRAND_EDIT_IMAGES`（包含电商产品背景、万物迁移、视觉风格切换三组图片数组）。
  * **文生图 / 品牌生成**：`BRAND_GENERATE_IMAGES`（包含主题视觉、IP 形象、VI 延展、Banner 广告四组海报数组）。
* **替换方式**：直接替换对应分类下的 `images` 数组元素 URL。

---

## 三、 最佳实践与替换尺寸建议 (Recommendations)

1. **推荐分辨率与比例**：
   - **平面海报/作品集**：推荐 3:4 或 16:9 高清比例，宽度 1200px 以上。
   - **头像/3D 资产/产品对比图**：推荐 1:1 或 4:3 比例，800x800px 或 800x600px。
   - **视频分镜图**：推荐 16:9 比例，1280x720px。
2. **文件格式**：
   - 图片首选 `.png` 或高压缩率 `.webp`，兼顾画质与加载体验。
   - 视频建议使用标准 H.264 编码的 `.mp4` 文件，建议单个视频体积控制在 10MB ~ 30MB 以内。
3. **验证与测试**：
   替换完成后，建议在终端运行 `npm run lint` 进行代码检查，确保无语法与类型报错。
