/**
 * 📊 SALES CHART 3D - FLOWDISTRIBUTOR SUPREME 2025
 * Gráficos de ventas 3D interactivos con animaciones premium
 */
import { useRef, useState } from 'react';

import {
  Environment,
  Float,
  MeshDistortMaterial,
  OrbitControls,
  PerspectiveCamera,
  Text,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer, SSAO } from '@react-three/postprocessing';

/**
 * Barra 3D individual
 */
function Bar3D({ position, height, color, label, value, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, height * 1.2, 0.1);
    } else if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, height, 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={[1, height, 1]}
        position={[0, height / 2, 0]}
      >
        <boxGeometry args={[0.8, 1, 0.8]} />
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={hovered ? 0.3 : 0}
          radius={1}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Etiqueta */}
      <Text position={[0, -0.5, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {label}
      </Text>

      {/* Valor en hover */}
      {hovered && (
        <Float speed={2} floatIntensity={0.5}>
          <Text
            position={[0, height + 1, 0]}
            fontSize={0.4}
            color="#10B981"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000"
          >
            ${value.toLocaleString()}
          </Text>
        </Float>
      )}
    </group>
  );
}

/**
 * Escena del gráfico 3D
 */
function ChartScene({ data, onBarClick }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const maxValue = Math.max(...data.map((d) => d.value));
  const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  return (
    <group ref={groupRef}>
      {data.map((item, i) => (
        <Bar3D
          key={item.id}
          position={[(i - data.length / 2) * 1.5, 0, 0]}
          height={(item.value / maxValue) * 5}
          color={colors[i % colors.length]}
          label={item.label}
          value={item.value}
          onClick={() => onBarClick(item)}
        />
      ))}

      {/* Grid base */}
      <gridHelper args={[20, 20, '#ffffff20', '#ffffff10']} position={[0, 0, 0]} />

      {/* Iluminación */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#8B5CF6" />
    </group>
  );
}

/**
 * Componente principal
 */
export default function SalesChart3D({ salesData, onSaleClick }) {
  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-cyan-950/90 to-slate-900/95 backdrop-blur-2xl" />

      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={50} />

        <ChartScene data={salesData} onBarClick={onSaleClick} />
        <Environment preset="sunset" />

        <EffectComposer>
          <Bloom intensity={1} luminanceThreshold={0.3} />
          <SSAO radius={0.4} intensity={20} />
        </EffectComposer>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={8}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      <div className="absolute top-4 left-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <h3 className="text-white font-bold mb-2">📊 Ventas 3D</h3>
        <p className="text-white/70 text-sm">Gráfico interactivo de ventas</p>
      </div>
    </div>
  );
}
