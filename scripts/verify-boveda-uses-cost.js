import ExcelJS from 'exceljs';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDH9iVJm5DfJKxL1QSXfB0xj_KO8nOtMQw',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.firebasestorage.app',
  messagingSenderId: '707896854016',
  appId: '1:707896854016:web:ed84f85f5ecdda1e5ad0b5',
  measurementId: 'G-ZJQM6BWEL8',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EXCEL_PATH = 'C:\\Users\\xpovo\\Downloads\\Copia de Administación_General.xlsx';

console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log('🔍 VERIFICACIÓN: BÓVEDA MONTE REGISTRA COSTO (NO PRECIO)');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

async function verificarBovedaMonte() {
  try {
    // 1. Leer Excel - Control_Maestro
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_PATH);
    const controlSheet = workbook.getWorksheet('Control_Maestro');

    console.log('📊 PARTE 1: ANALIZANDO VENTAS EN EXCEL (Control_Maestro)\n');
    console.log('─'.repeat(80));

    const ventasExcel = [];
    let rowIndex = 0;
    controlSheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return; // Skip headers

      const cells = row.values;
      const fecha = cells[0];

      // Solo ventas (requiere fecha en col[0])
      if (fecha && typeof fecha === 'object') {
        const fechaStr = fecha.toISOString ? fecha.toISOString().split('T')[0] : fecha;
        const oc = cells[1];
        const cantidad = parseFloat(cells[2]) || 0;
        const cliente = cells[3];
        const bovedaMonte = parseFloat(cells[4]) || 0;
        const precioVenta = parseFloat(cells[5]) || 0;
        const ingreso = parseFloat(cells[6]) || 0;

        if (bovedaMonte > 0 && rowIndex < 10) {
          ventasExcel.push({
            row: rowNumber,
            fecha: fechaStr,
            oc,
            cliente,
            cantidad,
            bovedaMonte, // ¿Costo o Precio?
            precioVenta, // Precio unitario
            ingreso, // ¿Precio total?
          });
          rowIndex++;
        }
      }
    });

    console.log(`📋 Encontradas ${ventasExcel.length} ventas para analizar\n`);

    // 2. Buscar OCs relacionadas
    console.log('📦 PARTE 2: ANALIZANDO ÓRDENES DE COMPRA\n');
    console.log('─'.repeat(80));

    const ocsSnapshot = await getDocs(collection(db, 'ordenesCompra'));
    const ocsMap = {};
    ocsSnapshot.forEach((doc) => {
      const data = doc.data();
      ocsMap[data.numeroOC] = data;
    });

    // 3. Comparar Bóveda Monte con Costos de OC
    console.log('\n🔬 PARTE 3: COMPARACIÓN BÓVEDA MONTE vs COSTO OC\n');
    console.log('─'.repeat(80));

    let costoMatches = 0;
    let precioMatches = 0;

    for (const venta of ventasExcel) {
      const oc = ocsMap[venta.oc];

      console.log(`\n📦 VENTA ${venta.row} - ${venta.cliente}`);
      console.log(`   Fecha: ${venta.fecha}`);
      console.log(`   OC: ${venta.oc}`);
      console.log(`   Cantidad vendida: ${venta.cantidad} unidades`);
      console.log('   ─────────────────────────────────────');

      if (oc) {
        const costoUnitario = oc.costoUnitario;
        const costoTotal = costoUnitario * venta.cantidad;
        const precioTotal = venta.precioVenta * venta.cantidad;

        console.log(`   📊 Datos de OC:`);
        console.log(`      Costo Unitario OC: $${costoUnitario.toLocaleString()}`);
        console.log(
          `      Costo Total (${venta.cantidad} × $${costoUnitario}): $${costoTotal.toLocaleString()}`
        );
        console.log(`   ─────────────────────────────────────`);
        console.log(`   💰 Datos de Venta Excel:`);
        console.log(`      Precio Venta Unitario: $${venta.precioVenta.toLocaleString()}`);
        console.log(
          `      Precio Total (${venta.cantidad} × $${venta.precioVenta}): $${precioTotal.toLocaleString()}`
        );
        console.log(`      Ingreso (col 6): $${venta.ingreso.toLocaleString()}`);
        console.log(`   ─────────────────────────────────────`);
        console.log(`   🏦 Bóveda Monte (col 4): $${venta.bovedaMonte.toLocaleString()}`);

        // Verificar qué representa Bóveda Monte
        const diffCosto = Math.abs(venta.bovedaMonte - costoTotal);
        const diffPrecio = Math.abs(venta.bovedaMonte - precioTotal);
        const diffIngreso = Math.abs(venta.bovedaMonte - venta.ingreso);

        console.log(`\n   🔍 ANÁLISIS:`);

        if (diffCosto < 1) {
          console.log(`   ✅ Bóveda Monte = COSTO TOTAL OC ($${costoTotal.toLocaleString()})`);
          console.log(`      → Diferencia: $${diffCosto.toFixed(2)}`);
          costoMatches++;
        } else if (diffPrecio < 1) {
          console.log(`   ❌ Bóveda Monte = PRECIO TOTAL ($${precioTotal.toLocaleString()})`);
          console.log(`      → Diferencia: $${diffPrecio.toFixed(2)}`);
          precioMatches++;
        } else if (diffIngreso < 1) {
          console.log(`   ⚠️  Bóveda Monte = INGRESO ($${venta.ingreso.toLocaleString()})`);
          console.log(`      → Diferencia: $${diffIngreso.toFixed(2)}`);
        } else {
          console.log(`   ❓ Bóveda Monte no coincide con ningún valor calculado`);
          console.log(`      Diff vs Costo: $${diffCosto.toFixed(2)}`);
          console.log(`      Diff vs Precio: $${diffPrecio.toFixed(2)}`);
          console.log(`      Diff vs Ingreso: $${diffIngreso.toFixed(2)}`);
        }
      } else {
        console.log(`   ⚠️  OC no encontrada en Firestore`);
      }
    }

    // 4. Verificar transaccionesBoveda en Firestore
    console.log('\n\n🔥 PARTE 4: VERIFICANDO FIRESTORE - transaccionesBoveda.bovedaMonte\n');
    console.log('─'.repeat(80));

    const bovedaSnapshot = await getDocs(
      query(collection(db, 'transaccionesBoveda'), where('panel', '==', 'bovedaMonte'))
    );

    console.log(`\n📊 Total registros en Bóveda Monte: ${bovedaSnapshot.size}\n`);

    let ingresoCount = 0;
    bovedaSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.tipo === 'ingreso' && ingresoCount < 5) {
        console.log(`💰 ${data.concepto || 'Ingreso'}`);
        console.log(`   Cliente: ${data.cliente || 'N/A'}`);
        console.log(`   Monto: $${data.monto?.toLocaleString() || 0}`);
        console.log(`   Fecha: ${data.fecha}`);
        console.log('');
        ingresoCount++;
      }
    });

    // Resumen
    console.log(
      '\n═══════════════════════════════════════════════════════════════════════════════'
    );
    console.log('📊 RESUMEN Y CONCLUSIÓN');
    console.log(
      '═══════════════════════════════════════════════════════════════════════════════\n'
    );

    console.log(`🎯 RESULTADO DEL ANÁLISIS:`);
    console.log(
      `   ✅ Ventas que coinciden con COSTO TOTAL OC: ${costoMatches}/${ventasExcel.length}`
    );
    console.log(
      `   ❌ Ventas que coinciden con PRECIO TOTAL: ${precioMatches}/${ventasExcel.length}`
    );

    if (costoMatches > precioMatches) {
      console.log(`\n✅ CONFIRMADO: Bóveda Monte registra COSTO TOTAL DE LA OC`);
      console.log(`   → Fórmula: Costo Unitario OC × Cantidad Vendida`);
    } else if (precioMatches > costoMatches) {
      console.log(`\n⚠️  ATENCIÓN: Bóveda Monte registra PRECIO TOTAL DE VENTA`);
      console.log(`   → Fórmula: Precio Venta Unitario × Cantidad Vendida`);
    } else {
      console.log(`\n❓ RESULTADO INCONCLUSO: Necesita más análisis`);
    }

    console.log(
      `\n🔥 Registros en Firestore transaccionesBoveda.bovedaMonte: ${bovedaSnapshot.size}`
    );
    console.log(`📊 Ventas en Excel: ${ventasExcel.length} analizadas`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verificarBovedaMonte();
