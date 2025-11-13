import { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  Download,
  Edit,
  Eye,
  Package,
  Plus,
  Search,
  Trash2,
  TrendingDown,
} from 'lucide-react';

import { ChronosButton } from '@/components/chronos-ui/ChronosButton';
import { ChronosCard } from '@/components/chronos-ui/ChronosCard';
import { ChronosKPI } from '@/components/chronos-ui/ChronosKPI';
import { useChronosData } from '@/hooks/useChronosData';

/**
 * 📦 ALMACEN VIEW
 * Gestión completa de inventario con control de stock
 */
export default function AlmacenView() {
  const { productos } = useChronosData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState<'all' | 'bajo' | 'agotado'>('all');

  // KPIs calculados
  const kpis = useMemo(() => {
    const totalProductos = productos.length;
    const valorInventario = productos.reduce((sum, p) => sum + p.costoPromedio * p.existencia, 0);
    const stockBajo = productos.filter((p) => p.existencia <= (p.stockMinimo || 10)).length;
    const agotados = productos.filter((p) => p.existencia === 0).length;

    return {
      totalProductos,
      valorInventario,
      stockBajo,
      agotados,
    };
  }, [productos]);

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const matchesSearch =
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStock = true;
      if (filterStock === 'bajo') {
        matchesStock =
          producto.existencia <= (producto.stockMinimo || 10) && producto.existencia > 0;
      }
      if (filterStock === 'agotado') {
        matchesStock = producto.existencia === 0;
      }

      return matchesSearch && matchesStock;
    });
  }, [productos, searchTerm, filterStock]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-chronos-white flex items-center gap-3">
            <Package className="w-10 h-10 text-neon-cyan" />
            Gestión de Inventario
          </h1>
          <p className="text-chronos-silver mt-2 text-lg">
            Control de stock y valoración de almacén
          </p>
        </div>
        <div className="flex gap-3">
          <ChronosButton variant="ghost" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </ChronosButton>
          <ChronosButton variant="primary" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Producto
          </ChronosButton>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChronosKPI
          label="Total Productos"
          value={kpis.totalProductos}
          format="number"
          color="cyan"
          pulse
        />
        <ChronosKPI
          label="Valor Inventario"
          value={kpis.valorInventario}
          format="currency"
          color="green"
        />
        <ChronosKPI label="Stock Bajo" value={kpis.stockBajo} format="number" color="yellow" />
        <ChronosKPI label="Agotados" value={kpis.agotados} format="number" color="red" />
      </div>

      {/* Filters */}
      <ChronosCard variant="glass">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chronos-silver" />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-chronos-obsidian border border-chronos-smoke rounded-lg text-chronos-white placeholder-chronos-silver focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStock('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStock === 'all'
                  ? 'bg-neon-cyan text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStock('bajo')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStock === 'bajo'
                  ? 'bg-neon-yellow text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Stock Bajo
            </button>
            <button
              onClick={() => setFilterStock('agotado')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStock === 'agotado'
                  ? 'bg-neon-red text-chronos-void'
                  : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
              }`}
            >
              Agotados
            </button>
          </div>
        </div>
      </ChronosCard>

      {/* Tabla de Productos */}
      <ChronosCard variant="glass-metal" title="Inventario Completo">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-chronos-smoke">
                <th className="text-left py-4 px-4 text-chronos-silver font-medium">Código</th>
                <th className="text-left py-4 px-4 text-chronos-silver font-medium">Producto</th>
                <th className="text-center py-4 px-4 text-chronos-silver font-medium">
                  Existencia
                </th>
                <th className="text-center py-4 px-4 text-chronos-silver font-medium">
                  Mín. Stock
                </th>
                <th className="text-right py-4 px-4 text-chronos-silver font-medium">
                  Costo Prom.
                </th>
                <th className="text-right py-4 px-4 text-chronos-silver font-medium">
                  Valor Total
                </th>
                <th className="text-center py-4 px-4 text-chronos-silver font-medium">Estado</th>
                <th className="text-center py-4 px-4 text-chronos-silver font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => {
                const valorTotal = producto.costoPromedio * producto.existencia;
                const stockBajo = producto.existencia <= (producto.stockMinimo || 10);
                const agotado = producto.existencia === 0;

                return (
                  <motion.tr
                    key={producto.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-chronos-graphite hover:bg-chronos-obsidian transition-colors"
                  >
                    <td className="py-4 px-4 text-chronos-white font-mono text-sm">
                      {producto.sku || '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-chronos-white font-medium">{producto.nombre}</div>
                        {producto.unidad && (
                          <div className="text-xs text-chronos-silver mt-1">
                            Unidad: {producto.unidad}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`text-lg font-bold ${
                          agotado
                            ? 'text-neon-red'
                            : stockBajo
                              ? 'text-neon-yellow'
                              : 'text-neon-green'
                        }`}
                      >
                        {producto.existencia}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-chronos-silver">
                      {producto.stockMinimo || 10}
                    </td>
                    <td className="py-4 px-4 text-right text-chronos-white font-mono">
                      ${producto.costoPromedio.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-chronos-white font-mono font-bold">
                      ${valorTotal.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {agotado ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-red/20 text-neon-red text-xs font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          Agotado
                        </span>
                      ) : stockBajo ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-yellow/20 text-neon-yellow text-xs font-medium">
                          <TrendingDown className="w-3 h-3" />
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-xs font-medium">
                          <BarChart3 className="w-3 h-3" />
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-chronos-graphite rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-neon-cyan" />
                        </button>
                        <button className="p-2 hover:bg-chronos-graphite rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-neon-purple" />
                        </button>
                        <button className="p-2 hover:bg-chronos-graphite rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-neon-red" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChronosCard>
    </div>
  );
}
