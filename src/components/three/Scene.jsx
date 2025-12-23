import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import Model from "./Model";
import Loader from "../ui/Loader";

export default function Scene({ file, preview = false }) {
  return (
    <Canvas
      camera={{
        position: preview ? [0, 0, 3] : [0, 1.5, 5],
        fov: preview ? 45 : 50
      }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <Suspense fallback={<Loader />}>
        <Model file={file} />
      </Suspense>

      <OrbitControls
        autoRotate={preview}
        enableZoom={!preview}
        enablePan={!preview}
      />

      <Environment preset="studio" />
    </Canvas>
  );
}
