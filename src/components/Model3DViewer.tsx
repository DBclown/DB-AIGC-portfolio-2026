import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment } from '@react-three/drei';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';
import { assetManager } from '../utils/assetManager';

interface Model3DViewerProps {
  modelId: string;
  modelUrl?: string;
  showWireframe: boolean;
  themeColor?: string; // e.g. '#CE0F51' or '#024C38'
}

// GLTF Model Component
function GLTFModel({ url, showWireframe, themeColor, onLoaded }: { url: string, showWireframe: boolean, themeColor: string, onLoaded: () => void }) {
  const { scene } = useGLTF(url);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (scene) {
      onLoaded();
    }
    
    // Skip material processing if already initialized with same wireframe state
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Backup original material
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }

        // Disable frustum culling for better performance with auto-rotating models
        child.frustumCulled = false;

        if (showWireframe) {
          // Switch to wireframe material
          child.material = new THREE.MeshBasicMaterial({
            color: themeColor,
            wireframe: true,
          });
        } else {
          // Restore original material
          child.material = child.userData.originalMaterial;
        }
      }
    });
  }, [scene, showWireframe, themeColor, onLoaded]);

  return <primitive object={scene} />;
}

// Retro style loading placeholder
function LoadingPlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-10">
      <div className="w-10 h-10 border-4 border-[#024C38]/20 border-t-[#CE0F51] rounded-full animate-spin mb-3"></div>
      <div className="font-mono text-[10px] font-black text-[#024C38] tracking-widest bg-[#F3D03B] px-2 py-1 retro-border-sm shadow-[2px_2px_0px_0px_#024C38]">
        LOADING ASSET...
      </div>
    </div>
  );
}

export default function Model3DViewer({ modelId, modelUrl, showWireframe, themeColor = '#024C38' }: Model3DViewerProps) {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isReadyToRender, setIsReadyToRender] = useState(false);

  // Lazy loading: only render 3D Canvas when scrolled into view
  // triggerOnce: false means Canvas unmounts when card scrolls away, saving GPU resources
  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: '100px 0px', // Preload when 100px from viewport for smoother experience
  });

  // Preload model via assetManager sequentially when inView triggers
  // Models are loaded one at a time to avoid network saturation
  useEffect(() => {
    if (!inView || !modelUrl) return;

    let isCancelled = false;

    // Use assetManager's loadModelSequential to preload .glb files one by one
    assetManager.loadModelSequential(modelUrl).then(() => {
      if (!isCancelled) {
        setIsReadyToRender(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [inView, modelUrl]);

  return (
    <div ref={ref} className="w-full h-full relative select-none">
      {/* Background CAD-grid blueprint lines */}
      <div className="absolute inset-0 bg-radial-blueprint pointer-events-none opacity-[0.13]" />

      {/* Grid crosshairs overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[85%] h-[1px] bg-[#024C38] border-t border-dashed border-[#024C38]" />
        <div className="h-[85%] w-[1px] bg-[#024C38] border-l border-dashed border-[#024C38] absolute" />
      </div>

      {/* Render 3D Canvas only when model is cached in browser */}
      {inView && modelUrl && isReadyToRender && (
        <>
          {isModelLoading && <LoadingPlaceholder />}
          <Canvas
            camera={{ position: [0, 0, 2.5], fov: 45 }}
            className={`relative z-10 transition-opacity duration-500 cursor-grab active:cursor-grabbing ${isModelLoading ? 'opacity-0' : 'opacity-100'}`}
            gl={{ 
              antialias: true, 
              alpha: true, 
              preserveDrawingBuffer: false, // Disable to save GPU memory
              powerPreference: 'high-performance', // Request high-performance GPU
              failIfMajorPerformanceCaveat: false, // Don't fail if GPU is not ideal
            }}
            // Use 'demand' frameloop - only render when needed (auto-rotation counts as demand)
            frameloop="demand"
            // Optimize rendering performance
            dpr={[1, 1.5]} // Limit pixel ratio to 1.5x max for performance
          >
            {/* Lighting Setup - simplified for performance */}
            <ambientLight intensity={1.0} /> {/* Reduced from 1.5 */}
            <directionalLight position={[5, 5, 5]} intensity={1.5} /> {/* Reduced from 2 */}
            <directionalLight position={[-5, -5, -5]} intensity={0.3} /> {/* Reduced from 0.5 */}
            {/* Use a simpler environment for better performance */}
            <Environment preset="studio" /> {/* Changed from 'city' to 'studio' for simpler lighting */}
            
            {/* Centered Model with internal Suspense */}
            <Suspense fallback={null}>
              <Center>
                <GLTFModel 
                  url={modelUrl} 
                  showWireframe={showWireframe} 
                  themeColor={themeColor} 
                  onLoaded={() => setIsModelLoading(false)} 
                />
              </Center>
            </Suspense>

            {/* Camera Controls */}
            <OrbitControls 
              autoRotate 
              autoRotateSpeed={2.0}
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              makeDefault
            />
          </Canvas>
        </>
      )}
    </div>
  );
}
