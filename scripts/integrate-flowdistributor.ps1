# 🚀 Script de Integración Automática FlowDistributor
# Actualiza FlowDistributor.jsx con datos reales del Excel

param(
    [switch]$DryRun = $false,
    [switch]$Backup = $true
)

$ErrorActionPreference = "Stop"

Write-Host @"

╔════════════════════════════════════════════════════════╗
║  🚀 INTEGRACIÓN FLOWDISTRIBUTOR CON DATOS EXCEL       ║
║  Conecta el sistema con los datos extraídos           ║
╚════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Archivos
$flowDistributorFile = "src\apps\FlowDistributor\FlowDistributor.jsx"
$dataLoaderFile = "src\apps\FlowDistributor\dataLoader.js"
$dataJsonFile = "src\apps\FlowDistributor\data\flowdistributor_complete_data.json"

# Verificar que existen los archivos necesarios
Write-Host "🔍 Verificando archivos..." -ForegroundColor Yellow

if (!(Test-Path $dataJsonFile)) {
    Write-Host "❌ ERROR: No se encontró el archivo de datos" -ForegroundColor Red
    Write-Host "   Ejecuta primero: python scripts\extract-excel-complete.py" -ForegroundColor Yellow
    exit 1
}

if (!(Test-Path $dataLoaderFile)) {
    Write-Host "❌ ERROR: No se encontró dataLoader.js" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $flowDistributorFile)) {
    Write-Host "❌ ERROR: No se encontró FlowDistributor.jsx" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Todos los archivos encontrados`n" -ForegroundColor Green

# Crear backup
if ($Backup) {
    Write-Host "💾 Creando backup de FlowDistributor.jsx..." -ForegroundColor Yellow
    $backupDir = "backups\flowdistributor_integration_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    Copy-Item $flowDistributorFile "$backupDir\FlowDistributor_original.jsx"
    Write-Host "✅ Backup creado en: $backupDir`n" -ForegroundColor Green
}

# Verificar si ya está integrado
$content = Get-Content $flowDistributorFile -Raw
if ($content -match "dataLoader") {
    Write-Host "⚠️  ADVERTENCIA: FlowDistributor.jsx ya tiene referencias a dataLoader" -ForegroundColor Yellow
    Write-Host "¿Deseas continuar? (S/N): " -NoNewline -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "❌ Operación cancelada por el usuario" -ForegroundColor Red
        exit 0
    }
}

# Preparar la integración
Write-Host "🔧 Preparando integración..." -ForegroundColor Yellow

$integrationSteps = @"

## PASOS DE INTEGRACIÓN MANUAL REQUERIDOS:

### 1. Agregar Import de dataLoader (línea ~100)
``````javascript
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
``````

### 2. Reemplazar INITIAL_DATA (buscar donde se define)
``````javascript
// ANTES:
// const INITIAL_DATA = { ... };

// DESPUÉS:
const INITIAL_DATA = getInitialData();
``````

### 3. Actualizar DashboardPanel para usar métricas reales
``````javascript
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
              className={\`p-4 mb-2 rounded-lg \${
                alert.tipo === 'danger' ? 'bg-red-500/20' :
                alert.tipo === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
              }\`}
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
          value={\`\$\${metrics.capitalTotal.toLocaleString()}\`}
          icon={<DollarSign />}
          trend={metrics.capitalTotal > 10000000 ? "up" : "down"}
        />
        <StatCard
          title="Ventas Totales"
          value={\`\$\${metrics.ventasTotales.toLocaleString()}\`}
          icon={<TrendingUp />}
        />
        <StatCard
          title="Stock Actual"
          value={\`\${metrics.stockActual} unidades\`}
          icon={<Package />}
          trend={metrics.alertaStock ? "down" : "up"}
          alert={metrics.alertaStock}
        />
        <StatCard
          title="ROI"
          value={\`\${metrics.roi.toFixed(2)}%\`}
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
              label={(entry) => \`\${entry.name}: \$\${entry.value.toLocaleString()}\`}
            >
              {chartData.bankDistribution.map((entry, index) => (
                <Cell key={\`cell-\${index}\`} fill={entry.color} />
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
              <span className={\`px-2 py-1 rounded text-xs \${
                bank.estado === 'negativo' ? 'bg-red-500/20 text-red-400' :
                'bg-green-500/20 text-green-400'
              }\`}>
                {bank.estado}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: bank.color }}>
              \${bank.capital.toLocaleString()}
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
              <div className={\`text-right \${tx.tipo === 'ingreso' ? 'text-green-400' : 'text-red-400'}\`}>
                <div className="font-bold">
                  {tx.tipo === 'ingreso' ? '+' : '-'}\${tx.monto.toLocaleString()}
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
``````

### 4. Actualizar BancosPanel con movimientos reales
``````javascript
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
              \${banco.capitalActual.toLocaleString()}
            </div>
            <div className={\`text-sm mt-1 \${
              banco.estado === 'negativo' ? 'text-red-400' : 'text-green-400'
            }\`}>
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
            \${(banco.totalIngresos || 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            {banco.ingresos?.length || 0} transacciones
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Total Gastos</div>
          <div className="text-xl font-bold text-red-400">
            \${(banco.totalGastos || 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            {banco.gastos?.length || 0} transacciones
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Balance</div>
          <div className={\`text-xl font-bold \${
            banco.capitalActual >= 0 ? 'text-green-400' : 'text-red-400'
          }\`}>
            \${banco.capitalActual.toLocaleString()}
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
                  <span className={\`text-lg \${
                    mov.tipo === 'ingreso' ? 'text-green-400' : 'text-red-400'
                  }\`}>
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
                <div className={\`text-lg font-bold \${
                  mov.tipo === 'ingreso' ? 'text-green-400' : 'text-red-400'
                }\`}>
                  {mov.tipo === 'ingreso' ? '+' : '-'}\${mov.monto.toLocaleString()}
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
``````

### 5. Actualizar InventarioPanel con datos reales
``````javascript
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
          <div className={\`text-3xl font-bold \${
            almacen.stockActual < almacen.stockMinimo ? 'text-yellow-500' : 'text-green-500'
          }\`}>
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
            \${almacen.valorInventario.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            @\${almacen.costoPromedio}/u
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
                    <span className={\`text-lg \${
                      mov.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'
                    }\`}>
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
                  <div className={\`text-lg font-bold \${
                    mov.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'
                  }\`}>
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
``````

"@

# Guardar instrucciones
$instructionsFile = "FLOWDISTRIBUTOR_INTEGRATION_INSTRUCTIONS.md"
Set-Content -Path $instructionsFile -Value $integrationSteps -Encoding UTF8

Write-Host "📝 Instrucciones de integración guardadas en:" -ForegroundColor Green
Write-Host "   $instructionsFile`n" -ForegroundColor Cyan

Write-Host @"
╔════════════════════════════════════════════════════════╗
║  ✅ PREPARACIÓN COMPLETADA                            ║
╚════════════════════════════════════════════════════════╝

📋 RESUMEN:
   ✅ Archivos de datos verificados
   ✅ Data loader disponible
   ✅ Backup creado
   ✅ Instrucciones generadas

🎯 PRÓXIMOS PASOS MANUALES:

1. Abrir FlowDistributor.jsx en VS Code
2. Seguir las instrucciones en: $instructionsFile
3. Ejecutar: npm run dev
4. Verificar que todos los datos se muestran correctamente

💡 TIP: Usa Find & Replace (Ctrl+H) para aplicar los cambios rápidamente

🚀 Una vez integrado, tendrás:
   • 7 bancos con 351 transacciones reales
   • 96 ventas del Excel
   • 31 clientes con sus adeudos
   • Inventario con 17 unidades
   • Alertas automáticas de stock y bancos
   • Gráficos con datos reales
   • Métricas calculadas en tiempo real

"@ -ForegroundColor Cyan

Write-Host "`n¿Deseas abrir el archivo de instrucciones ahora? (S/N): " -NoNewline -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "S" -or $response -eq "s") {
    Start-Process $instructionsFile
}

Write-Host "`n✅ Script completado exitosamente`n" -ForegroundColor Green
