
## PASOS DE INTEGRACIÓN MANUAL REQUERIDOS:

### 1. Agregar Import de dataLoader (línea ~100)
```javascript
// Después de las otras importaciones
import {
  getInitialData,
  getMetricsSummary,
  getBanksList,
  getRecentTransactions,
  getSystemAlerts,
  getDashboardChartData,
  getClientesConAdeudo,
  getDistribuidoresConAdeudo
} from './dataLoader';
```

### 2. Reemplazar INITIAL_DATA (buscar donde se define)
```javascript
// ANTES:
// const INITIAL_DATA = { ... };

// DESPUÉS:
const INITIAL_DATA = getInitialData();
```

### 3. Actualizar DashboardPanel para usar métricas reales
```javascript
const DashboardPanel = () => {
  const metrics = getMetricsSummary();
  const banks = getBanksList();
  const recentTx = getRecentTransactions(15);
  const alerts = getSystemAlerts();
  const chartData = getDashboardChartData();

  return (
    <div>
      {/* Mostrar alertas */}
      {alerts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">🚨 Alertas del Sistema</h3>
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={\p-4 mb-2 rounded-lg \\}
            >
              <div className="font-semibold">{alert.titulo}</div>
              <div className="text-sm">{alert.mensaje}</div>
            </div>
          ))}
        </div>
      )}

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Capital Total"
          value={\\$\\}
          icon={<DollarSign />}
          trend={metrics.capitalTotal > 10000000 ? "up" : "down"}
        />
        <StatCard
          title="Ventas Totales"
          value={\\$\\}
          icon={<TrendingUp />}
        />
        <StatCard
          title="Stock Actual"
          value={\\ unidades\}
          icon={<Package />}
          trend={metrics.alertaStock ? "down" : "up"}
          alert={metrics.alertaStock}
        />
        <StatCard
          title="ROI"
          value={\\%\}
          icon={<Target />}
          trend={metrics.roi > 0 ? "up" : "down"}
        />
      </div>

      {/* Distribución de capital por banco */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Distribución de Capital</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.bankDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => \\: \$\\}
            >
              {chartData.bankDistribution.map((entry, index) => (
                <Cell key={\cell-\\} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Lista de bancos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {banks.map(bank => (
          <div
            key={bank.id}
            className="bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={() => setActivePanel(bank.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{bank.icono}</span>
                <span className="font-semibold">{bank.nombre}</span>
              </div>
              <span className={\px-2 py-1 rounded text-xs \\}>
                {bank.estado}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: bank.color }}>
              \
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {bank.movimientos} movimientos
            </div>
          </div>
        ))}
      </div>

      {/* Transacciones recientes */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Transacciones Recientes</h3>
        <div className="space-y-2">
          {recentTx.slice(0, 10).map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium">{tx.banco}</div>
                <div className="text-sm text-gray-400">
                  {tx.cliente || tx.origen || 'Sin descripción'}
                </div>
              </div>
              <div className={\	ext-right \\}>
                <div className="font-bold">
                  {tx.tipo === 'ingreso' ? '+' : '-'}\
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(tx.fecha).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 4. Actualizar BancosPanel con movimientos reales
```javascript
const BancosPanel = ({ bancoId }) => {
  const initialData = getInitialData();
  const banco = initialData.bancos[bancoId];

  if (!banco) {
    return <div>Banco no encontrado</div>;
  }

  // Combinar ingresos y gastos
  const movimientos = [
    ...banco.ingresos.map(ing => ({ ...ing, tipo: 'ingreso' })),
    ...banco.gastos.map(gas => ({ ...gas, tipo: 'gasto' }))
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div>
      {/* Header del banco */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{banco.icono}</span>
            <div>
              <h2 className="text-2xl font-bold">{banco.nombre}</h2>
              <p className="text-gray-400">{banco.codigo}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Saldo Actual</div>
            <div className="text-3xl font-bold" style={{ color: banco.color }}>
              \
            </div>
            <div className={\	ext-sm mt-1 \\}>
              {banco.estado}
            </div>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Total Ingresos</div>
          <div className="text-xl font-bold text-green-400">
            \
          </div>
          <div className="text-xs text-gray-500">
            {banco.ingresos?.length || 0} transacciones
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Total Gastos</div>
          <div className="text-xl font-bold text-red-400">
            \
          </div>
          <div className="text-xs text-gray-500">
            {banco.gastos?.length || 0} transacciones
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Balance</div>
          <div className={\	ext-xl font-bold \\}>
            \
          </div>
        </div>
      </div>

      {/* Lista de movimientos */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Movimientos ({movimientos.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {movimientos.map(mov => (
            <div key={mov.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={\	ext-lg \\}>
                    {mov.tipo === 'ingreso' ? '↑' : '↓'}
                  </span>
                  <div>
                    <div className="font-medium">
                      {mov.cliente || mov.origen || 'Sin descripción'}
                    </div>
                    {mov.concepto && (
                      <div className="text-xs text-gray-400">{mov.concepto}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={\	ext-lg font-bold \\}>
                  {mov.tipo === 'ingreso' ? '+' : '-'}\
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(mov.fecha).toLocaleDateString('es-MX')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 5. Actualizar InventarioPanel con datos reales
```javascript
const InventarioPanel = () => {
  const { almacen } = getInitialData();

  return (
    <div>
      {/* Alerta de stock bajo */}
      {almacen.alertas.stockBajo && (
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-yellow-500" size={24} />
            <div>
              <div className="font-semibold text-yellow-500">⚠️ Stock Bajo</div>
              <div>
                El inventario está en {almacen.stockActual} unidades
                (mínimo recomendado: {almacen.stockMinimo})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de inventario */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Stock Actual</div>
          <div className={\	ext-3xl font-bold \\}>
            {almacen.stockActual}
          </div>
          <div className="text-xs text-gray-500">unidades</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Total Entradas</div>
          <div className="text-3xl font-bold text-blue-500">
            {almacen.totalEntradas}
          </div>
          <div className="text-xs text-gray-500">unidades</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Total Salidas</div>
          <div className="text-3xl font-bold text-red-500">
            {almacen.totalSalidas}
          </div>
          <div className="text-xs text-gray-500">unidades</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Valor Inventario</div>
          <div className="text-3xl font-bold text-green-500">
            \
          </div>
          <div className="text-xs text-gray-500">
            @\/u
          </div>
        </div>
      </div>

      {/* Movimientos recientes */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Movimientos Recientes ({almacen.movimientos.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {almacen.movimientos
            .slice()
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, 50)
            .map(mov => (
              <div key={mov.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={\	ext-lg \\}>
                      {mov.tipo === 'entrada' ? '↑' : '↓'}
                    </span>
                    <div>
                      <div className="font-medium">
                        {mov.cliente || mov.distribuidor || 'Sin descripción'}
                      </div>
                      {mov.oc && (
                        <div className="text-xs text-gray-400">OC: {mov.oc}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={\	ext-lg font-bold \\}>
                    {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad} unidades
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(mov.fecha).toLocaleDateString('es-MX')}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
```

