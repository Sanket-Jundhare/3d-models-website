import { useRef, useState, useEffect } from "react";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export default function Model({ file, preview = false }) {
  const { scene } = useGLTF(file);
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [, setScale] = useState(1);

  // Auto-rotate effect for preview
  useFrame(() => {
    if (preview && groupRef.current && !isHovered) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  useEffect(() => {
    if (scene) {
      const box = new Box3().setFromObject(scene);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());
      
      scene.position.sub(center);
      const newScale = preview 
        ? 1.8 / Math.max(size.x, size.y, size.z)
        : 1.5 / Math.max(size.x, size.y, size.z);
      
      scene.scale.setScalar(newScale);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScale(newScale);
    }
  }, [scene, preview]);

  return (
    <>
      <group 
        ref={groupRef}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        scale={preview ? [0.9, 0.9, 0.9] : [1, 1, 1]}
      >
        <primitive 
          object={scene} 
          castShadow 
          receiveShadow
        />
      </group>

      {/* Enhanced lighting */}
      <ambientLight intensity={preview ? 0.6 : 0.4} />
      <pointLight 
        position={[5, 5, 5]} 
        intensity={preview ? 0.8 : 1}
        color={preview ? "#ffffff" : "#f5f5f5"}
      />
      <pointLight 
        position={[-5, -5, -5]} 
        intensity={0.3}
        color="#3b82f6"
      />

      {/* Controls only for non-preview */}
      {!preview && (
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={0.5}
          maxDistance={10}
          enableZoom
          enablePan
        />
      )}
    </>
  );
}