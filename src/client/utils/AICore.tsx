import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const ParticleSphere = ({ isConnected }: { isConnected: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 2.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const speed = isConnected ? 0.4 : 0.05;
      pointsRef.current.rotation.y += delta * speed;
      pointsRef.current.rotation.x += delta * (speed * 0.2);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions as Float32Array, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color={isConnected ? "#00ff41" : "#004411"}
        transparent
        opacity={isConnected ? 0.9 : 0.3}
        sizeAttenuation
      />
    </points>
  );
};

const AICore = ({ isConnected }: { isConnected: boolean }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ParticleSphere isConnected={isConnected} />
      </Canvas>
    </div>
  );
};

export default AICore;
