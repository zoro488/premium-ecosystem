/**
 * 🏪 ZUSTAND STORE - Estado Global Enterprise
 * Nivel: PREMIUM MODERNO
 * Pattern: Atomic State Management
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Store con DevTools + Persist + Immer para mutaciones seguras
export const useFlowStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // 📊 Estados
        estados: [],

        // 💰 Bancos
        bancos: {
          bovedaMonte: { nombre: 'Bóveda Monte', capitalActual: 0, registros: [] },
          bancoCuscatlan: { nombre: 'Banco Cuscatlán', capitalActual: 0, registros: [] },
          bancoAgricola: { nombre: 'Banco Agrícola', capitalActual: 0, registros: [] },
        },

        // 👥 Clientes
        clientes: [],

        // 💵 Ventas
        ventas: [],

        // 📈 Métricas computadas (memoizadas)
        get totalCapital() {
          const { bancos } = get();
          return Object.values(bancos).reduce((sum, b) => sum + (b.capitalActual || 0), 0);
        },

        get ventasPendientes() {
          return get().ventas.filter((v) => v.estatus === 'Pendiente');
        },

        get ventasPagadas() {
          return get().ventas.filter((v) => v.estatus === 'Pagado');
        },

        // 🔄 Acciones Optimistas
        addEstado: (estado) =>
          set((state) => {
            state.estados.push(estado);
          }),

        updateEstado: (id, updates) =>
          set((state) => {
            const index = state.estados.findIndex((e) => e.id === id);
            if (index !== -1) {
              Object.assign(state.estados[index], updates);
            }
          }),

        deleteEstado: (id) =>
          set((state) => {
            state.estados = state.estados.filter((e) => e.id !== id);
          }),

        addVenta: (venta) =>
          set((state) => {
            state.ventas.push(venta);
          }),

        updateVenta: (id, updates) =>
          set((state) => {
            const index = state.ventas.findIndex((v) => v.id === id);
            if (index !== -1) {
              Object.assign(state.ventas[index], updates);
            }
          }),

        marcarVentaPagada: (ventaId, bancoDestino) =>
          set((state) => {
            const venta = state.ventas.find((v) => v.id === ventaId);
            if (venta && venta.estatus === 'Pendiente') {
              // Actualizar venta
              venta.estatus = 'Pagado';
              venta.destino = bancoDestino;
              venta.adeudo = 0;

              // Acreditar banco
              const montoAcreditar = (venta.totalVenta || 0) - (venta.montoPagado || 0);
              if (state.bancos[bancoDestino]) {
                state.bancos[bancoDestino].capitalActual += montoAcreditar;
                state.bancos[bancoDestino].registros.push({
                  id: Date.now(),
                  fecha: new Date().toISOString(),
                  tipo: 'Ingreso',
                  concepto: `Pago venta ${venta.cliente}`,
                  monto: montoAcreditar,
                });
              }

              // Actualizar cliente
              const cliente = state.clientes.find((c) => c.nombre === venta.cliente);
              if (cliente) {
                cliente.adeudo = Math.max(0, (cliente.adeudo || 0) - montoAcreditar);
              }
            }
          }),

        addCliente: (cliente) =>
          set((state) => {
            state.clientes.push(cliente);
          }),

        updateCliente: (nombre, updates) =>
          set((state) => {
            const index = state.clientes.findIndex((c) => c.nombre === nombre);
            if (index !== -1) {
              Object.assign(state.clientes[index], updates);
            }
          }),

        registrarAbono: (clienteNombre, monto, bancoDestino) =>
          set((state) => {
            const cliente = state.clientes.find((c) => c.nombre === clienteNombre);
            if (cliente) {
              cliente.adeudo = Math.max(0, (cliente.adeudo || 0) - monto);

              if (state.bancos[bancoDestino]) {
                state.bancos[bancoDestino].capitalActual += monto;
                state.bancos[bancoDestino].registros.push({
                  id: Date.now(),
                  fecha: new Date().toISOString(),
                  tipo: 'Ingreso',
                  concepto: `Abono ${clienteNombre}`,
                  monto,
                });
              }
            }
          }),

        updateBanco: (bancoId, updates) =>
          set((state) => {
            if (state.bancos[bancoId]) {
              Object.assign(state.bancos[bancoId], updates);
            }
          }),

        addRegistroBanco: (bancoId, registro) =>
          set((state) => {
            if (state.bancos[bancoId]) {
              state.bancos[bancoId].registros.push(registro);

              // Actualizar capital
              const monto = registro.monto || 0;
              if (registro.tipo === 'Ingreso') {
                state.bancos[bancoId].capitalActual += monto;
              } else if (registro.tipo === 'Egreso') {
                state.bancos[bancoId].capitalActual -= monto;
              }
            }
          }),

        // 🔄 Sincronización con LocalStorage (legacy)
        syncFromLocalStorage: () =>
          set((state) => {
            try {
              const estados = JSON.parse(localStorage.getItem('estados') || '[]');
              const bancos = JSON.parse(localStorage.getItem('bancos') || '{}');
              const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
              const ventas = JSON.parse(localStorage.getItem('ventas') || '[]');

              if (estados.length) state.estados = estados;
              if (Object.keys(bancos).length) state.bancos = bancos;
              if (clientes.length) state.clientes = clientes;
              if (ventas.length) state.ventas = ventas;
            } catch (error) {
              // console.error('Error syncing from localStorage:', error);
            }
          }),

        // 🗑️ Resetear todo
        reset: () =>
          set({
            estados: [],
            bancos: {
              bovedaMonte: { nombre: 'Bóveda Monte', capitalActual: 0, registros: [] },
              bancoCuscatlan: { nombre: 'Banco Cuscatlán', capitalActual: 0, registros: [] },
              bancoAgricola: { nombre: 'Banco Agrícola', capitalActual: 0, registros: [] },
            },
            clientes: [],
            ventas: [],
          }),
      })),
      {
        name: 'flow-distributor-storage',
        version: 1,
      }
    ),
    { name: 'FlowDistributor Store' }
  )
);
