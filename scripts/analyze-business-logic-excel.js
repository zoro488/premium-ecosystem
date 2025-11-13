/**
 * 🔍 ANÁLISIS DE LÓGICA DE NEGOCIO DEL EXCEL
 *
 * Propósito: Verificar cómo funciona realmente el sistema según el Excel
 * - ¿Bóveda Monte registra COSTO o PRECIO?
 * - ¿Cómo se calculan las utilidades?
 * - ¿Cómo funcionan los fletes?
 * - ¿Qué pasa con ventas a crédito vs contado?
 */
import XLSX from 'xlsx';

const EXCEL_PATH = 'C:\\Users\\xpovo\\Downloads\\Copia de Administación_General.xlsx';

function parseNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isNaN(num) ? 0 : num;
}

function parseExcelDate(value) {
  if (!value) return '';
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  return value;
}

function cleanString(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

console.log('═'.repeat(80));
console.log('🔍 ANÁLISIS DE LÓGICA DE NEGOCIO - EXCEL');
console.log('═'.repeat(80));

const wb = XLSX.readFile(EXCEL_PATH);

// ═══════════════════════════════════════════════════════════════════════════
// 1️⃣ ANALIZAR CONTROL_MAESTRO (VENTAS)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n📊 PARTE 1: ANÁLISIS DE VENTAS (Control_Maestro)');
console.log('─'.repeat(80));

const controlSheet = wb.Sheets['Control_Maestro'];
const controlData = XLSX.utils.sheet_to_json(controlSheet, { header: 1, defval: null });

console.log('\n📋 Estructura de columnas (fila 3 - headers):');
const headers = controlData[2];
headers.forEach((header, idx) => {
  if (header) console.log(`   Col ${idx}: ${header}`);
});

console.log('\n🔍 ANALIZANDO PRIMERAS 5 VENTAS:');
console.log('─'.repeat(80));

let ventasAnalizadas = 0;
for (let i = 3; i < controlData.length && ventasAnalizadas < 5; i++) {
  const row = controlData[i];
  if (!row || row.length === 0) continue;

  const fecha = parseExcelDate(row[0]);
  if (!fecha) continue;

  const oc = cleanString(row[1]);
  const cantidad = parseNumber(row[2]);
  const cliente = cleanString(row[3]);
  const bovedaMonte = parseNumber(row[4]); // ← CLAVE: ¿Qué es este valor?
  const precioVenta = parseNumber(row[5]);
  const ingreso = parseNumber(row[6]);
  const flete = cleanString(row[7]);
  const fleteUtilidad = parseNumber(row[8]);
  const utilidad = parseNumber(row[9]);
  const estatus = cleanString(row[10]);

  if (cliente && ingreso > 0) {
    ventasAnalizadas++;
    console.log(`\n📦 VENTA #${ventasAnalizadas} (Fila ${i + 1}):`);
    console.log(`   Fecha: ${fecha}`);
    console.log(`   OC: ${oc}`);
    console.log(`   Cliente: ${cliente}`);
    console.log(`   Cantidad: ${cantidad}`);
    console.log(`   ─────────────────────────────────────`);
    console.log(`   Bóveda Monte (col 4): $${bovedaMonte.toLocaleString()}`);
    console.log(`   Precio Venta (col 5): $${precioVenta.toLocaleString()}`);
    console.log(`   Ingreso (col 6): $${ingreso.toLocaleString()}`);
    console.log(`   ─────────────────────────────────────`);
    console.log(`   Flete (col 7): ${flete || 'N/A'}`);
    console.log(`   Flete Utilidad (col 8): $${fleteUtilidad.toLocaleString()}`);
    console.log(`   Utilidad (col 9): $${utilidad.toLocaleString()}`);
    console.log(`   Estatus (col 10): ${estatus}`);

    // ANÁLISIS DE RELACIONES
    console.log(`\n   🔬 ANÁLISIS:`);

    // ¿Bóveda Monte = Ingreso?
    if (Math.abs(bovedaMonte - ingreso) < 0.01) {
      console.log(`   ✅ Bóveda Monte = Ingreso ($${ingreso.toLocaleString()})`);
    } else {
      console.log(`   ❌ Bóveda Monte (${bovedaMonte}) ≠ Ingreso (${ingreso})`);
    }

    // ¿Ingreso = Precio Venta?
    if (Math.abs(ingreso - precioVenta) < 0.01) {
      console.log(`   ✅ Ingreso = Precio Venta ($${precioVenta.toLocaleString()})`);
    } else {
      console.log(`   ❌ Ingreso (${ingreso}) ≠ Precio Venta (${precioVenta})`);
    }

    // Intentar encontrar costo unitario de la OC
    if (oc) {
      const ocData = buscarOC(wb, oc);
      if (ocData) {
        console.log(`\n   📦 DATOS DE LA OC (${oc}):`);
        console.log(`   Costo OC: $${ocData.costoUnitario.toLocaleString()}`);
        console.log(`   Costo Total OC: $${ocData.costoTotal.toLocaleString()}`);

        // ¿Utilidad = Ingreso - Costo OC?
        const utilidadCalculada1 = ingreso - ocData.costoUnitario;
        console.log(`\n   📊 CÁLCULO DE UTILIDAD:`);
        console.log(
          `   Opción 1: Ingreso - Costo OC = ${ingreso} - ${ocData.costoUnitario} = ${utilidadCalculada1.toFixed(2)}`
        );

        if (Math.abs(utilidad - utilidadCalculada1) < 0.01) {
          console.log(`   ✅ Utilidad Excel = Opción 1`);
        } else {
          console.log(
            `   ❌ Utilidad Excel (${utilidad}) ≠ Opción 1 (${utilidadCalculada1.toFixed(2)})`
          );
        }

        // ¿Utilidad = Ingreso - (Costo + Flete)?
        const utilidadCalculada2 = ingreso - ocData.costoUnitario - fleteUtilidad;
        console.log(
          `   Opción 2: Ingreso - (Costo + Flete) = ${ingreso} - (${ocData.costoUnitario} + ${fleteUtilidad}) = ${utilidadCalculada2.toFixed(2)}`
        );

        if (Math.abs(utilidad - utilidadCalculada2) < 0.01) {
          console.log(`   ✅ Utilidad Excel = Opción 2`);
        } else {
          console.log(
            `   ❌ Utilidad Excel (${utilidad}) ≠ Opción 2 (${utilidadCalculada2.toFixed(2)})`
          );
        }
      }
    }

    console.log('\n' + '─'.repeat(80));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2️⃣ ANALIZAR BÓVEDA MONTE
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n💰 PARTE 2: ANÁLISIS DE BÓVEDA MONTE');
console.log('─'.repeat(80));

const bovedaSheet = wb.Sheets['Bóveda_Monte'];
const bovedaData = XLSX.utils.sheet_to_json(bovedaSheet, { header: 1, defval: null });

console.log('\n📋 Estructura de columnas Bóveda Monte:');
const bovedaHeaders = bovedaData[2];
bovedaHeaders.forEach((header, idx) => {
  if (header) console.log(`   Col ${idx}: ${header}`);
});

console.log('\n🔍 ANALIZANDO PRIMEROS 5 INGRESOS EN BÓVEDA MONTE:');
console.log('─'.repeat(80));

let ingresosAnalizados = 0;
for (let i = 3; i < bovedaData.length && ingresosAnalizados < 5; i++) {
  const row = bovedaData[i];
  if (!row || row.length === 0) continue;

  const fecha = parseExcelDate(row[0]);
  if (!fecha) continue;

  const cliente = cleanString(row[1]);
  const ingreso = parseNumber(row[2]);

  if (ingreso > 0) {
    ingresosAnalizados++;
    console.log(`\n💵 INGRESO #${ingresosAnalizados} (Fila ${i + 1}):`);
    console.log(`   Fecha: ${fecha}`);
    console.log(`   Cliente: ${cliente}`);
    console.log(`   Ingreso: $${ingreso.toLocaleString()}`);
    console.log(`   TC: ${parseNumber(row[3])}`);
    console.log(`   Pesos: $${parseNumber(row[4]).toLocaleString()}`);

    // Buscar si este ingreso coincide con alguna venta en Control_Maestro
    const ventaRelacionada = buscarVentaPorCliente(controlData, cliente, fecha);
    if (ventaRelacionada) {
      console.log(`\n   📊 VENTA RELACIONADA EN CONTROL_MAESTRO:`);
      console.log(`   Bóveda Monte (col 4): $${ventaRelacionada.bovedaMonte.toLocaleString()}`);
      console.log(`   Precio Venta (col 5): $${ventaRelacionada.precioVenta.toLocaleString()}`);
      console.log(`   Ingreso (col 6): $${ventaRelacionada.ingreso.toLocaleString()}`);

      console.log(`\n   🔬 COMPARACIÓN:`);
      if (Math.abs(ingreso - ventaRelacionada.bovedaMonte) < 0.01) {
        console.log(`   ✅ Bóveda Monte ingreso = Control_Maestro col 4 (Bóveda Monte)`);
      }
      if (Math.abs(ingreso - ventaRelacionada.ingreso) < 0.01) {
        console.log(`   ✅ Bóveda Monte ingreso = Control_Maestro col 6 (Ingreso)`);
      }
      if (Math.abs(ingreso - ventaRelacionada.precioVenta) < 0.01) {
        console.log(`   ✅ Bóveda Monte ingreso = Control_Maestro col 5 (Precio Venta)`);
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3️⃣ ANALIZAR FLETE SUR
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n🚚 PARTE 3: ANÁLISIS DE FLETE SUR');
console.log('─'.repeat(80));

const fleteSheet = wb.Sheets['Flete_Sur'];
const fleteData = XLSX.utils.sheet_to_json(fleteSheet, { header: 1, defval: null });

console.log('\n📋 Estructura de columnas Flete Sur:');
const fleteHeaders = fleteData[2];
fleteHeaders.forEach((header, idx) => {
  if (header) console.log(`   Col ${idx}: ${header}`);
});

console.log('\n🔍 ANALIZANDO PRIMEROS 5 GASTOS EN FLETE SUR:');
console.log('─'.repeat(80));

let fletesAnalizados = 0;
for (let i = 3; i < fleteData.length && fletesAnalizados < 5; i++) {
  const row = fleteData[i];
  if (!row || row.length === 0) continue;

  const fecha = parseExcelDate(row[0]);
  if (!fecha) continue;

  const gasto = parseNumber(row[8] || row[11] || row[12]);

  if (gasto > 0) {
    fletesAnalizados++;
    console.log(`\n🚛 FLETE #${fletesAnalizados} (Fila ${i + 1}):`);
    console.log(`   Fecha: ${fecha}`);
    console.log(`   Gasto: $${gasto.toLocaleString()}`);
    console.log(`   Concepto: ${cleanString(row[7] || row[11])}`);

    // ¿Es un gasto fijo de $500?
    if (Math.abs(gasto - 500) < 0.01) {
      console.log(`   ✅ Gasto = $500 USD (fijo)`);
    } else {
      console.log(`   ℹ️  Gasto = $${gasto} (no es $500)`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4️⃣ ANALIZAR UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n💎 PARTE 4: ANÁLISIS DE UTILIDADES');
console.log('─'.repeat(80));

const utilidadesSheet = wb.Sheets['Utilidades'];
const utilidadesData = XLSX.utils.sheet_to_json(utilidadesSheet, { header: 1, defval: null });

console.log('\n📋 Estructura de columnas Utilidades:');
const utilidadesHeaders = utilidadesData[2];
utilidadesHeaders.forEach((header, idx) => {
  if (header) console.log(`   Col ${idx}: ${header}`);
});

console.log('\n🔍 ANALIZANDO PRIMEROS 5 REGISTROS EN UTILIDADES:');
console.log('─'.repeat(80));

let utilidadesAnalizadas = 0;
for (let i = 3; i < utilidadesData.length && utilidadesAnalizadas < 5; i++) {
  const row = utilidadesData[i];
  if (!row || row.length === 0) continue;

  const fecha = parseExcelDate(row[0]);
  if (!fecha) continue;

  const ingreso = parseNumber(row[2]);

  if (ingreso > 0) {
    utilidadesAnalizadas++;
    console.log(`\n💰 UTILIDAD #${utilidadesAnalizadas} (Fila ${i + 1}):`);
    console.log(`   Fecha: ${fecha}`);
    console.log(`   Cliente: ${cleanString(row[1])}`);
    console.log(`   Ingreso: $${ingreso.toLocaleString()}`);

    // Intentar encontrar los costos y calcular utilidad
    const tc = parseNumber(row[3]);
    const pesos = parseNumber(row[4]);

    console.log(`   TC: ${tc}`);
    console.log(`   Pesos: $${pesos.toLocaleString()}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 5️⃣ RESUMEN Y CONCLUSIONES
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n═'.repeat(80));
console.log('📊 RESUMEN Y CONCLUSIONES');
console.log('═'.repeat(80));

console.log('\n🎯 HALLAZGOS CLAVE:');
console.log('\n1️⃣ ESTRUCTURA DE VENTAS (Control_Maestro):');
console.log('   - Col 0: Fecha');
console.log('   - Col 1: OC (Orden de Compra)');
console.log('   - Col 2: Cantidad');
console.log('   - Col 3: Cliente');
console.log('   - Col 4: Bóveda Monte (¿COSTO o PRECIO?)');
console.log('   - Col 5: Precio Venta');
console.log('   - Col 6: Ingreso');
console.log('   - Col 7: Flete');
console.log('   - Col 8: Flete Utilidad');
console.log('   - Col 9: Utilidad');
console.log('   - Col 10: Estatus');

console.log('\n💡 ANÁLISIS PENDIENTE:');
console.log('   ¿Bóveda Monte (col 4) = Costo de OC o Precio de Venta?');
console.log('   ¿Ingreso (col 6) = Precio total de venta?');
console.log('   ¿Utilidad (col 9) = Ingreso - Costo o Ingreso - (Costo + Flete)?');

console.log('\n');

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

function buscarOC(workbook, numeroOC) {
  const ocSheet = workbook.Sheets['Ordenes_de_Compra'];
  if (!ocSheet) return null;

  const ocData = XLSX.utils.sheet_to_json(ocSheet, { header: 1, defval: null });

  for (let i = 3; i < ocData.length; i++) {
    const row = ocData[i];
    if (!row) continue;

    const oc = cleanString(row[1]);
    if (oc === numeroOC) {
      return {
        numeroOC: oc,
        distribuidor: cleanString(row[2]),
        cantidad: parseNumber(row[3]),
        costoUnitario: parseNumber(row[4]),
        costoTotal: parseNumber(row[5]),
      };
    }
  }

  return null;
}

function buscarVentaPorCliente(controlData, cliente, fecha) {
  for (let i = 3; i < controlData.length; i++) {
    const row = controlData[i];
    if (!row) continue;

    const fechaRow = parseExcelDate(row[0]);
    const clienteRow = cleanString(row[3]);

    if (clienteRow === cliente && fechaRow === fecha) {
      return {
        bovedaMonte: parseNumber(row[4]),
        precioVenta: parseNumber(row[5]),
        ingreso: parseNumber(row[6]),
        flete: cleanString(row[7]),
        fleteUtilidad: parseNumber(row[8]),
        utilidad: parseNumber(row[9]),
      };
    }
  }

  return null;
}
