import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const DualSphere = ({ isConnected }: { isConnected: boolean }) => {
  const outerRef = useRef<THREE.Points>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRef.current && innerRef.current) {
      // Smooth, deliberate rotation
      const speed = isConnected ? 0.3 : 0.05;
      outerRef.current.rotation.y += delta * speed;
      outerRef.current.rotation.x += delta * (speed * 0.15);

      innerRef.current.rotation.y -= delta * (speed * 0.4);

      // Subtle pulsing breathing effect when connected
      const scale = isConnected
        ? 1 + Math.sin(state.clock.elapsedTime * 3) * 0.015
        : 1;
      outerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* --- INNER SOLID CORE --- */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[2.0, 64, 64]} />
        {/* Dark, subtle core to block the back particles */}
        <meshBasicMaterial color="#030a05" />
      </mesh>

      {/* --- OUTER STRUCTURED PARTICLE SHELL --- */}
      <points ref={outerRef}>
        {/* Using 72x72 segments creates that perfect grid/lattice of dots */}
        <sphereGeometry args={[2.8, 72, 72]} />
        <pointsMaterial
          size={0.02}
          color={isConnected ? "#00ff41" : "#004411"}
          transparent
          opacity={isConnected ? 0.8 : 0.2}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

const AICore = ({ isConnected }: { isConnected: boolean }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <DualSphere isConnected={isConnected} />
      </Canvas>
    </div>
  );
};

export default AICore;
