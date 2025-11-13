/**
 * 🔔 WidgetAlertasInteligentes - Sistema de alertas y notificaciones premium
 * Características:
 * - Alertas clasificadas por prioridad (crítica, alta, media, baja)
 * - Análisis automático de patrones
 * - Recomendaciones basadas en datos
 * - Sistema de notificaciones en tiempo real
 * - Acciones rápidas desde la alerta
 */
import React, { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Bell, CheckCircle, ChevronRight, Info, X } from 'lucide-react';

import { useFlowStore } from '../../../../stores/flowStore';
import { formatCurrency } from '../../utils/formatters';

type AlertPriority = 'critical' | 'high' | 'medium' | 'low';
type AlertCategory = 'ventas' | 'stock' | 'finanzas' | 'clientes' | 'sistema';

interface Alert {
  id: string;
  title: string;
  description: string;
  priority: AlertPriority;
  category: AlertCategory;
  timestamp: Date;
  action?: string;
  actionLabel?: string;
  data?: any;
}

export const WidgetAlertasInteligentes: React.FC = () => {
  const { ventas, bancos, almacen, clientes } = useFlowStore();
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [selectedFilter, setSelectedFilter] = useState<AlertPriority | 'all'>('all');

  // 🧠 Generar alertas inteligentes basadas en análisis de datos
  const alerts: Alert[] = useMemo(() => {
    const generatedAlerts: Alert[] = [];

    // 🚨 ALERTAS DE VENTAS
    const ventasPendientes = ventas.filter((v) => v.estatus === 'Pendiente');
    const totalPendiente = ventasPendientes.reduce((sum, v) => sum + (v.totalVenta || 0), 0);

    if (ventasPendientes.length > 5) {
      generatedAlerts.push({
        id: 'ventas-pendientes',
        title: 'Ventas Pendientes de Cobro',
        description: `Hay ${ventasPendientes.length} ventas pendientes por un total de ${formatCurrency(totalPendiente, 'USD')}`,
        priority: ventasPendientes.length > 10 ? 'critical' : 'high',
        category: 'ventas',
        timestamp: new Date(),
        action: 'ver-pendientes',
        actionLabel: 'Ver Detalles',
        data: { count: ventasPendientes.length, total: totalPendiente },
      });
    }

    // Ventas con mucho tiempo pendiente
    const ventasViejas = ventasPendientes.filter((v) => {
      const diasPendiente = Math.floor(
        (Date.now() - new Date(v.fecha).getTime()) / (1000 * 60 * 60 * 24)
      );
      return diasPendiente > 30;
    });

    if (ventasViejas.length > 0) {
      generatedAlerts.push({
        id: 'ventas-atrasadas',
        title: 'Ventas con Atraso Significativo',
        description: `${ventasViejas.length} ventas llevan más de 30 días pendientes. Requieren seguimiento urgente.`,
        priority: 'critical',
        category: 'ventas',
        timestamp: new Date(),
        action: 'seguimiento',
        actionLabel: 'Iniciar Seguimiento',
      });
    }

    // 📦 ALERTAS DE ALMACÉN
    const stockBajo = Object.entries(almacen).filter(
      ([_, item]: [string, any]) => item.cantidad < item.minimo
    );

    if (stockBajo.length > 0) {
      generatedAlerts.push({
        id: 'stock-bajo',
        title: 'Stock por Debajo del Mínimo',
        description: `${stockBajo.length} productos tienen stock crítico. Considera realizar un pedido pronto.`,
        priority: 'high',
        category: 'stock',
        timestamp: new Date(),
        action: 'ordenar',
        actionLabel: 'Crear Orden de Compra',
        data: { productos: stockBajo.length },
      });
    }

    // 💰 ALERTAS FINANCIERAS
    const bovedasBajas = Object.entries(bancos).filter(
      ([_, banco]: [string, any]) => (banco.capitalActual || 0) < 100000
    );

    if (bovedasBajas.length > 0) {
      generatedAlerts.push({
        id: 'capital-bajo',
        title: 'Bóvedas con Capital Bajo',
        description: `${bovedasBajas.length} bóvedas tienen menos de $100,000. Considera redistribuir capital.`,
        priority: 'medium',
        category: 'finanzas',
        timestamp: new Date(),
        action: 'redistribuir',
        actionLabel: 'Ver Bóvedas',
      });
    }

    // Análisis de rentabilidad
    const now = new Date();
    const thisMonth = ventas.filter((v) => {
      const vDate = new Date(v.fecha);
      return vDate.getMonth() === now.getMonth() && vDate.getFullYear() === now.getFullYear();
    });

    const totalUtilidades = thisMonth.reduce((sum, v) => sum + (v.totalUtilidades || 0), 0);
    const totalVentas = thisMonth.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
    const margenUtilidad = totalVentas > 0 ? (totalUtilidades / totalVentas) * 100 : 0;

    if (margenUtilidad < 15) {
      generatedAlerts.push({
        id: 'margen-bajo',
        title: 'Margen de Utilidad Bajo',
        description: `El margen del mes actual es ${margenUtilidad.toFixed(1)}%, por debajo del objetivo de 20%. Revisa precios y costos.`,
        priority: 'medium',
        category: 'finanzas',
        timestamp: new Date(),
        action: 'analizar',
        actionLabel: 'Análisis Detallado',
      });
    }

    // 👥 ALERTAS DE CLIENTES
    const clientesSinCompras = clientes.filter((c: any) => {
      const ultimaCompra = ventas
        .filter((v) => v.cliente === c.nombre)
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];

      if (!ultimaCompra) return true;

      const diasSinComprar = Math.floor(
        (Date.now() - new Date(ultimaCompra.fecha).getTime()) / (1000 * 60 * 60 * 24)
      );

      return diasSinComprar > 60;
    });

    if (clientesSinCompras.length > 0) {
      generatedAlerts.push({
        id: 'clientes-inactivos',
        title: 'Clientes Inactivos',
        description: `${clientesSinCompras.length} clientes no han realizado compras en más de 60 días. Considera contactarlos.`,
        priority: 'low',
        category: 'clientes',
        timestamp: new Date(),
        action: 'contactar',
        actionLabel: 'Ver Clientes',
      });
    }

    // 🎯 OPORTUNIDADES DE MEJORA
    const productosTop = ventas
      .flatMap((v) => v.productos || [])
      .reduce((acc: Record<string, number>, p: any) => {
        acc[p.nombre] = (acc[p.nombre] || 0) + (p.cantidad || 0);
        return acc;
      }, {});

    const topProducto = Object.entries(productosTop).sort((a, b) => b[1] - a[1])[0];

    if (topProducto) {
      generatedAlerts.push({
        id: 'producto-top',
        title: 'Producto con Mayor Demanda',
        description: `"${topProducto[0]}" es el más vendido con ${topProducto[1]} unidades. Asegura stock suficiente.`,
        priority: 'low',
        category: 'stock',
        timestamp: new Date(),
        action: 'revisar',
        actionLabel: 'Ver Stock',
      });
    }

    return generatedAlerts.filter((alert) => !dismissedAlerts.has(alert.id));
  }, [ventas, bancos, almacen, clientes, dismissedAlerts]);

  // 🎨 Configuración de estilos por prioridad
  const priorityConfig = {
    critical: {
      icon: AlertTriangle,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      label: 'Crítica',
    },
    high: {
      icon: AlertCircle,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      label: 'Alta',
    },
    medium: {
      icon: Info,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      label: 'Media',
    },
    low: {
      icon: CheckCircle,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      label: 'Baja',
    },
  };

  // 🎯 Filtrar alertas
  const filteredAlerts =
    selectedFilter === 'all' ? alerts : alerts.filter((alert) => alert.priority === selectedFilter);

  // ❌ Descartar alerta
  const dismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]));
  };

  return (
    <div className="h-full flex flex-col">
      {/* 🎯 HEADER */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            Alertas Inteligentes
          </h3>
          <motion.div
            className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {filteredAlerts.length}
          </motion.div>
        </div>

        {/* 🎚️ FILTROS */}
        <div className="flex gap-2 flex-wrap">
          <motion.button
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'all'
                ? 'bg-indigo-500 text-white'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedFilter('all')}
          >
            Todas ({alerts.length})
          </motion.button>
          {(Object.keys(priorityConfig) as AlertPriority[]).map((priority) => {
            const count = alerts.filter((a) => a.priority === priority).length;
            return (
              <motion.button
                key={priority}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === priority
                    ? 'text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
                style={
                  selectedFilter === priority
                    ? { backgroundColor: priorityConfig[priority].color }
                    : {}
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(priority)}
              >
                {priorityConfig[priority].label} ({count})
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 📋 LISTA DE ALERTAS */}
      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-slate-400">No hay alertas en esta categoría</p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert, index) => {
              const config = priorityConfig[alert.priority];
              const Icon = config.icon;

              return (
                <motion.div
                  key={alert.id}
                  className="p-4 rounded-xl cursor-pointer"
                  style={{
                    background: config.bgColor,
                    border: `1px solid ${config.borderColor}`,
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  layout
                >
                  <div className="flex items-start gap-3">
                    {/* Icono */}
                    <div
                      className="p-2 rounded-lg mt-1"
                      style={{ backgroundColor: `${config.color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: config.color }} />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissAlert(alert.id);
                          }}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{alert.description}</p>

                      {/* Acción */}
                      {alert.actionLabel && (
                        <motion.button
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                          style={{ backgroundColor: config.color }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {alert.actionLabel}
                          <ChevronRight className="w-3 h-3" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WidgetAlertasInteligentes;
