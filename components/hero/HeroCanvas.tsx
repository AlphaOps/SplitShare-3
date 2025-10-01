"use client";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';

function Orb() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <icosahedronGeometry args={[1.5, 16]} />
        <MeshDistortMaterial
          color="#E50914"
          emissive="#E50914"
          emissiveIntensity={1.5}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

export function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#E50914" />
        <pointLight position={[-5, -5, -5]} intensity={1.5} color="#1DB954" />
        <Orb />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}


