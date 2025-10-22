/**
 * 🏦 BANK VISUALIZATION 3D - FLOWDISTRIBUTOR SUPREME 2025
 * Visualización 3D de bancos con WebGPU y animaciones premium
 */
import { Suspense, useRef, useState } from 'react';

import {
  Cloud,
  Environment,
  Float,
  MeshTransmissionMaterial,
  OrbitControls,
  PerspectiveCamera,
  Sparkles,
  Text3D,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing';

/**
 * Componente 3D de un banco individual
 */
function BankCube({ bank, position, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotación suave
      meshRef.current.rotation.y += 0.01;

      // Float effect en hover
      if (hovered) {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + position[1];
      }
    }
  });

  // Color basado en el capital del banco
  const getColor = (capital) => {
    if (capital > 5000000) return '#10B981'; // Verde
    if (capital > 2000000) return '#06B6D4'; // Cyan
    if (capital > 1000000) return '#8B5CF6'; // Violeta
    return '#EF4444'; // Rojo
  };

  const scale = Math.log10(bank.capital) / 2;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={hovered ? 2 : 0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? scale * 1.2 : scale}
      >
        <boxGeometry args={[1, 1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={0.95}
          roughness={0.1}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.5}
          anisotropy={1}
          distortion={0.3}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color={getColor(bank.capital)}
        />

        {/* Texto del nombre del banco */}
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.15}
          height={0.05}
          curveSegments={12}
          position={[0, 1.2, 0]}
        >
          {bank.nombre}
          <meshStandardMaterial
            color="white"
            emissive="white"
            emissiveIntensity={hovered ? 1 : 0.5}
          />
        </Text3D>

        {/* Sparkles en hover */}
        {hovered && <Sparkles count={50} scale={2} size={2} speed={0.5} />}
      </mesh>
    </Float>
  );
}

/**
 * Escena 3D principal de bancos
 */
function BanksScene({ banks, onBankClick }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Rotación suave de todo el grupo
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  // Distribuir bancos en círculo
  const radius = 4;
  const positions = banks.map((_, i) => {
    const angle = (i / banks.length) * Math.PI * 2;
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
  });

  return (
    <group ref={groupRef}>
      {banks.map((bank, i) => (
        <BankCube
          key={bank.id}
          bank={bank}
          position={positions[i]}
          onClick={() => onBankClick(bank)}
        />
      ))}

      {/* Nubes de fondo */}
      <Cloud opacity={0.2} speed={0.4} width={10} depth={1.5} segments={20} />

      {/* Iluminación ambiental */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
    </group>
  );
}

/**
 * Componente principal exportable
 */
export default function BankVisualization3D({ banks, onBankSelect }) {
  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden relative">
      {/* Fondo glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-violet-950/90 to-slate-900/95 backdrop-blur-2xl" />

      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={60} />

        <Suspense fallback={null}>
          <BanksScene banks={banks} onBankClick={onBankSelect} />
          <Environment preset="city" />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
            <ChromaticAberration offset={[0.002, 0.002]} />
          </EffectComposer>
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={20}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Overlay UI */}
      <div className="absolute top-4 left-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <h3 className="text-white font-bold mb-2">🏦 Bancos en 3D</h3>
        <p className="text-white/70 text-sm">Haz clic en un banco para ver detalles</p>
        <p className="text-white/50 text-xs mt-2">Arrastra para rotar • Scroll para zoom</p>
      </div>

      {/* Leyenda de colores */}
      <div className="absolute bottom-4 right-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <h4 className="text-white font-semibold mb-2">Leyenda</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-white/70">&gt; $5M</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-white/70">$2M - $5M</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500" />
            <span className="text-white/70">$1M - $2M</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-white/70">&lt; $1M</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * INSTRUCCIONES DE USO:
 *
 * import BankVisualization3D from './components/BankVisualization3D';
 *
 * <BankVisualization3D
 *   banks={bancos}
 *   onBankSelect={(bank) => console.log('Banco seleccionado:', bank)}
 * />
 *
 * REQUISITOS:
 * - Archivo de fuente 3D: public/fonts/helvetiker_bold.typeface.json
 * - Descargar desde: https://threejs.org/examples/fonts/helvetiker_bold.typeface.json
 */
