import { BaseProject, VideoProject, Model3D, ComfyWorkflow } from './types';

export const VISUAL_PROJECTS: BaseProject[] = [
  {
    id: 'dopamine',
    title: '多巴胺高饱和插画海报 (Dopamine Retro Poster Series)',
    category: '高饱和复古 / 波普艺术',
    bg: '通过多巴胺配色刺激视觉神经。本系列采用经典的孟菲斯拼贴风格 and 高饱和波普插画，表达年轻一代对活力、奇幻与叛逆日常的宣泄。',
    goal: '探索AIGC大面积色块的平涂一致性（Flat Illustration Color Consistency）。通过多层提示词融合与定制Style Reference，实现边缘清晰、色块明亮、无杂色的现代海报视觉。',
    duration: '14天',
    count: 12,
    tools: ['FLUX', 'ControlNet (LineArt)', 'Illustrator'],
    tags: [
      { label: 'Dopamine Color', type: 'concept' },
      { label: 'Memphis Design', type: 'concept' },
      { label: 'Style Reference', type: 'tech' },
      { label: 'Vectorization', type: 'tool' },
    ],
    images: [
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_1.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_2.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_3.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_4.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_5.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_6.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_post-1.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_post-2.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_post-3.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_post-4.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_post-5.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/1_Dopamine Visual/Dopamine Visual_post-6.png',
    ]
  },
  {
    id: 'tarot',
    title: '森之梦呓-塔罗牌系类 (Dream of Forest - Tarot Series)',
    category: '神秘学 / 蚀刻金箔',
    bg: '对经典伟特塔罗牌的重构。全套22张大阿卡纳卡牌，以维多利亚风格美学与自然主义的装饰线条，重塑愚人、魔术师、女祭司等经典神秘学意象。',
    goal: '实现精细蚀刻金属纹理与复杂的对称几何构图。利用精心雕琢的精细负面提示，约束生成中的结构畸变，保证每张牌面边框、符文与核心人物线条的古典雕刻美感。',
    duration: '30天',
    count: 24,
    tools: ['GPT-image-2.0', 'Photoshop (Vector Gold Mask)'],
    tags: [
      { label: 'Tarot Art', type: 'concept' },
      { label: 'Gold Etching', type: 'concept' },
      { label: 'Symmetric Control', type: 'tech' },
      { label: 'Detail Enhancer', type: 'tech' },
    ],
    images: [
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_00_back.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_00_frame.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_0_THE_FOOL.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_1_THE_MAGICIAN.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_2_THE_HIGH_PRIESTESS.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_3_THE_EMPRESS.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_4_THE_EMPEROR.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_5_THE_HIEROPHANT.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_6_THE_LOVERS.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_7_THE_CHARIOT.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_8_STRENGTH.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_9_THE_HERMIT.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_10_WHEEL_OF_FORTUNE.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_11_JUSTICE.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_12_THE_HANGED_MAN.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_13_DEATH.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_14_TEMPERANCE.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_15_THE_DEVIL.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_16_THE_TOWER.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_17_THE_STAR.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_18_THE_MOON.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_19_THE_SUN.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_20_JUDGEMENT.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/2_Tarot Cards/Tarot Cards_21_THE_WORLD.png',
    ]
  },
  {
    id: 'collage',
    title: '复古超现实拼贴视觉 (Surrealist Collage Series)',
    category: '混合媒介拼贴 / 超现实',
    bg: '融合古典雕塑、20世纪报刊、宇宙飞船与自然植被。将毫不相干的物理实体在超现实空间重构，创造出荒诞却带有哲学反思的叙事。',
    goal: '解决异质素材边缘融合与光影微调难题。利用深度图引导（ControlNet Depth）控制主体空间透视，结合图生图进行特定区域的“粗颗粒噪点”统一，重现实体剪贴的粗粝历史感。',
    duration: '10天',
    count: 4,
    tools: ['Midjourney v7', 'ControlNet Depth', 'Photoshop UI'],
    tags: [
      { label: 'Surrealism', type: 'concept' },
      { label: 'Mixed Media', type: 'concept' },
      { label: 'Depth Guided', type: 'tech' },
      { label: 'Noise Injection', type: 'tech' },
    ],
    images: [
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/3_Collage Visual/Collage Visual_1.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/3_Collage Visual/Collage Visual_2.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/3_Collage Visual/Collage Visual_3.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/3_Collage Visual/Collage Visual_4.png',
    ]
  },
  {
    id: 'stardust',
    title: 'Star Dust 像素系列 (Star Dust Pixel Series)',
    category: '像素美学 / 宇宙漫游',
    bg: '立足于复古未来主义，星尘像素系列将经典的8-bit像素艺术与高动态范围的现代色彩空间结合，描绘宇航员、深空废墟、星云以及孤寂的心灵漫游。',
    goal: '利用像素级粒子分布控制（AIGC Pixelization Noise Control），在保留低保真块面质感的同时，还原太空大跨度光影与粒子星尘的细腻过渡，打破传统像素画手工调色的色域局限。',
    duration: '21天',
    count: 12,
    tools: ['Stable Diffusion 1.5', 'Photoshop Beta (AI Generative Fill)', 'Aseprite'],
    tags: [
      { label: 'Pixel Art', type: 'concept' },
      { label: 'Space Brutalism', type: 'concept' },
      { label: 'High Saturated Control', type: 'tech' },
      { label: 'Generative Fill', type: 'tool' },
    ],
    
    images: [
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_1.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_2.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_3.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_4.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_5.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_6.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_7.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_8.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_9.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_10.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_11.png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/4_Star Dust/Star Dust_12.png',
    ]
  },
  {
    id: 'mayfly',
    title: '蜉蝣星梦邮票系列 (Mayfly Star-Dream Stamp Series)',
    category: '拟真微缩邮票 / 奇幻梦境',
    bg: '将经典的复古邮票边缘锯齿、微缩面额等细节与璀璨浩瀚的星空奇境相融合，描绘宇宙星尘中稍纵即逝的“蜉蝣般”梦境瞬间。',
    goal: '利用精细的主体长宽比限制与画幅外剪切控制（AIGC Stamp Edge Consistency），在1:1的画幅中，既展现邮票特有的斑驳锯齿物理质感，又还原奇幻星梦的瑰丽光效。',
    duration: '12天',
    count: 10,
    tools: ['Midjourney v6', 'Stable Diffusion 3.5', 'Photoshop (AI Generative Fill)'],
    tags: [
      { label: 'Stamp Art', type: 'concept' },
      { label: 'Fantasy Celestial', type: 'concept' },
      { label: 'Square Composition', type: 'tech' },
      { label: 'Stamp Edge Shader', type: 'tech' },
    ],
    images: [
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/5_Insect stamps/Insect stamps (1).png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/5_Insect stamps/Insect stamps (2).png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/5_Insect stamps/Insect stamps (3).png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/5_Insect stamps/Insect stamps (4).png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/5_Insect stamps/Insect stamps (5).png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/5_Insect stamps/Insect stamps (6).png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/5_Insect stamps/Insect stamps (7).png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/5_Insect stamps/Insect stamps (8).png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/5_Insect stamps/Insect stamps (9).png',
      '/1_Visual Aesthetics/1_Graphic Visual Series Projects/5_Insect stamps/Insect stamps (10).png',
    ]
  }
];

export const VIDEO_PROJECTS: VideoProject[] = [
  {
    id: 'jingke-qincike',
    title: 'AI短剧《拓本惊变之荆轲刺秦》',
    description: '以汉代画像石美学为视觉基底，对“荆轲刺秦王”进行现代化新编。故事在黑白拓片般的石纹世界中展开，还原古朴刚健的线条与叙事张力，让沉睡两千年的石刻“动起来”，演绎一场惊心动魄的刺秦传奇。',
    role: 'AIGC 导演 / 技术指导 / 场景分镜 / 动态控制',
    duration: '5:27',
    videoUrl: "/1_Visual Aesthetics/2_Video Series/Series Project/The_Turmoil_of_the_Tuoben_Jing_Ke's_Assassination_of_Qin.mp4",
    thumbnail: '',
    innovations: [
      '传统美学×AI生成：将汉代画像石的平面化构图、简练造型与黑白对比，融入动态视频，实现“石刻活化”。',
      '经典故事再演绎：在保留历史内核的同时，用当代视听语言重构冲突与情绪，探索AI赋能传统文化的新路径。'
    ],
    toolsCategories: [
      { category: '图像生成', tools: ['GPT-image-2.0', 'Nanobanana2', 'Flux（搭配汉代画像石风格LoRA）'] },
      { category: '视频生成', tools: ['Seedance2.0'] },
      { category: '音频制作', tools: ['剪映AI', 'CapCut'] },
      { category: '后期合成', tools: ['剪映'] }
    ],
    storyboard: [
      { time: '00:00 - 00:45', description: '【黑白石刻拓片】汉代画像石美学世界展开，石纹斑驳古朴，叙事序幕拉开。', video: '/1_Visual Aesthetics/2_Video Series/Segment Storyboard Showcase/Storyboard (1).mp4' },
      { time: '00:45 - 01:40', description: '【燕庭问策】孤注一掷的宿命托付，将国运系于一人之肩，凝练成历史苍凉底色。', video: '/1_Visual Aesthetics/2_Video Series/Segment Storyboard Showcase/Storyboard (2).mp4' },
      { time: '01:40 - 02:50', description: '【长叹应诺】一声沉郁长叹吐尽胸中块垒，孤身游侠终是颔首，必死宿命默默担起。', video: '/1_Visual Aesthetics/2_Video Series/Segment Storyboard Showcase/Storyboard (3).mp4' },
      { time: '02:50 - 03:50', description: '【易水送别】壮士一去兮不复还，风萧萧兮易水寒，高渐离击筑，荆轲慷慨悲歌。', video: '/1_Visual Aesthetics/2_Video Series/Segment Storyboard Showcase/Storyboard (4).mp4' },
      { time: '03:50 - 04:50', description: '【秦殿森严】咸阳道上车马如龙，帝国霸业的极致繁华与法度森严交相辉映。', video: '/1_Visual Aesthetics/2_Video Series/Segment Storyboard Showcase/Storyboard (5).mp4' },
      { time: '04:50 - 05:27', description: '【宫殿追逐】绕柱而走，画像石刚健线条高速演化，视觉张力拉满，千钧一发。', video: '/1_Visual Aesthetics/2_Video Series/Segment Storyboard Showcase/Storyboard (6).mp4' }
    ]
  }
];

export const MODELS_3D: Model3D[] = [
  { id: 'm1', title: 'Tree Monster', modelUrl: '/1_Visual Aesthetics/3_3D Model Series/1_tree_monster.glb', category: '暗黑树魔 / 机制角色', triangles: '124,500', renderer: 'Octane / Tripo3D', pbrPrompt: 'tree monster 3d model, detailed bark texture, glowing roots', wireframe: false },
  { id: 'm2', title: 'Blue and Purple Mechanical Bird', modelUrl: '/1_Visual Aesthetics/3_3D Model Series/2_blueandpurple_mechanical_bird.glb', category: '赛博机械 / 仿生飞禽', triangles: '89,200', renderer: 'Blender / Meshy', pbrPrompt: 'blue and purple mechanical bird, metallic feathers, gears', wireframe: false },
  { id: 'm3', title: 'Kong Fu Bear', modelUrl: '/1_Visual Aesthetics/3_3D Model Series/3_kong_fu_bear.glb', category: '国潮功夫 / 武侠角色', triangles: '156,000', renderer: 'Unreal Engine 5 / Luma', pbrPrompt: 'kung fu bear in martial arts pose, stylized 3d character', wireframe: false },
  { id: 'm4', title: 'Interstellar Rabbit', modelUrl: '/1_Visual Aesthetics/3_3D Model Series/4_Interstellar_Rabbit.glb', category: '星际探索 / 潮玩角色', triangles: '64,100', renderer: 'Keyshot / Luma Gen', pbrPrompt: 'interstellar rabbit in spacesuit, futuristic helmet', wireframe: false },
  { id: 'm5', title: 'Evil Wizard', modelUrl: '/1_Visual Aesthetics/3_3D Model Series/5_Evil_Wizard.glb', category: '暗黑魔法 / 邪恶法师', triangles: '210,000', renderer: 'Octane / Point-E', pbrPrompt: 'evil wizard with glowing staff, hooded robes', wireframe: false },
  { id: 'm6', title: 'Travelling Trader', modelUrl: '/1_Visual Aesthetics/3_3D Model Series/6_travelling_trader.glb', category: '流浪游商 / 角色模型', triangles: '115,000', renderer: 'Blender / CSM Generator', pbrPrompt: 'travelling trader with backpack, merchant attire', wireframe: false },
  { id: 'm7', title: 'Meshroom Man', modelUrl: '/1_Visual Aesthetics/3_3D Model Series/7_meshroomman.glb', category: '奇幻生物 / 蘑菇人', triangles: '98,400', renderer: 'ZBrush / Octane', pbrPrompt: 'meshroom man, mushroom cap head, organic texture', wireframe: false },
  { id: 'm8', title: 'Motorcycle 2', modelUrl: '/1_Visual Aesthetics/3_3D Model Series/8_motorcycle2.glb', category: '重型机车 / 赛博朋克', triangles: '185,000', renderer: 'Substance 3D / Blender', pbrPrompt: 'futuristic heavy motorcycle, glowing neon wheels', wireframe: false },
  { id: 'm9', title: 'A Corner of the Room', modelUrl: '/1_Visual Aesthetics/3_3D Model Series/9_a_corner_of_the_room.glb', category: '室内场景 / 空间微缩', triangles: '240,000', renderer: 'Blender Cycles', pbrPrompt: 'a cozy corner of a retro room, detailed furniture', wireframe: false },
  { id: 'm10', title: 'Pink Evil', modelUrl: '/1_Visual Aesthetics/3_3D Model Series/10_pink_evil.glb', category: '潮玩艺术 / 邪恶粉红', triangles: '132,000', renderer: 'Unreal Engine 5', pbrPrompt: 'pink evil vinyl toy character, glossy pink resin finish', wireframe: false },
  { id: 'm11', title: 'Pink Butterfly Baby', modelUrl: '/1_Visual Aesthetics/3_3D Model Series/11_pinkbutterfly_baby.glb', category: '梦幻角色 / 粉蝶宝贝', triangles: '148,000', renderer: 'ZBrush / Octane', pbrPrompt: 'pink butterfly baby with translucent wings, soft lighting', wireframe: false }
];

export const COMFY_WORKFLOWS: ComfyWorkflow[] = [
  {
    id: 'wf1',
    codeName: '1H-dance_builder_v5',
    title: 'dance_builder 舞蹈动作生成工作流',
    type: 'video',
    description: '本工作流基于 Wan 强大的大模型底座，通过堆叠专业 LoRA 解决了生成视频中肢体僵硬与物理失真的问题。利用 VACE 技术对视频的首尾帧状态、面部表情及空间透视进行精准约束，确保动作叙事连贯。最终经由超分与帧插值处理，直接输出清晰、流畅的舞蹈视频。',
    coreLogic: '输入参考 → VACE 首尾帧/面部/深度控制 → Wan 2.1 多LoRA 采样 → 2倍超分 + RIFE 插值',
    techStack: {
      baseModel: 'Wan 2.1 T2V-14B (14B 参数大模型)',
      loras: 'MoviiGen (运动生成), DetailEnhancer (细节增强), 物理动态 LoRA (肢体自然度)',
      controls: 'VACE 首尾帧控制, MediaPipe FaceMesh, DepthAnythingV2',
      postProcessing: 'RealESRGAN_x2plus, RIFE VFI (输出 50fps)'
    },
    designNotes: '本工作流基于 Wan 强大的大模型底座，通过堆叠专业 LoRA 解决了生成视频中肢体僵硬与物理失真的问题。利用 VACE 技术对视频的首尾帧状态、面部表情及空间透视进行精准约束，确保动作叙事连贯。最终经由超分与帧插值处理，直接输出清晰、流畅的舞蹈视频。',
    imageUrl: '/2_Technical Presentation/1_ComfyUI Workflow/1H-dance_builder_v5.png',
    nodesCount: 86,
    author: 'Stardust Lab'
  },
  {
    id: 'wf2',
    codeName: '1H-dance_extender_v5',
    title: 'dance_extender 视频无缝续接工作流',
    type: 'video',
    description: '该工作流旨在突破原始视频的时长限制，实现高保真的画面续写。通过精确提取上一视频片段的最后一帧作为新生成序列的起始锚点，并结合深度、姿态及面部网格的严格约束，系统能够预测并生成符合物理逻辑与角色特征的后继动作。配合针对动态优化的 LoRA 组，确保延展部分在动作流畅度与视觉质感上与原片保持高度一致，适用于长镜头生成或循环视频制作。',
    coreLogic: '提取前序视频末帧 → 多模态 (深度/姿态/面部) 联合约束 → VACE 单向生成 (无尾帧模式) → 无缝视频续接',
    techStack: {
      baseModel: 'Wan 2.1 T2V-14B',
      controls: 'WanVideoVACEStartToEndFrame (首帧驱动延展), DepthAnythingV2, DWPreprocessor, MediaPipe-FaceMesh',
      loras: 'LightX2V, MoviiGen, DetailEnhancer, sh4rpn3ss, Jelly-Hips (动态与质感增强)'
    },
    designNotes: '该工作流旨在突破原始视频的时长限制，实现高保真的画面续写。通过精确提取上一视频片段的最后一帧作为新生成序列的起始锚点，并结合深度、姿态及面部网格的严格约束，系统能够预测并生成符合物理逻辑与角色特征的后继动作。配合针对动态优化的 LoRA 组，确保延展部分在动作流畅度与视觉质感上与原片保持高度一致，适用于长镜头生成或循环视频制作。',
    imageUrl: '/2_Technical Presentation/1_ComfyUI Workflow/1H-dance_extender_v5.png',
    nodesCount: 92,
    author: 'Stardust Lab'
  },
  {
    id: 'wf3',
    codeName: '1H-WanVace_Background_trans_v2',
    title: '视频背景迁移与重绘',
    type: 'video',
    description: '该工作流专注于视频背景的高保真替换与风格迁移。通过分析参考图像自动提取背景遮罩，并利用 Florence-2 智能反推场景描述，结合 Wan强大的 VACE 模块，在严格保留前景人物动态细节的同时，实现背景环境的无缝重绘。流程支持原视频音频直接合成，适用于影视后期背景替换或虚拟场景生成的快速制作。',
    coreLogic: '加载视频与参考图 → 参考图背景分割 (RMBG) 生成遮罩 → Florence-2 自动反推环境提示词 → VACE 遮罩编码 → Wan 2.1 生成 → 音画合成',
    techStack: {
      baseModel: 'Wan 2.1-14B (FusionX VACE)',
      controls: 'VACE Masked Encoding (利用遮罩与参考图进行局部控制), Florence-2 (More Detailed Caption)',
      imageProcessing: 'TransparentBG (RMBG 背景移除), InvertMask, MaskBlur+',
      loras: 'LightX2V, DetailEnhancer, Jelly-Hips'
    },
    designNotes: '该工作流专注于视频背景的高保真替换与风格迁移。通过分析参考图像自动提取背景遮罩，并利用 Florence-2 智能反推场景描述，结合 Wan强大的 VACE 模块，在严格保留前景人物动态细节的同时，实现背景环境的无缝重绘。流程支持原视频音频直接合成，适用于影视后期背景替换或虚拟场景生成的快速制作。',
    imageUrl: '/2_Technical Presentation/1_ComfyUI Workflow/1H-WanVace_Background_trans_v2.png',
    nodesCount: 78,
    author: 'Stardust Lab'
  },
  {
    id: 'wf4',
    codeName: '1H-wanvideo_Fun_2_2_control-loop_v3.2',
    title: 'Wan 2.2 Fun-Control 双模型级联循环视频生成',
    type: 'video',
    description: '本工作流基于Wan 2.2 Fun-Control 架构，采用了 High/Low 双模型级联采样 策略。在循环分段处理过程中，利用 High 模型构建画面主体结构，再由 Low 模型进行细节填充，配合 DensePose 技术实现对视频姿态的精准控制。这种双引擎驱动的方式在保证高画质的同时显著提升了生成效率，末端经 GIMM 帧插值处理后，输出极致流畅的高帧率动态视频。',
    coreLogic: '视频分段循环 → DW 密集姿态控制 → 双模型级联采样 → GIMM 帧插值 → 视频合成',
    techStack: {
      baseModel: 'Wan 2.2 Fun-Control (A14B-HIGH & LOW FP8)',
      controls: 'DWPreprocessor (DensePose 姿态), WanVideoControlEmbeds',
      sampling: 'Cascade Sampling (双模型级联：High 结构 + Low 细节), DPM++ SDE',
      flow: 'Easy Loop (分段处理), GIMM-VFI (帧插值)'
    },
    designNotes: '本工作流基于Wan 2.2 Fun-Control 架构，采用了 High/Low 双模型级联采样 策略。在循环分段处理过程中，利用 High 模型构建画面主体结构，再由 Low 模型进行细节填充，配合 DensePose 技术实现对视频姿态的精准控制。这种双引擎驱动的方式在保证高画质的同时显著提升了生成效率，末端经 GIMM 帧插值处理后，输出极致流畅的高帧率动态视频。',
    imageUrl: '/2_Technical Presentation/1_ComfyUI Workflow/1H-wanvideo_Fun_2_2_control-loop_v3.2.png',
    nodesCount: 104,
    author: 'Stardust Lab'
  },
  {
    id: 'wf5',
    codeName: 'basic_controlnet',
    title: 'Openpose 姿态控制',
    type: 'image',
    description: '采用Openpose姿态检测技术实现对生成图像的精准姿态控制，展示基础 ControlNet的使用。',
    coreLogic: '文本提示输入 → Openpose姿态检测 → 姿态引导生成 → 图像输出',
    techStack: {
      baseModel: 'majicmixRealistic_v7.safetensors',
      controls: 'Openpose (姿态骨架)'
    },
    designNotes: '采用Openpose姿态检测技术实现对生成图像的精准姿态控制，展示基础 ControlNet的使用。',
    imageUrl: '/2_Technical Presentation/1_ComfyUI Workflow/basic_controlnet.png',
    videoUrl: '/2_Technical Presentation/1_ComfyUI Workflow/basic_controlnet.mp4',
    nodesCount: 32,
    author: 'Stardust Lab'
  },
  {
    id: 'wf6',
    codeName: 'basic_mask',
    title: '智能抠图图像生成',
    type: 'image',
    description: '本工作流采用Multi-ControlNet架构，通过双ControlNet模块实现多维度条件控制，结合SAM智能抠图技术实现精准的图像生成，展示基础蒙版效果实现。',
    coreLogic: '文本提示输入 → 多ControlNet条件控制 → SAM智能抠图 → 图像生成 → 结果输出',
    techStack: {
      baseModel: 'catCitronAnimeTreasure...',
      controls: 'ControlNet (双模型并行控制), SAM (智能分割)'
    },
    designNotes: '本工作流采用Multi-ControlNet架构，通过双ControlNet模块实现多维度条件控制，结合SAM智能抠图技术实现精准的图像生成，展示基础蒙版效果实现。',
    imageUrl: '/2_Technical Presentation/1_ComfyUI Workflow/basic_mask.png',
    videoUrl: '/2_Technical Presentation/1_ComfyUI Workflow/basic_mask.mp4',
    nodesCount: 45,
    author: 'Stardust Lab'
  },
  {
    id: 'wf7',
    codeName: 'Comfyui_in_PS',
    title: 'Photoshop 联动局部重绘',
    type: 'image',
    description: '本工作流基于ComfyUI与Photoshop的联动设计，通过SDPPP模块实现从Photoshop获取文档、图层、选区等数据，结合局部重绘（inpaint-cropandstitch）技术对图像进行精准的区域生成与编辑。在生成过程中，利用CLIP文本编码器处理提示词，K采样器控制生成细节，VAE解码将潜在空间数据转换为图像，最终通过SDPPP将结果回传至Photoshop指定图层，实现跨软件的图像编辑流程。这种设计适合需要结合传统图像编辑软件与AI生成能力的场景，确保生成内容与现有作品的精准融合。',
    coreLogic: 'Photoshop数据输入 → 局部重绘生成 → 数据回传Photoshop输出',
    techStack: {
      baseModel: 'catCitronAnimeTreasure (Checkpoint加载器)',
      controls: 'SDPPP (Photoshop数据交互), comfyui-inpaint-cropandstitch (局部重绘)'
    },
    designNotes: '本工作流基于ComfyUI与Photoshop的联动设计，通过SDPPP模块实现从Photoshop获取文档、图层、选区等数据，结合局部重绘（inpaint-cropandstitch）技术对图像进行精准的区域生成与编辑。在生成过程中，利用CLIP文本编码器处理提示词，K采样器控制生成细节，VAE解码将潜在空间数据转换为图像，最终通过SDPPP将结果回传至Photoshop指定图层，实现跨软件的图像编辑流程。这种设计适合需要结合传统图像编辑软件与AI生成能力的场景，确保生成内容与现有作品的精准融合。',
    imageUrl: '/2_Technical Presentation/1_ComfyUI Workflow/Comfyui_in_PS.png',
    videoUrl: '/2_Technical Presentation/1_ComfyUI Workflow/Comfyui_in_PS.mp4',
    nodesCount: 58,
    author: 'Stardust Lab'
  }
];

export const BRAND_EDIT_IMAGES = [
  { 
    title: '电商产品背景', 
    enTitle: 'E-COMMERCE PRODUCT BACKGROUND',
    description: '专为电商摄影与商业场景设计。精准重构产品的光影、自然阴影与材质，快速合成具备真实商业质感的棚拍与生活化产品展现图。', 
    tag: 'LIGHTING & SHADOW REFRACTION',
    beforeImages: [
      '/3_Commercial Application Cases/1_Image Adjustment/2_Background Replacement/original.jpg',
    ],
    images: [
      '/3_Commercial Application Cases/1_Image Adjustment/2_Background Replacement/product_bg_1.png',
      '/3_Commercial Application Cases/1_Image Adjustment/2_Background Replacement/product_bg_2.png',
      '/3_Commercial Application Cases/1_Image Adjustment/2_Background Replacement/product_bg_3.png',
      '/3_Commercial Application Cases/1_Image Adjustment/2_Background Replacement/product_bg_4.png',
      '/3_Commercial Application Cases/1_Image Adjustment/2_Background Replacement/product_bg_5.png',
      '/3_Commercial Application Cases/1_Image Adjustment/2_Background Replacement/product_bg_6.png',
    ] 
  },
  { 
    title: '万物迁移', 
    enTitle: 'UNIVERSAL STYLE & MATERIAL MIGRATION',
    description: '实现任何物图像的精确迁移，实现跨载体的创意重构。', 
    tag: 'CROSS-MATERIAL TRANSFER',
    beforeImages: [
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_original_1.png',
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_original_2.jpg',
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_original_3.jpg',
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_original_4.jpg',
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_original_5.png',
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_original_6.png',
    ],
    images: [
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_1.jpg',
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_2.png',
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_3.png',
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_4.png',
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_5.png',
      '/3_Commercial Application Cases/1_Image Adjustment/1_Migration/migrate_6.jpeg',
    ] 
  },
  { 
    title: '视觉风格切换', 
    enTitle: 'VISUAL STYLE & AESTHETIC SWITCHING',
    description: '在保持核心主体形态、特征与画面构图严格不变的前提下，对整体视觉风格进行快速切换与多元化演绎，满足多场景的视觉衍生需求。', 
    tag: 'STYLE & ATMOSPHERE SWAP',
    beforeImages: [
      '/3_Commercial Application Cases/1_Image Adjustment/3_Style Transfer/style_original.png',
    ],
    images: [
      '/3_Commercial Application Cases/1_Image Adjustment/3_Style Transfer/style_1.png',
      '/3_Commercial Application Cases/1_Image Adjustment/3_Style Transfer/style_2.png',
      '/3_Commercial Application Cases/1_Image Adjustment/3_Style Transfer/style_3.png',
      '/3_Commercial Application Cases/1_Image Adjustment/3_Style Transfer/style_4.png',
      '/3_Commercial Application Cases/1_Image Adjustment/3_Style Transfer/style_5.png',
      '/3_Commercial Application Cases/1_Image Adjustment/3_Style Transfer/style_6.png',
    ] 
  }
];

export const BRAND_GENERATE_IMAGES = [
  { 
    id: 'theme_visual',
    type: '主题视觉设计', 
    aspectRatio: '16:9',
    aspectClass: 'aspect-[16/9]',
    description: '主视觉与 KV 艺术海报整体方案，注重画面故事感与概念张力。',
    images: [
      '/3_Commercial Application Cases/2_Creative Implementation/Theme_vision/Theme_vision1.png',
      '/3_Commercial Application Cases/2_Creative Implementation/Theme_vision/Theme_vision2.png',
      '/3_Commercial Application Cases/2_Creative Implementation/Theme_vision/Theme_vision3.png',
      '/3_Commercial Application Cases/2_Creative Implementation/Theme_vision/Theme_vision4.png',
    ] 
  },
  { 
    id: 'ip_mascot',
    type: 'IP 形象定制', 
    aspectRatio: '16:9',
    aspectClass: 'aspect-[16/9]',
    description: '品牌吉祥物与 3D 角色 IP 延展，包含三视图、表情包与动态姿态。',
    images: [
      '/3_Commercial Application Cases/2_Creative Implementation/IP/IP1.png',
      '/3_Commercial Application Cases/2_Creative Implementation/IP/IP2.png',
      '/3_Commercial Application Cases/2_Creative Implementation/IP/IP3.png',
      '/3_Commercial Application Cases/2_Creative Implementation/IP/IP4.png',
    ] 
  },
  { 
    id: 'vi_system',
    type: 'VI 延展设计', 
    aspectRatio: '21:9',
    aspectClass: 'aspect-[21/9]',
    description: '全套企业视觉识别系统，涵盖名片、办公用品、环境指引及应用延展。',
    images: [
      '/3_Commercial Application Cases/2_Creative Implementation/VI/VI1.png',
      '/3_Commercial Application Cases/2_Creative Implementation/VI/VI2.png',
      '/3_Commercial Application Cases/2_Creative Implementation/VI/VI3.png',
      '/3_Commercial Application Cases/2_Creative Implementation/VI/VI4.png',
    ] 
  },
  { 
    id: 'banners',
    type: 'Banner 广告', 
    aspectRatio: '21:9',
    aspectClass: 'aspect-[21/9]',
    description: '全渠道线上投放高转化横幅，精准重构商品光影与波普构图。',
    images: [
      '/3_Commercial Application Cases/2_Creative Implementation/Banner/618banner (1).jpeg',
      '/3_Commercial Application Cases/2_Creative Implementation/Banner/618banner (2).jpeg',
      '/3_Commercial Application Cases/2_Creative Implementation/Banner/618banner (3).jpeg',
      '/3_Commercial Application Cases/2_Creative Implementation/Banner/618banner (4).jpeg',
    ] 
  }
];
