import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const DualSphere = ({ isConnected }: { isConnected: boolean }) => {
  const outerRef = useRef<THREE.Points>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  // Generate organic particles for the outer shell instead of a rigid grid
  const [positions] = useMemo(() => {
    const pos = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 2.4; // Shrunk outer radius
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (outerRef.current && innerRef.current) {
      const speed = isConnected ? 0.3 : 0.05;
      outerRef.current.rotation.y += delta * speed;
      outerRef.current.rotation.x += delta * (speed * 0.15);
      innerRef.current.rotation.y -= delta * (speed * 0.4);

      const scale = isConnected
        ? 1 + Math.sin(state.clock.elapsedTime * 3) * 0.015
        : 1;
      outerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial color="#020a04" />
      </mesh>

      <points ref={outerRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
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
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 7], fov: 45 }}
      >
        <DualSphere isConnected={isConnected} />
      </Canvas>
    </div>
  );
};

export default AICore;
