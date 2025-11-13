// 🚀 HOOK: useDataInitializer
// Inicializa automáticamente todos los datos del Excel en el store
import { useEffect, useState } from 'react';

import { getDatosCompletos } from '@/services/dataService';

import { useFlowStore } from '../../../stores/flowStore';

/**
 * Hook que inicializa los datos del Excel en el store de Zustand
 * Usa dataService para fetch consistente de datos
 * Se ejecuta una sola vez al montar el componente
 */
export const useDataInitializer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const store = useFlowStore();

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('🚀 Iniciando carga de datos del Excel...');
        setIsLoading(true);

        // Usar dataService en lugar de import estático
        const datosCompletos = await getDatosCompletos();

        // Adaptar estructura de datos_bovedas_completos.json a la esperada por el store
        const data = {
          bancos: {},
          clientes: [],
          ventas: [],
          ordenesCompra: [],
          distribuidores: [],
        };

        // Mapear paneles a bancos
        datosCompletos.paneles.forEach((panel) => {
          const bancoKey = panel.panel.toLowerCase().replace(/[_\s]/g, '');
          data.bancos[bancoKey] = {
            ingresos: panel.ingresos?.registros || [],
            gastos: panel.salidas?.registros || [],
          };
        });

        // Usar ventas del controlMaestro
        data.ventas = datosCompletos.controlMaestro.ventas || [];

        // Extraer clientes únicos de ventas
        const clientesUnicos = new Set();
        data.ventas.forEach((venta) => {
          if (venta.cliente) clientesUnicos.add(venta.cliente);
        });
        data.clientes = Array.from(clientesUnicos).map((nombre, idx) => ({
          id: `CLI-${idx}`,
          nombre,
          ventas: data.ventas.filter((v) => v.cliente === nombre),
          adeudo: 0,
          totalComprado: 0,
          totalAbonado: 0,
        }));

        // Para OCs, usar ingresos de Almacén
        const panelAlmacen = datosCompletos.paneles.find((p) => p.tipoPanel === 'almacen');
        if (panelAlmacen) {
          data.ordenesCompra = (panelAlmacen.ingresos?.registros || []).map((reg, idx) => ({
            id: `OC-${idx}`,
            codigo: reg.OC || `OC${idx}`,
            distribuidor: reg.Distribuidor || 'Sin Distribuidor',
            cantidad: reg.Cantidad || 0,
            stockActual: reg.Cantidad || 0,
            costoPorUnidad: 0,
            costoTotal: 0,
            deuda: 0,
            fecha: new Date().toISOString(),
          }));
        }

        // Extraer distribuidores únicos de OCs
        const distribuidoresUnicos = new Set();
        data.ordenesCompra.forEach((oc) => {
          if (oc.distribuidor) distribuidoresUnicos.add(oc.distribuidor);
        });
        data.distribuidores = Array.from(distribuidoresUnicos).map((nombre, idx) => ({
          id: `DIST-${idx}`,
          nombre,
        }));

        // Mapeo de nombres de bóvedas del JSON al store
        const bancosMapping = {
          bovedamonte: 'bovedaMonte',
          bovedausa: 'bovedaUsa',
          azteca: 'azteca',
          leftie: 'leftie',
          fletesur: 'fleteSur',
          profit: 'profit',
          utilidades: 'utilidades',
        };

        // 1. Inicializar Bancos
        console.log('💰 Cargando bóvedas...');
        Object.entries(data.bancos || {}).forEach(([bancoKey, bancoData]) => {
          const storeKey = bancosMapping[bancoKey] || bancoKey;

          if (store.bancos[storeKey]) {
            const totalIngresos = (bancoData.ingresos || []).reduce(
              (sum, ing) => sum + (parseFloat(ing.monto) || parseFloat(ing.ingreso) || 0),
              0
            );
            const totalGastos = (bancoData.gastos || []).reduce(
              (sum, gas) => sum + (parseFloat(gas.monto) || parseFloat(gas.gasto) || 0),
              0
            );

            store.bancos[storeKey].capitalActual = totalIngresos - totalGastos;
            store.bancos[storeKey].saldoActual = totalIngresos - totalGastos;
            store.bancos[storeKey].ingresos = totalIngresos;
            store.bancos[storeKey].gastos = totalGastos;
            store.bancos[storeKey].listaIngresos = bancoData.ingresos || [];
            store.bancos[storeKey].listaGastos = bancoData.gastos || [];
            store.bancos[storeKey].movimientos = [
              ...(bancoData.ingresos || []).map((i) => ({ ...i, tipo: 'ingreso' })),
              ...(bancoData.gastos || []).map((g) => ({ ...g, tipo: 'gasto' })),
            ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            console.log(
              `  ✓ ${store.bancos[storeKey].nombre}: $${(totalIngresos - totalGastos).toFixed(2)} (${(bancoData.ingresos || []).length}I / ${(bancoData.gastos || []).length}G)`
            );
          }
        });

        // 2. Inicializar Clientes
        console.log('👥 Cargando clientes...');
        if (data.clientes && Array.isArray(data.clientes)) {
          store.clientes = data.clientes.map((cliente) => ({
            ...cliente,
            id: cliente.id || `CLI-${Date.now()}-${Math.random()}`,
            ventas: cliente.ventas || [],
            adeudo: cliente.adeudo || cliente.pendiente || 0,
            totalComprado: cliente.totalComprado || 0,
            totalAbonado: cliente.totalAbonado || 0,
          }));
          console.log(`  ✓ ${store.clientes?.length || 0} clientes cargados`);
        }

        // 3. Inicializar Ventas
        console.log('💵 Cargando ventas...');
        if (data.ventas && Array.isArray(data.ventas)) {
          store.ventas = data.ventas.map((venta) => ({
            ...venta,
            id: venta.id || `VENTA-${Date.now()}-${Math.random()}`,
            estatus: venta.estatus || venta.status || 'PENDIENTE',
            totalCliente: venta.totalCliente || venta.totalVenta || venta.ingreso || 0,
            utilidadNeta: venta.utilidadNeta || venta.utilidad || 0,
          }));
          console.log(`  ✓ ${store.ventas?.length || 0} ventas cargadas`);
        }

        // 4. Inicializar Órdenes de Compra
        console.log('📦 Cargando órdenes de compra...');
        if (data.ordenesCompra && Array.isArray(data.ordenesCompra)) {
          store.ordenesCompra = data.ordenesCompra.map((oc) => ({
            ...oc,
            id: oc.id || `OC-${Date.now()}-${Math.random()}`,
            codigo:
              oc.codigo || oc.oc || `OC${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            stockActual: oc.stockActual !== undefined ? oc.stockActual : oc.cantidad || 0,
            deuda:
              oc.deuda !== undefined ? oc.deuda : (oc.costoTotal || 0) - (oc.pagoDistribuidor || 0),
          }));
          console.log(`  ✓ ${store.ordenesCompra?.length || 0} órdenes de compra cargadas`);
        }

        // 5. Inicializar Distribuidores
        console.log('🏭 Cargando distribuidores...');
        if (data.distribuidores && Array.isArray(data.distribuidores)) {
          store.distribuidores = data.distribuidores.map((dist) => ({
            ...dist,
            id: dist.id || `DIST-${Date.now()}-${Math.random()}`,
            nombre: dist.nombre || dist.distribuidor || 'Sin Nombre',
          }));
          console.log(`  ✓ ${store.distribuidores?.length || 0} distribuidores cargados`);
        }

        // 6. Actualizar Almacén
        console.log('📦 Calculando stock de almacén...');
        const stockTotal = (store.ordenesCompra || []).reduce(
          (sum, oc) => sum + (oc.stockActual || 0),
          0
        );
        store.almacen.stockActual = stockTotal;
        store.almacen.productos = (store.ordenesCompra || []).filter(
          (oc) => (oc.stockActual || 0) > 0
        );
        console.log(`  ✓ Stock total: ${stockTotal} unidades`);

        // 7. Calcular Capital Total
        const capitalTotal = Object.values(store.bancos).reduce(
          (sum, banco) => sum + (banco.capitalActual || 0),
          0
        );
        console.log(`\n💰 CAPITAL TOTAL SISTEMA: $${capitalTotal.toFixed(2)}`);
        console.log('✅ Datos inicializados correctamente\n');

        setIsInitialized(true);
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Error al inicializar datos:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    // Solo inicializar si no hay datos cargados
    const hasData = (store.clientes?.length ?? 0) > 0 || (store.ordenesCompra?.length ?? 0) > 0;

    if (!hasData && !isInitialized) {
      initializeData();
    } else if (hasData) {
      setIsInitialized(true);
      setIsLoading(false);
    }
  }, []); // Solo ejecutar una vez al montar

  return {
    isInitialized,
    isLoading,
    error,
  };
};

export default useDataInitializer;
