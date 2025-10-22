/**
 * 🎯 FLOWDISTRIBUTOR STATE HOOK
 * Centralized state management for FlowDistributor
 * Consolidates 44+ useState calls from main component
 */
import { useState } from 'react';

import { STORAGE_KEYS, useLocalStorage } from '../../../utils/storage';

/**
 * Custom hook that consolidates all FlowDistributor state
 * @returns {Object} All state variables and their setters
 */
export function useFlowDistributorState() {
  // ===== CORE DATA STATE =====
  const [bancos, setBancos] = useLocalStorage(STORAGE_KEYS.BANCOS, {
    bovedaMonte: {
      capitalActual: 0,
      historico: 0,
      registros: [],
      gastos: [],
      transferencias: [],
      ingresos: [],
    },
    utilidades: {
      capitalActual: 0,
      historico: 0,
      registros: [],
      gastos: [],
      transferencias: [],
      ingresos: [],
    },
    fletes: {
      capitalActual: 0,
      historico: 0,
      registros: [],
      gastos: [],
      transferencias: [],
      ingresos: [],
    },
    bancoCuscatlan: {
      capitalActual: 0,
      historico: 0,
      registros: [],
      gastos: [],
      transferencias: [],
      ingresos: [],
    },
    bancoAgricola: {
      capitalActual: 0,
      historico: 0,
      registros: [],
      gastos: [],
      transferencias: [],
      ingresos: [],
    },
    bancoAmerica: {
      capitalActual: 0,
      historico: 0,
      registros: [],
      gastos: [],
      transferencias: [],
      ingresos: [],
    },
  });

  const [ordenesCompra, setOrdenesCompra] = useLocalStorage(STORAGE_KEYS.ORDENES_COMPRA, []);
  const [distribuidores, setDistribuidores] = useLocalStorage(STORAGE_KEYS.DISTRIBUIDORES, []);
  const [ventas, setVentas] = useLocalStorage(STORAGE_KEYS.VENTAS, []);
  const [clientes, setClientes] = useLocalStorage(STORAGE_KEYS.CLIENTES, []);
  const [almacen, setAlmacen] = useLocalStorage(STORAGE_KEYS.ALMACEN, []);

  // ===== UI STATE =====
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeBanco, setActiveBanco] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // ===== FILTER STATE =====
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState('desc');

  // ===== MODAL STATE =====
  const [showAIChat, setShowAIChat] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  // ===== FORM STATE =====
  const [nuevaOrden, setNuevaOrden] = useState({
    distribuidor: '',
    fecha: new Date().toISOString().split('T')[0],
    productos: [{ descripcion: '', cantidad: 0, precioUnitario: 0 }],
  });

  const [nuevoDistribuidor, setNuevoDistribuidor] = useState({
    nombre: '',
    contacto: '',
    deuda: 0,
  });

  const [nuevaVenta, setNuevaVenta] = useState({
    cliente: '',
    fecha: new Date().toISOString().split('T')[0],
    productos: [{ descripcion: '', cantidad: 0, precioUnitario: 0 }],
    estadoPago: 'pendiente',
    metodoPago: 'efectivo',
  });

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    contacto: '',
    deuda: 0,
  });

  const [nuevoProducto, setNuevoProducto] = useState({
    descripcion: '',
    cantidad: 0,
    precio: 0,
    categoria: 'general',
  });

  // ===== BANK TRANSACTION STATE =====
  const [nuevoGasto, setNuevoGasto] = useState({
    banco: '',
    monto: 0,
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    categoria: 'operativo',
  });

  const [nuevoIngreso, setNuevoIngreso] = useState({
    banco: '',
    monto: 0,
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    origen: 'venta',
  });

  const [nuevaTransferencia, setNuevaTransferencia] = useState({
    bancoOrigen: '',
    bancoDestino: '',
    monto: 0,
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  // ===== EDIT STATE =====
  const [editingProducto, setEditingProducto] = useState(null);
  const [editingCliente, setEditingCliente] = useState(null);
  const [editingVenta, setEditingVenta] = useState(null);

  // ===== AI CHAT STATE =====
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  return {
    // Core data
    bancos,
    setBancos,
    ordenesCompra,
    setOrdenesCompra,
    distribuidores,
    setDistribuidores,
    ventas,
    setVentas,
    clientes,
    setClientes,
    almacen,
    setAlmacen,

    // UI state
    activeSection,
    setActiveSection,
    activeBanco,
    setActiveBanco,
    showSettingsModal,
    setShowSettingsModal,
    darkMode,
    setDarkMode,

    // Filter state
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,

    // Modal state
    showAIChat,
    setShowAIChat,
    showContextMenu,
    setShowContextMenu,
    contextMenuPosition,
    setContextMenuPosition,

    // Form state
    nuevaOrden,
    setNuevaOrden,
    nuevoDistribuidor,
    setNuevoDistribuidor,
    nuevaVenta,
    setNuevaVenta,
    nuevoCliente,
    setNuevoCliente,
    nuevoProducto,
    setNuevoProducto,

    // Bank transaction state
    nuevoGasto,
    setNuevoGasto,
    nuevoIngreso,
    setNuevoIngreso,
    nuevaTransferencia,
    setNuevaTransferencia,

    // Edit state
    editingProducto,
    setEditingProducto,
    editingCliente,
    setEditingCliente,
    editingVenta,
    setEditingVenta,

    // AI chat state
    aiMessages,
    setAiMessages,
    aiInput,
    setAiInput,
    aiLoading,
    setAiLoading,
  };
}

/**
 * Example usage in FlowDistributor.jsx:
 *
 * import { useFlowDistributorState } from './hooks/useFlowDistributorState';
 *
 * function FlowDistributor() {
 *   const state = useFlowDistributorState();
 *
 *   // Access state like:
 *   const { bancos, setBancos, ventas, setVentas, activeSection, setActiveSection } = state;
 *
 *   // Or use entire state object
 *   return <Dashboard {...state} />;
 * }
 */
