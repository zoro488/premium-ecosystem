/**
 * 🎯 DASHBOARD MAIN - WRAPPER OPTIMIZADO
 *
 * Componente que integra todo el sistema FlowDistributor existente
 * con optimizaciones de performance y animaciones
 */

import { motion } from 'framer-motion';
import { memo } from 'react';

import { useEffect, useState } from 'react';
import { clienteService, type Cliente } from '../src/services/firestore.service';

interface DashboardMainProps {
  user: { username: string; role: string } | null;
  onLogout: () => void;
}

const DashboardMain = memo(({ user, onLogout }: DashboardMainProps) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para crear datos de demostración
  const createDemoData = async () => {
    try {
      console.log('🚀 Creando datos de demostración...');

      // Crear algunos clientes de ejemplo
      const clientesDemo = [
        {
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '555-0101',
          email: 'juan.perez@email.com',
          direccion: 'Av. Principal 123, Ciudad',
          activo: true
        },
        {
          nombre: 'María',
          apellido: 'González',
          telefono: '555-0102',
          email: 'maria.gonzalez@email.com',
          direccion: 'Calle Secundaria 456, Pueblo',
          activo: true
        },
        {
          nombre: 'Carlos',
          apellido: 'López',
          telefono: '555-0103',
          direccion: 'Plaza Central 789, Villa',
          activo: true
        }
      ];

      // Crear clientes uno por uno
      for (const cliente of clientesDemo) {
        await clienteService.create(cliente);
      }

      console.log('✅ Datos de demostración creados exitosamente');

      // Recargar la lista
      const clientesData = await clienteService.getAll();
      setClientes(clientesData);

    } catch (error) {
      console.error('❌ Error creando datos demo:', error);
    }
  };

  // Cargar clientes desde Firestore
  useEffect(() => {
    const loadClientes = async () => {
      try {
        setLoading(true);
        const clientesData = await clienteService.getAll(10);
        setClientes(clientesData);
      } catch (error) {
        console.error('Error cargando clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClientes();

    // Suscripción en tiempo real opcional
    const unsubscribe = clienteService.onSnapshot((clientesData) => {
      setClientes(clientesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen p-6"
    >
      {/*
        AQUÍ VA TU DASHBOARD EXISTENTE
        Reemplaza este contenido con tu componente Dashboard actual
      */}

      <div className="max-w-7xl mx-auto">
        {/* Header con Firebase Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Bienvenido, {user?.username}
              </h1>
              <p className="text-white/60">
                Sistema Flow Distributor - Chronos Edition con Firebase
              </p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Panel de Firestore Demo */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">🔥 Firebase Firestore Demo</h2>

          <div className="flex gap-4 mb-4">
            <button
              onClick={createDemoData}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300 px-4 py-2 rounded-lg transition-all"
            >
              Crear Datos Demo
            </button>

            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-300 px-4 py-2 rounded-lg transition-all"
            >
              Recargar Datos
            </button>
          </div>

          {/* Lista de Clientes */}
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Clientes ({clientes.length})
            </h3>

            {loading ? (
              <div className="text-white/60">Cargando clientes desde Firestore...</div>
            ) : clientes.length === 0 ? (
              <div className="text-white/60">
                No hay clientes. Haz clic en "Crear Datos Demo" para agregar algunos.
              </div>
            ) : (
              <div className="space-y-2">
                {clientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="bg-white/5 border border-white/10 rounded p-3 flex justify-between items-center"
                  >
                    <div>
                      <span className="text-white font-medium">
                        {cliente.nombre} {cliente.apellido}
                      </span>
                      <br />
                      <span className="text-white/60 text-sm">
                        {cliente.telefono} • {cliente.direccion}
                      </span>
                    </div>
                    <span className="text-green-400 text-sm">
                      {cliente.activo ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Aquí irían tus paneles, tablas, etc. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* KPI Card 1 */}
          <motion.div
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h3 className="text-white/60 text-sm mb-2">Total Ventas</h3>
            <p className="text-3xl font-bold text-white">$125,450</p>
          </motion.div>

          {/* KPI Card 2 */}
          <motion.div
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h3 className="text-white/60 text-sm mb-2">Órdenes Activas</h3>
            <p className="text-3xl font-bold text-white">42</p>
          </motion.div>

          {/* KPI Card 3 */}
          <motion.div
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h3 className="text-white/60 text-sm mb-2">Clientes</h3>
            <p className="text-3xl font-bold text-white">156</p>
          </motion.div>
        </div>

        {/* Mensaje de instrucciones */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span>💡</span> Instrucciones de Integración
          </h3>
          <div className="text-white/70 text-sm space-y-2">
            <p>
              <strong className="text-white">1.</strong> Importa tu componente Dashboard existente en la línea 9 de este archivo
            </p>
            <p>
              <strong className="text-white">2.</strong> Reemplaza el contenido de este div (líneas 34-93) con tu Dashboard
            </p>
            <p>
              <strong className="text-white">3.</strong> Pasa las props necesarias: <code className="bg-black/30 px-2 py-1 rounded">user</code> y <code className="bg-black/30 px-2 py-1 rounded">onLogout</code>
            </p>
            <p className="text-green-400 mt-4">
              ✅ El sistema de Login, Splash y Logo ya está completamente funcional
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

DashboardMain.displayName = 'DashboardMain';

export default DashboardMain;
