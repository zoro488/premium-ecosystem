/**
 * 📦 INVENTORY VISUALIZATION 3D - FLOWDISTRIBUTOR SUPREME 2025
 * Visualización 3D del inventario con productos flotantes
 */
import { useRef, useState } from 'react';

import {
  Box,
  Cylinder,
  Environment,
  Float,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
  Text,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, DepthOfField, EffectComposer } from '@react-three/postprocessing';

/**
 * Producto 3D flotante
 */
function Product3D({ product, position, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      if (hovered) {
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  // Geometría basada en categoría
  const getGeometry = () => {
    const category = product.categoria?.toLowerCase() || 'default';
    if (category.includes('electronico') || category.includes('electronic')) {
      return <Box args={[1, 0.6, 1]} />;
    } else if (category.includes('bebida') || category.includes('drink')) {
      return <Cylinder args={[0.3, 0.3, 1.2, 16]} />;
    } else {
      return <Sphere args={[0.5, 32, 32]} />;
    }
  };

  // Color basado en stock
  const getColor = () => {
    const stock = product.cantidad || 0;
    if (stock > 100) return '#10B981';
    if (stock > 50) return '#F59E0B';
    if (stock > 20) return '#EF4444';
    return '#EF4444';
  };

  const scale = hovered ? 1.3 : 1;

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh ref={meshRef} scale={scale}>
          {getGeometry()}
          <meshStandardMaterial
            color={getColor()}
            emissive={getColor()}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Nombre del producto */}
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {product.nombre}
        </Text>

        {/* Stock en hover */}
        {hovered && (
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.3}
            color={getColor()}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000"
          >
            Stock: {product.cantidad}
          </Text>
        )}

        {/* Partículas alrededor del producto */}
        {hovered && (
          <points>
            <sphereGeometry args={[1.5, 32, 32]} />
            <pointsMaterial
              color={getColor()}
              size={0.05}
              transparent
              opacity={0.6}
              sizeAttenuation
            />
          </points>
        )}
      </group>
    </Float>
  );
}

/**
 * Escena del almacén 3D
 */
function WarehouseScene({ inventory, onProductClick }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });

  // Distribuir productos en espiral 3D
  const getPosition = (index, total) => {
    const radius = 5;
    const height = (index / total) * 10 - 5;
    const angle = (index / total) * Math.PI * 4;
    return [Math.cos(angle) * radius, height, Math.sin(angle) * radius];
  };

  return (
    <group ref={groupRef}>
      {inventory.map((product, i) => (
        <Product3D
          key={product.id || i}
          product={product}
          position={getPosition(i, inventory.length)}
          onClick={() => onProductClick(product)}
        />
      ))}

      {/* Suelo del almacén */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} envMapIntensity={1} />
      </mesh>

      {/* Iluminación */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#06B6D4" />
      <spotLight position={[-10, 10, -10]} angle={0.3} intensity={0.5} color="#8B5CF6" />
    </group>
  );
}

/**
 * Componente principal
 */
export default function InventoryVisualization3D({ inventory, onProductSelect }) {
  const [stats, setStats] = useState({
    total: 0,
    bajo: 0,
    medio: 0,
    alto: 0,
  });

  // Calcular estadísticas
  useState(() => {
    const total = inventory.reduce((sum, p) => sum + (p.cantidad || 0), 0);
    const bajo = inventory.filter((p) => (p.cantidad || 0) <= 20).length;
    const medio = inventory.filter(
      (p) => (p.cantidad || 0) > 20 && (p.cantidad || 0) <= 100
    ).length;
    const alto = inventory.filter((p) => (p.cantidad || 0) > 100).length;
    setStats({ total, bajo, medio, alto });
  }, [inventory]);

  return (
    <div className="w-full h-[700px] rounded-3xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-emerald-950/90 to-slate-900/95 backdrop-blur-2xl" />

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 5, 10]} fov={60} />

        <WarehouseScene inventory={inventory} onProductClick={onProductSelect} />
        <Environment preset="warehouse" />

        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.2} />
          <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={3} />
        </EffectComposer>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={8}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {/* Panel de información */}
      <div className="absolute top-4 left-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <h3 className="text-white font-bold mb-3">📦 Inventario 3D</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-white/70">Total productos:</span>
            <span className="text-white font-semibold">{inventory.length}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/70">Unidades totales:</span>
            <span className="text-white font-semibold">{stats.total}</span>
          </div>
        </div>
      </div>

      {/* Leyenda de stock */}
      <div className="absolute bottom-4 right-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <h4 className="text-white font-semibold mb-2">Stock Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-white/70">Alto (&gt;100): {stats.alto}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-white/70">Medio (20-100): {stats.medio}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-white/70">Bajo (&lt;20): {stats.bajo}</span>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="absolute bottom-4 left-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-2">
        <p className="text-white/50 text-xs">🖱️ Arrastra • 🔍 Scroll • 🔄 Auto-rotación</p>
      </div>
    </div>
  );
}
