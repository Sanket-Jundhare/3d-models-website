import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Model from "./Model";
import Loader from "../ui/Loader";

export default function Scene({ file, preview = false }) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%", display: "block" }}
      dpr={preview ? [1, 1.25] : [1, 1.75]}
      camera={{
        position: preview ? [0, 0.35, 3.4] : [0, 0.8, 4.6],
        fov: preview ? 42 : 45,
      }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 5]} intensity={1.8} />
      <directionalLight position={[-4, 2, -2]} intensity={0.45} />

      <Suspense fallback={<Loader />}>
        <Model file={file} preview={preview} />
      </Suspense>

      <OrbitControls
        makeDefault
        autoRotate={preview}
        autoRotateSpeed={1.4}
        enableZoom={!preview}
        enablePan={!preview}
        enableRotate={!preview}
      />
    </Canvas>
  );
}
