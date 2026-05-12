import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const DualSphere = ({
  isConnected,
  isSpeaking,
}: {
  isConnected: boolean;
  isSpeaking: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  const timeRef = useRef(0);

  const animState = useRef({ amplitude: 0.02, scale: 1.0, speed: 0.5 });

  const { positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(6000 * 3);
    const orig = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 1.6;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }
    return { positions: pos, originalPositions: orig };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !pointsRef.current || !innerRef.current) return;

    const targetAmplitude = isSpeaking ? 0.3 : isConnected ? 0.08 : 0.02;
    const targetScale = isSpeaking ? 1.2 : 1.0;
    const targetSpeed = isSpeaking ? 3.5 : isConnected ? 1.0 : 0.2;

    animState.current.amplitude = THREE.MathUtils.lerp(
      animState.current.amplitude,
      targetAmplitude,
      0.1,
    );
    animState.current.scale = THREE.MathUtils.lerp(
      animState.current.scale,
      targetScale,
      0.1,
    );
    animState.current.speed = THREE.MathUtils.lerp(
      animState.current.speed,
      targetSpeed,
      0.05,
    );

    timeRef.current += delta * animState.current.speed;
    const t = timeRef.current;

    const targetX = state.mouse.y * 0.5;
    const targetY = state.mouse.x * 0.5;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.05,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.05,
    );

    innerRef.current.rotation.y -= delta * (isConnected ? 0.5 : 0.1);
    pointsRef.current.rotation.y += delta * (isConnected ? 0.2 : 0.05);

    pointsRef.current.scale.setScalar(animState.current.scale);

    const positionsArray = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < 6000; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const origX = originalPositions[ix];
      const origY = originalPositions[iy];
      const origZ = originalPositions[iz];

      const dist = Math.sqrt(origX * origX + origY * origY + origZ * origZ);

      const waveY = Math.sin(origY * 5 + t);
      const waveX = Math.cos(origX * 3 + t * 0.8);

      const wave = (waveY + waveX) * 0.5 * animState.current.amplitude;

      const jitter = isSpeaking ? Math.random() * 0.02 : 0;
      const factor = (dist + wave + jitter) / dist;

      positionsArray[ix] = origX * factor;
      positionsArray[iy] = origY * factor;
      positionsArray[iz] = origZ * factor;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    const corePulse = isSpeaking ? Math.sin(t * 5) * 0.05 : Math.sin(t) * 0.03;
    innerRef.current.scale.setScalar(isConnected ? 1 + corePulse : 1);
  });

  const outerColor = isConnected ? "#00ff41" : "#555555";
  const innerColor = isConnected ? "#002b12" : "#111111";

  return (
    <group ref={groupRef}>
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshStandardMaterial
          color={innerColor}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <points ref={pointsRef}>
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
          size={0.012}
          color={outerColor}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

const AICore = ({
  isConnected,
  isSpeaking,
}: {
  isConnected: boolean;
  isSpeaking: boolean;
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 7], fov: 45 }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={3} />
        <DualSphere isConnected={isConnected} isSpeaking={isSpeaking} />
      </Canvas>
    </div>
  );
};

export default AICore;
