/**
 * ═══════════════════════════════════════════════════════════════
 * 📋 EJEMPLO DE DATOS CSV
 * ═══════════════════════════════════════════════════════════════
 *
 * Este archivo muestra la estructura esperada de cada CSV.
 * Usa esto como referencia para validar tus archivos antes
 * de ejecutar la importación.
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// 1. CLIENTES.CSV
// ═══════════════════════════════════════════════════════════════
/*
Headers en fila 4:
cliente, actual, deuda, abonos, pendiente, observaciones

Ejemplo de datos:
Juan Pérez, $1,500.00, $5,000.00, $2,000.00, $3,000.00, Cliente frecuente
María González, $800.00, $2,500.00, $1,200.00, $1,300.00, Buen pagador
*/

// ═══════════════════════════════════════════════════════════════
// 2. DISTRIBUIDORES.CSV
// ═══════════════════════════════════════════════════════════════
/*
Headers en fila 3:
OC, Fecha, Origen, Cantidad, Costo Distribuidor, Costo Transporte,
Costo Por Unidad, Costo Total, Deuda

Ejemplo:
OC-001, 01/01/2024, China, 100, $500,000.00, $50,000.00,
$5,500.00, $550,000.00, $100,000.00

Segunda tabla en el mismo archivo:
Distribuidores, Costo total, Abonos, Pendiente

Ejemplo:
Distribuidor A, $1,500,000.00, $800,000.00, $700,000.00
*/

// ═══════════════════════════════════════════════════════════════
// 3. CONTROL_MAESTRO.CSV (Ventas)
// ═══════════════════════════════════════════════════════════════
/*
Headers en fila 3:
Fecha, OC Relacionada, Cantidad, Cliente, Bóveda Monte,
Precio De Venta, Ingreso, Flete, Flete Utilidad, Utilidad,
Estatus, Concepto

Ejemplo:
15/01/2024, OC-001, 50, Juan Pérez, $250,000.00, $6,300.00,
$315,000.00, $15,000.00, $10,000.00, $50,000.00, Completado,
Venta normal
*/

// ═══════════════════════════════════════════════════════════════
// 4. ALMACEN_MONTE.CSV
// ═══════════════════════════════════════════════════════════════
/*
Datos en fila 1 (sin headers):
Col A: Ingresos totales (ej. 1,500)
Col F: Stock actual (ej. 850)
Col I: Salidas totales (ej. 650)

Ejemplo de fila 1:
1,500, [vacio], [vacio], [vacio], [vacio], 850, [vacio], [vacio], 650
*/

// ═══════════════════════════════════════════════════════════════
// 5-11. ARCHIVOS DE BANCOS (7 archivos)
// ═══════════════════════════════════════════════════════════════

// --- BÓVEDA_MONTE.CSV ---
/*
Fila 2, Col A: Saldo actual ($1,500,000.00)

Gastos desde fila 1:
Headers: Fecha, Origen del Gastos o Abono, Gasto, TC, Pesos,
         Destino, Concepto, Observaciones

Ejemplo:
05/01/2024, Bóveda Monte, $50,000.00, 18.5, $925,000.00,
NA, Pago a proveedor, Mensual
*/

// --- BÓVEDA_USA.CSV ---
/*
Fila 2, Col I: Saldo actual ($250,000.00 USD)

Gastos desde fila 3:
Headers: Fecha, Origen del Gastos o Abono, Gasto, TC, Pesos,
         Destino, Concepto, Observaciones

Ejemplo de transferencia:
10/01/2024, Bóveda USA, $30,000.00, 18.5, $555,000.00,
Bóveda Monte, Transferencia, Envío de capital
*/

// --- PROFIT.CSV ---
/*
Fila 2, Col I: Saldo actual ($500,000.00)

Gastos desde fila 3:
Headers: Fecha, Corte, Fecha_1, Cliente, Lugar, Serie, Gasto,
         Porcentaje, Gasto Total, Observaciones

Ejemplo:
12/01/2024, Enero, 12/01/2024, Cliente A, CDMX, A-001,
$10,000.00, 15%, $11,500.00, Comisión de venta
*/

// --- LEFTIE.CSV ---
/*
Fila 2, Col I: Saldo actual ($180,000.00)

Gastos desde fila 3:
Headers: Fecha, Corte, Fecha_1, Origen del Gastos o Abono,
         Gasto, TC, Dolares, Destino, Concepto, Observaciones

Ejemplo:
08/01/2024, Enero, 08/01/2024, Leftie, $5,000.00, 18.5,
$270.27, NA, Pago de servicio, Internet
*/

// --- FLETE_SUR.CSV ---
/*
Fila 2, Col F: Saldo actual ($120,000.00)

Gastos desde fila 3:
Headers: Fecha, Origen del Gastos o Abono, Gasto, TC, Pesos,
         Destino, Concepto, Observaciones

Ejemplo:
14/01/2024, Flete Sur, $8,000.00, 18.5, $148,000.00,
NA, Transporte, Envío a Monterrey
*/

// --- UTILIDADES.CSV ---
/*
Fila 2, Col F: Saldo actual ($350,000.00)

Gastos desde fila 3:
Headers: Fecha, Origen del Gastos o Abono, Gasto, TC, Pesos,
         Concepto, Observaciones

Nota: NO tiene columna "Destino"

Ejemplo:
20/01/2024, Utilidades, $15,000.00, 18.5, $277,500.00,
Inversión, Capital de trabajo
*/

// --- AZTECA.CSV ---
/*
Fila 2, Col I: Saldo actual ($90,000.00)

Gastos desde fila 3:
Headers: Fecha, Origen del Gastos o Abono, Gasto, Destino,
         A, Observaciones, Concepto

Ejemplo:
22/01/2024, Azteca, $3,000.00, NA, [vacio],
Comisión bancaria, Cargo mensual
*/

// ═══════════════════════════════════════════════════════════════
// 📊 RESUMEN DE COLECCIONES FIRESTORE GENERADAS
// ═══════════════════════════════════════════════════════════════
/*
1. bancos (7 documentos)
   - bovedaMonte
   - bovedaUsa
   - profit
   - leftie
   - fleteSur
   - utilidades
   - azteca

2. gastos (N documentos - todos los gastos reales)
   - Incluye todos los gastos donde Destino = "NA" o vacío

3. transferencias (N documentos - movimientos entre bancos)
   - Incluye todos los movimientos donde Destino = otro banco

4. clientes (N documentos)
   - Cada cliente con sus deudas/abonos

5. distribuidores (N documentos)
   - Cada distribuidor con sus pagos/pendientes

6. ordenesCompra (N documentos)
   - Cada OC con sus costos

7. ventas (N documentos)
   - Todas las ventas registradas

8. productos (1 documento: PROD-001)
   - Producto principal con costo y precio

9. estadoGlobal/almacen (1 documento)
   - Ingresos, stock actual, salidas
*/

// ═══════════════════════════════════════════════════════════════
// 🎯 VALIDACIONES AUTOMÁTICAS QUE HACE EL SCRIPT
// ═══════════════════════════════════════════════════════════════
/*
✅ Convierte strings de moneda a números (ej. "$1,500.00" → 1500)
✅ Normaliza nombres de bancos (ej. "Bóveda Monte" → "bovedamonte")
✅ Detecta automáticamente si es gasto o transferencia
✅ Genera IDs únicos para documentos sin ID
✅ Valida que los archivos existan antes de procesarlos
✅ Maneja campos vacíos/undefined sin errores
✅ Usa batches de Firestore para operaciones masivas (límite 500)
✅ Agrega timestamps a documentos (fechaActualizacion, fechaRegistro)
✅ Marca documentos como activos por defecto (activo: true)
*/

// ═══════════════════════════════════════════════════════════════
// ⚠️  ERRORES COMUNES Y SOLUCIONES
// ═══════════════════════════════════════════════════════════════
/*
❌ "Archivo no encontrado"
   → Verifica el nombre EXACTO del archivo (incluyendo espacios)
   → Coloca todos los CSVs en: data/csv/

❌ "Cannot find module 'csv-parser'"
   → Ejecuta: npm install

❌ "Permission denied" en Firestore
   → Cambia las reglas de Firestore temporalmente (ver README)

❌ "Los datos no aparecen en la UI"
   → Verifica que los nombres de colecciones coincidan
   → Revisa Firebase Console para confirmar la importación

❌ "TypeError: Cannot read property of undefined"
   → Verifica que los headers CSV coincidan con los esperados
   → Ejecuta: npm run validate:csv para validar estructura

❌ "Batch commit failed"
   → Verifica tu conexión a internet
   → Confirma que Firebase esté activo (no en mantenimiento)
*/

export { };
