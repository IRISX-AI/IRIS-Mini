import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const HolographicSphere = ({ isConnected }: { isConnected: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (
      groupRef.current &&
      outerRef.current &&
      innerRef.current &&
      ringRef.current
    ) {
      // 1. The Float Effect (Bobbing up and down)
      const time = state.clock.elapsedTime;
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.15; // Smooth floating

      // 2. The Rotation
      const speed = isConnected ? 0.8 : 0.2;
      outerRef.current.rotation.y += delta * speed;
      outerRef.current.rotation.z += delta * (speed * 0.2);

      innerRef.current.rotation.y -= delta * (speed * 0.8);
      ringRef.current.rotation.z -= delta * speed;

      // 3. The Pulse (Breathing)
      const breath = isConnected ? 1 + Math.sin(time * 3) * 0.05 : 1;
      innerRef.current.scale.setScalar(breath);
    }
  });

  const activeColor = new THREE.Color("#00ff41");
  const idleColor = new THREE.Color("#003311");
  const color = isConnected ? activeColor : idleColor;

  return (
    <group ref={groupRef}>
      {/* Outer Data Grid (Wireframe) */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[2.5, 24, 24]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={isConnected ? 0.2 : 0.05}
        />
      </mesh>

      {/* Equatorial Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.0, 0.02, 16, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isConnected ? 0.5 : 0.1}
        />
      </mesh>

      {/* Inner Solid Core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isConnected ? 0.8 : 0.2}
        />
      </mesh>
    </group>
  );
};

const AICore = ({ isConnected }: { isConnected: boolean }) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <HolographicSphere isConnected={isConnected} />
      </Canvas>
    </div>
  );
};

export default AICore;
