import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const DualSphere = ({ isConnected }: { isConnected: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  // We store the original positions so we can calculate smooth waves without permanently distorting the sphere
  const { positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(6000 * 3);
    const orig = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 1.6; // Base radius

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

    const time = state.clock.elapsedTime;
    const speed = isConnected ? 1.5 : 0.5;

    // --- 1. MOUSE INTERACTION ---
    // state.mouse goes from -1 to 1. We lerp (smoothly transition) the rotation to track the mouse.
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

    // --- 2. BASE ROTATION ---
    innerRef.current.rotation.y -= delta * (isConnected ? 0.4 : 0.1);
    pointsRef.current.rotation.y += delta * (isConnected ? 0.2 : 0.05);

    // --- 3. THE WAVE EFFECT ---
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

      // Calculate a wave that ripples vertically.
      // High amplitude when connected, almost completely flat when disconnected.
      const waveAmplitude = isConnected ? 0.12 : 0.01;
      const wave = Math.sin(origY * 4 + time * speed) * waveAmplitude;

      const factor = (dist + wave) / dist;

      positionsArray[ix] = origX * factor;
      positionsArray[iy] = origY * factor;
      positionsArray[iz] = origZ * factor;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // --- 4. SUBTLE BREATHING ---
    const scale = isConnected ? 1 + Math.sin(time * 2) * 0.03 : 1;
    innerRef.current.scale.setScalar(scale);
  });

  // Toned down inner core: Deep, professional dark green. Grayscale when off.
  const outerColor = isConnected ? "#00ff41" : "#555555";
  const innerColor = isConnected ? "#002b12" : "#111111";

  return (
    <group ref={groupRef}>
      {/* Inner Solid Core (Sleek, Dark, Metallic) */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshStandardMaterial
          color={innerColor}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Organic Particle Wave Shell */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
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

const AICore = ({ isConnected }: { isConnected: boolean }) => {
  return (
    // Removed 'pointer-events-none' so it can actually detect the mouse hover
    <div className="absolute inset-0 flex items-center justify-center">
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 7], fov: 45 }}
      >
        {/* Lights added so the meshStandardMaterial looks 3D and catches light */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={3} />
        <DualSphere isConnected={isConnected} />
      </Canvas>
    </div>
  );
};

export default AICore;
