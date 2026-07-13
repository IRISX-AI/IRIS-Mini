import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

// 1. Sphere Generator
const generateSphere = (count = 6000): Float32Array => {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = 1.8;
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
};

// 2. DNA Double Helix Generator
const generateDNA = (count = 6000): Float32Array => {
  const arr = new Float32Array(count * 3);
  const strandCount = 2300;
  const rungCount = 1400;
  const r = 1.0; 
  const L = 2.0; 
  const turns = 3.0; 

  // Strand A
  for (let i = 0; i < strandCount; i++) {
    const frac = i / strandCount;
    const theta = frac * Math.PI * 2 * turns - Math.PI * turns;
    const y = (frac * 2 - 1) * L;
    arr[i * 3] = Math.cos(theta) * r;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = Math.sin(theta) * r;
  }

  // Strand B
  for (let i = 0; i < strandCount; i++) {
    const idx = strandCount + i;
    const frac = i / strandCount;
    const theta = frac * Math.PI * 2 * turns - Math.PI * turns + Math.PI;
    const y = (frac * 2 - 1) * L;
    arr[idx * 3] = Math.cos(theta) * r;
    arr[idx * 3 + 1] = y;
    arr[idx * 3 + 2] = Math.sin(theta) * r;
  }

  // Base pair connecting rungs
  for (let i = 0; i < rungCount; i++) {
    const idx = strandCount * 2 + i;
    const frac = Math.random();
    const theta = frac * Math.PI * 2 * turns - Math.PI * turns;
    const y = (frac * 2 - 1) * L;
    const lerpFrac = Math.random(); 
    const ax = Math.cos(theta) * r;
    const az = Math.sin(theta) * r;
    const bx = Math.cos(theta + Math.PI) * r;
    const bz = Math.sin(theta + Math.PI) * r;

    arr[idx * 3] = ax + (bx - ax) * lerpFrac;
    arr[idx * 3 + 1] = y;
    arr[idx * 3 + 2] = az + (bz - az) * lerpFrac;
  }

  return arr;
};

// Helper to uniformly sample a triangle
const sampleTriangle = (A: THREE.Vector3, B: THREE.Vector3, C: THREE.Vector3): THREE.Vector3 => {
  const r1 = Math.random();
  const r2 = Math.random();
  const sqrtR1 = Math.sqrt(r1);
  const x = A.x * (1 - sqrtR1) + B.x * (sqrtR1 * (1 - r2)) + C.x * (r2 * sqrtR1);
  const y = A.y * (1 - sqrtR1) + B.y * (sqrtR1 * (1 - r2)) + C.y * (r2 * sqrtR1);
  const z = A.z * (1 - sqrtR1) + B.z * (sqrtR1 * (1 - r2)) + C.z * (r2 * sqrtR1);
  return new THREE.Vector3(x, y, z);
};

// 3. Telegram (Paper Plane) Generator
const generateTelegram = (count = 6000): Float32Array => {
  const arr = new Float32Array(count * 3);
  const nose = new THREE.Vector3(1.3, 0, 0);
  const leftTip = new THREE.Vector3(-1.0, 0.9, 0);
  const rightTip = new THREE.Vector3(-1.0, -0.9, 0);
  const tailCenter = new THREE.Vector3(-0.3, 0, 0);
  const innerFold = new THREE.Vector3(-0.7, -0.4, 0);

  const count1 = 2500;
  for (let i = 0; i < count1; i++) {
    const p = sampleTriangle(nose, leftTip, tailCenter);
    arr[i * 3] = p.x;
    arr[i * 3 + 1] = p.y;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  const count2 = 2500;
  for (let i = 0; i < count2; i++) {
    const p = sampleTriangle(nose, rightTip, tailCenter);
    arr[(count1 + i) * 3] = p.x;
    arr[(count1 + i) * 3 + 1] = p.y;
    arr[(count1 + i) * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  const count3 = 1000;
  for (let i = 0; i < count3; i++) {
    const p = sampleTriangle(leftTip, tailCenter, innerFold);
    arr[(count1 + count2 + i) * 3] = p.x;
    arr[(count1 + count2 + i) * 3 + 1] = p.y;
    arr[(count1 + count2 + i) * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  return arr;
};

// 4. WhatsApp Generator
const generateWhatsApp = (count = 6000): Float32Array => {
  const arr = new Float32Array(count * 3);
  const outerCount = 4000;
  const innerCount = 2000;
  const r = 1.3;

  for (let i = 0; i < outerCount; i++) {
    const theta = (i / outerCount) * Math.PI * 2;
    let x = Math.cos(theta) * r;
    let y = Math.sin(theta) * r;

    // Build speech bubble tail around 4.1 radians
    if (theta > 3.8 && theta < 4.5) {
      const factor = 1.0 - Math.abs(theta - 4.15) / 0.35;
      if (factor > 0) {
        x -= factor * 0.45;
        y -= factor * 0.45;
      }
    }

    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  for (let i = 0; i < innerCount; i++) {
    const t = (i / innerCount) * Math.PI * 0.6 - Math.PI * 0.8;
    const hR = 0.6;
    const cx = -0.1;
    const cy = 0.1;
    const baseDist = hR + (Math.random() - 0.5) * 0.12;
    let px = cx + Math.cos(t) * baseDist;
    let py = cy + Math.sin(t) * baseDist;

    if (i < innerCount * 0.15) {
      px += Math.cos(t + Math.PI / 2) * 0.15;
    } else if (i > innerCount * 0.85) {
      px += Math.cos(t - Math.PI / 2) * 0.15;
    }

    arr[(outerCount + i) * 3] = px;
    arr[(outerCount + i) * 3 + 1] = py;
    arr[(outerCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  return arr;
};

// 5. Instagram Generator
const generateInstagram = (count = 6000): Float32Array => {
  const arr = new Float32Array(count * 3);
  const outerCount = 3500;
  const innerCount = 2000;
  const dotCount = 500;

  for (let i = 0; i < outerCount; i++) {
    const theta = (i / outerCount) * Math.PI * 2;
    const side = 1.3;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const roundness = 0.3;

    let x = Math.sign(cosT) * side;
    let y = Math.sign(sinT) * side;

    if (Math.abs(cosT) > 0.7 && Math.abs(sinT) > 0.7) {
      const cx = Math.sign(cosT) * (side - roundness);
      const cy = Math.sign(sinT) * (side - roundness);
      const angle = Math.atan2(sinT, cosT);
      x = cx + Math.cos(angle) * roundness;
      y = cy + Math.sin(angle) * roundness;
    } else {
      if (Math.abs(cosT) > Math.abs(sinT)) {
        y = sinT * side;
      } else {
        x = cosT * side;
      }
    }

    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  for (let i = 0; i < innerCount; i++) {
    const theta = (i / innerCount) * Math.PI * 2;
    const r = 0.5;
    arr[(outerCount + i) * 3] = Math.cos(theta) * r;
    arr[(outerCount + i) * 3 + 1] = Math.sin(theta) * r;
    arr[(outerCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  const dx = 0.65;
  const dy = 0.65;
  const dr = 0.08;
  for (let i = 0; i < dotCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const dist = Math.random() * dr;
    arr[(outerCount + innerCount + i) * 3] = dx + Math.cos(theta) * dist;
    arr[(outerCount + innerCount + i) * 3 + 1] = dy + Math.sin(theta) * dist;
    arr[(outerCount + innerCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  return arr;
};

// 6. Facebook Generator
const generateFacebook = (count = 6000): Float32Array => {
  const arr = new Float32Array(count * 3);
  const outerCount = 3500;
  const innerCount = 2500;
  const r = 1.3;

  for (let i = 0; i < outerCount; i++) {
    const theta = (i / outerCount) * Math.PI * 2;
    arr[i * 3] = Math.cos(theta) * r;
    arr[i * 3 + 1] = Math.sin(theta) * r;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  const stemCount = 1200;
  const crossCount = 600;
  const hookCount = 700;

  for (let i = 0; i < stemCount; i++) {
    const y = (i / stemCount) * 1.5 - 1.0;
    const x = 0.25 + (Math.random() - 0.5) * 0.15;
    arr[(outerCount + i) * 3] = x;
    arr[(outerCount + i) * 3 + 1] = y;
    arr[(outerCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  for (let i = 0; i < crossCount; i++) {
    const x = (i / crossCount) * 0.55 - 0.05;
    const y = 0.15 + (Math.random() - 0.5) * 0.15;
    arr[(outerCount + stemCount + i) * 3] = x;
    arr[(outerCount + stemCount + i) * 3 + 1] = y;
    arr[(outerCount + stemCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  for (let i = 0; i < hookCount; i++) {
    const theta = (i / hookCount) * Math.PI * 0.5; 
    const hR = 0.35; 
    const x = 0.25 + hR * (1 - Math.cos(theta)) + (Math.random() - 0.5) * 0.15;
    const y = 0.5 + hR * Math.sin(theta);
    arr[(outerCount + stemCount + crossCount + i) * 3] = x;
    arr[(outerCount + stemCount + crossCount + i) * 3 + 1] = y;
    arr[(outerCount + stemCount + crossCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  return arr;
};

// 7. Sparkle / AI Star Generator
const generateSparkle = (count = 6000): Float32Array => {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 1.6 * (Math.random() * 0.7 + 0.3);
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const x = r * cosT * Math.pow(Math.abs(cosT), 2.2);
    const y = r * sinT * Math.pow(Math.abs(sinT), 2.2);

    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return arr;
};

// 8. YouTube Generator
const generateYouTube = (count = 6000): Float32Array => {
  const arr = new Float32Array(count * 3);
  const outerCount = 4500;
  const playButtonCount = 1500;

  for (let i = 0; i < outerCount; i++) {
    const theta = (i / outerCount) * Math.PI * 2;
    const w = 1.4; 
    const h = 0.9; 
    const roundness = 0.3;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    let x = Math.sign(cosT) * w;
    let y = Math.sign(sinT) * h;

    if (Math.abs(cosT) > 0.7 && Math.abs(sinT) > 0.7) {
      const cx = Math.sign(cosT) * (w - roundness);
      const cy = Math.sign(sinT) * (h - roundness);
      const angle = Math.atan2(sinT, cosT);
      x = cx + Math.cos(angle) * roundness;
      y = cy + Math.sin(angle) * roundness;
    } else {
      if (Math.abs(cosT) > Math.abs(sinT)) {
        y = sinT * h;
      } else {
        x = cosT * w;
      }
    }

    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  const pA = new THREE.Vector3(-0.25, 0.28, 0);
  const pB = new THREE.Vector3(-0.25, -0.28, 0);
  const pC = new THREE.Vector3(0.25, 0, 0);

  for (let i = 0; i < playButtonCount; i++) {
    const p = sampleTriangle(pA, pB, pC);
    arr[(outerCount + i) * 3] = p.x;
    arr[(outerCount + i) * 3 + 1] = p.y;
    arr[(outerCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  return arr;
};

// 9. Twitter / X Generator
const generateX = (count = 6000): Float32Array => {
  const arr = new Float32Array(count * 3);
  const mainBarCount = 3500;
  const secondaryBarCount = 2500;

  for (let i = 0; i < mainBarCount; i++) {
    const frac = i / mainBarCount;
    const xBase = frac * 2.2 - 1.1;
    const yBase = -xBase;
    const offset = (Math.random() - 0.5) * 0.22;
    arr[i * 3] = xBase + offset;
    arr[i * 3 + 1] = yBase + offset;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  for (let i = 0; i < secondaryBarCount; i++) {
    const frac = i / secondaryBarCount;
    const xBase = frac * 2.2 - 1.1;
    const yBase = xBase;
    const side = i % 2 === 0 ? 0.18 : -0.18;
    arr[(mainBarCount + i) * 3] = xBase + side;
    arr[(mainBarCount + i) * 3 + 1] = yBase - side;
    arr[(mainBarCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  return arr;
};

// 10. LinkedIn Generator
const generateLinkedIn = (count = 6000): Float32Array => {
  const arr = new Float32Array(count * 3);
  const outerCount = 3500;
  const innerCount = 2500;

  for (let i = 0; i < outerCount; i++) {
    const theta = (i / outerCount) * Math.PI * 2;
    const side = 1.3;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const roundness = 0.2;

    let x = Math.sign(cosT) * side;
    let y = Math.sign(sinT) * side;

    if (Math.abs(cosT) > 0.7 && Math.abs(sinT) > 0.7) {
      const cx = Math.sign(cosT) * (side - roundness);
      const cy = Math.sign(sinT) * (side - roundness);
      const angle = Math.atan2(sinT, cosT);
      x = cx + Math.cos(angle) * roundness;
      y = cy + Math.sin(angle) * roundness;
    } else {
      if (Math.abs(cosT) > Math.abs(sinT)) {
        y = sinT * side;
      } else {
        x = cosT * side;
      }
    }

    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  const iStemCount = 500;
  const iDotCount = 300;
  const nStemCount = 700;
  const nHumpCount = 1000;

  for (let i = 0; i < iStemCount; i++) {
    const y = (i / iStemCount) * 0.7 - 0.6;
    const x = -0.4 + (Math.random() - 0.5) * 0.08;
    arr[(outerCount + i) * 3] = x;
    arr[(outerCount + i) * 3 + 1] = y;
    arr[(outerCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  for (let i = 0; i < iDotCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const rDist = Math.random() * 0.07;
    arr[(outerCount + iStemCount + i) * 3] = -0.4 + Math.cos(theta) * rDist;
    arr[(outerCount + iStemCount + i) * 3 + 1] = 0.35 + Math.sin(theta) * rDist;
    arr[(outerCount + iStemCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  for (let i = 0; i < nStemCount; i++) {
    const y = (i / nStemCount) * 0.7 - 0.6;
    const x = -0.05 + (Math.random() - 0.5) * 0.08;
    arr[(outerCount + iStemCount + iDotCount + i) * 3] = x;
    arr[(outerCount + iStemCount + iDotCount + i) * 3 + 1] = y;
    arr[(outerCount + iStemCount + iDotCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  for (let i = 0; i < nHumpCount; i++) {
    let x = 0.35;
    let y = 0.0;
    
    if (i < nHumpCount * 0.5) {
      y = (i / (nHumpCount * 0.5)) * 0.6 - 0.6;
      x = 0.35 + (Math.random() - 0.5) * 0.08;
    } else {
      const theta = ((i - nHumpCount * 0.5) / (nHumpCount * 0.5)) * Math.PI; 
      x = 0.15 + Math.cos(theta) * 0.2 + (Math.random() - 0.5) * 0.05;
      y = 0.0 + Math.sin(theta) * 0.2;
    }

    arr[(outerCount + iStemCount + iDotCount + nStemCount + i) * 3] = x;
    arr[(outerCount + iStemCount + iDotCount + nStemCount + i) * 3 + 1] = y;
    arr[(outerCount + iStemCount + iDotCount + nStemCount + i) * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  return arr;
};

const DualSphere = ({
  isConnected,
  isSpeaking,
}: {
  isConnected: boolean;
  isSpeaking: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  const [activeShapeIndex, setActiveShapeIndex] = useState(0);

  const shapes = useMemo(() => [
    generateSphere(),
    generateDNA(),
    generateTelegram(),
    generateWhatsApp(),
    generateInstagram(),
    generateFacebook(),
    generateSparkle(),
    generateYouTube(),
    generateX(),
    generateLinkedIn()
  ], []);

  const { positions } = useMemo(() => {
    const pos = new Float32Array(shapes[0]);
    return { positions: pos };
  }, [shapes]);

  const currentPositions = useRef<Float32Array | null>(null);
  if (!currentPositions.current) {
    currentPositions.current = new Float32Array(shapes[0]);
  }

  const animState = useRef({ amplitude: 0.02, scale: 1.0, speed: 0.5 });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSpeaking) {
      // Pick random indices from 1 to shapes.length - 1 when talking
      interval = setInterval(() => {
        setActiveShapeIndex(() => {
          const next = Math.floor(Math.random() * (shapes.length - 1)) + 1;
          return next;
        });
      }, 4000);
    } else {
      setActiveShapeIndex(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpeaking, shapes.length]);

  useFrame((state, delta) => {
    if (!groupRef.current || !pointsRef.current || !currentPositions.current) return;

    const targetAmplitude = isSpeaking ? 0.22 : isConnected ? 0.05 : 0.01;
    const targetScale = isSpeaking ? 1.15 : 1.0;
    const targetSpeed = isSpeaking ? 2.5 : isConnected ? 0.8 : 0.2;

    animState.current.amplitude = THREE.MathUtils.lerp(
      animState.current.amplitude,
      targetAmplitude,
      0.1
    );
    animState.current.scale = THREE.MathUtils.lerp(
      animState.current.scale,
      targetScale,
      0.1
    );
    animState.current.speed = THREE.MathUtils.lerp(
      animState.current.speed,
      targetSpeed,
      0.05
    );

    timeRef.current += delta * animState.current.speed;
    const t = timeRef.current;

    const targetX = state.mouse.y * 0.4;
    const targetY = state.mouse.x * 0.4;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.05
    );

    pointsRef.current.rotation.y += delta * (isConnected ? 0.15 : 0.05);
    pointsRef.current.scale.setScalar(animState.current.scale);

    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const targetPositions = shapes[activeShapeIndex];

    for (let i = 0; i < 6000; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const lerpSpeed = isSpeaking ? 0.06 : 0.08;
      currentPositions.current[ix] = THREE.MathUtils.lerp(currentPositions.current[ix], targetPositions[ix], lerpSpeed);
      currentPositions.current[iy] = THREE.MathUtils.lerp(currentPositions.current[iy], targetPositions[iy], lerpSpeed);
      currentPositions.current[iz] = THREE.MathUtils.lerp(currentPositions.current[iz], targetPositions[iz], lerpSpeed);

      const px = currentPositions.current[ix];
      const py = currentPositions.current[iy];
      const pz = currentPositions.current[iz];

      const dist = Math.sqrt(px * px + py * py + pz * pz);
      const wave = Math.sin(py * 6 + t * 2) * Math.cos(px * 4 + t) * animState.current.amplitude;
      const factor = dist > 0.01 ? (dist + wave) / dist : 1.0;

      positionsArray[ix] = px * factor;
      positionsArray[iy] = py * factor;
      positionsArray[iz] = pz * factor;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const outerColor = isConnected ? "#f472b6" : "#44444c";

  return (
    <group ref={groupRef}>
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
          size={0.013}
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
