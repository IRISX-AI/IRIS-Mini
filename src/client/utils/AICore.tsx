import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const DualSphere = ({ isPlaying }: { isPlaying: boolean }) => {
  const outerRef = useRef<THREE.Points>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRef.current && innerRef.current) {
      // Smooth rotation
      const speed = isPlaying ? 0.5 : 0.1;
      outerRef.current.rotation.y += delta * speed;
      outerRef.current.rotation.x += delta * (speed * 0.2);
      innerRef.current.rotation.y -= delta * (speed * 0.5);

      // Slight breathing effect when playing audio
      const scale = isPlaying
        ? 1 + Math.sin(state.clock.elapsedTime * 4) * 0.02
        : 1;
      outerRef.current.scale.setScalar(scale);
    }
  });

  const green = "#00ff41";

  return (
    <group>
      {/* Inner Solid Core (Dark) */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshBasicMaterial color="#020a04" />
      </mesh>

      {/* Outer Dotted Shell (Matches your image's grid pattern) */}
      <points ref={outerRef}>
        <sphereGeometry args={[3, 48, 48]} />
        <pointsMaterial
          size={0.03}
          color={green}
          transparent
          opacity={isPlaying ? 0.8 : 0.3}
        />
      </points>
    </group>
  );
};

const AICore = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <DualSphere isPlaying={isPlaying} />
      </Canvas>
    </div>
  );
};

export default AICore;
