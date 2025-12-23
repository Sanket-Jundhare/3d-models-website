import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Loader({ size = 1, color = "#3b82f6", speed = 2 }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Animated wireframe sphere */}
      <mesh scale={size}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial 
          color={color} 
          wireframe 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Inner rotating rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3 * size, 0.5 * size, 32]} />
        <meshBasicMaterial 
          color={color} 
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.3 * size, 0.5 * size, 32]} />
        <meshBasicMaterial 
          color={color} 
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Glowing particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * Math.PI / 6) * 1.2 * size,
            Math.cos(i * Math.PI / 6) * 1.2 * size,
            0
          ]}
        >
          <sphereGeometry args={[0.05 * size, 8, 8]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {/* Background glow */}
      <pointLight 
        color={color} 
        intensity={0.5} 
        distance={5 * size}
      />
    </group>
  );
}