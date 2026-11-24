import { useEffect, useMemo } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Box3, Group, Vector3 } from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

function contentBounds(root) {
  root.updateMatrixWorld(true);

  const meshes = [];
  root.traverse((child) => {
    if (!child.isMesh) return;
    const box = new Box3().setFromObject(child);
    const size = box.getSize(new Vector3());
    const max = Math.max(size.x, size.y, size.z);
    const min = Math.min(size.x, size.y, size.z);
    if (max > 0) meshes.push({ child, box, max, min });
  });

  if (!meshes.length) return new Box3().setFromObject(root);

  const maxes = meshes.map((mesh) => mesh.max).sort((a, b) => a - b);
  const median = maxes[Math.floor((maxes.length - 1) / 2)];
  const kept = meshes.filter((mesh) => {
    const flatGround = mesh.min < mesh.max * 0.05 && mesh.max > median * 4;
    return !flatGround;
  });
  const visible = kept.length ? kept : meshes;

  for (const mesh of meshes) {
    mesh.child.visible = visible.includes(mesh);
  }

  const box = new Box3();
  box.makeEmpty();
  for (const mesh of visible) box.union(mesh.box);
  return box;
}

export default function Model({ file, preview = false }) {
  const { scene, animations } = useGLTF(file);

  const clone = useMemo(() => {
    const cloned = cloneSkeleton(scene);
    const box = contentBounds(cloned);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    cloned.position.sub(center);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const pivot = new Group();
    pivot.scale.setScalar((preview ? 1.7 : 2.1) / maxDim);
    pivot.add(cloned);
    return pivot;
  }, [scene, preview]);

  const { actions } = useAnimations(animations, clone.children[0] || clone);

  useEffect(() => {
    const clips = Object.values(actions).filter(Boolean);
    if (!clips.length) return undefined;

    const walk = clips.find((action) =>
      /walk|idle|run/i.test(action.getClip()?.name || "")
    );
    const clip = walk || clips[0];
    clip.reset().fadeIn(0.2).play();

    return () => {
      clip.fadeOut(0.2);
    };
  }, [actions]);

  return <primitive object={clone} />;
}
