export interface Tag {
  label: string;
  type: 'tech' | 'tool' | 'concept';
}

export interface BaseProject {
  id: string;
  title: string;
  category: string;
  bg: string; // Project Background description
  goal: string; // Design Goal description
  tags: Tag[];
  tools: string[];
  duration: string;
  count: number;
  images: string[];
}

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  role: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  innovations?: string[];
  toolsCategories?: {
    category: string;
    tools: string[];
  }[];
  storyboard: {
    time: string;
    description: string;
    video: string;
  }[];
}

export interface Model3D {
  id: string;
  title: string;
  modelUrl: string;
  category: string;
  triangles: string;
  renderer: string;
  pbrPrompt: string;
  wireframe: boolean;
}

export interface ComfyWorkflow {
  id: string;
  codeName?: string;
  title: string;
  type: 'image' | 'video';
  description: string;
  coreLogic?: string;
  techStack?: {
    baseModel?: string;
    loras?: string;
    controls?: string;
    sampling?: string;
    flow?: string;
    imageProcessing?: string;
    postProcessing?: string;
  };
  designNotes?: string;
  videoUrl?: string;
  imageUrl: string;
  nodesCount: number;
  author: string;
}
