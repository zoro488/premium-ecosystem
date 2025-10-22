#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔬 ANÁLISIS ENTERPRISE: EXCEL IMPORT VALIDATION\n');
console.log('='.repeat(60));

(async () => {
  try {
    // 1. Cargar datos del Excel
    console.log('\n📂 PASO 1: Cargando excel_data.json...');
    const excelDataPath = path.join(__dirname, 'public', 'excel_data.json');

    if (!fs.existsSync(excelDataPath)) {
      console.error('❌ ERROR: No se encuentra excel_data.json');
      process.exit(1);
    }

    const excelData = JSON.parse(fs.readFileSync(excelDataPath, 'utf-8'));
    console.log('✅ Archivo cargado exitosamente');
    console.log('   Tamaño:', (fs.statSync(excelDataPath).size / 1024).toFixed(2), 'KB');

    // 2. Análisis estructural básico
    console.log('\n📊 PASO 2: Análisis estructural...');
    console.log('   Ventas:', excelData.ventas?.length || 0);
    console.log('   Clientes:', excelData.clientes?.length || 0);
    console.log('   Órdenes de Compra:', excelData.ordenesCompra?.length || 0);
    console.log('   Distribuidores:', excelData.distribuidores?.length || 0);
    console.log('   Bancos:', excelData.bancos?.length || 0);

    // 3. Análisis de inconsistencias detectadas
    console.log('\n🔍 PASO 3: Detección de inconsistencias críticas...');

    const inconsistencias = {
      clientesNumericos: [],
      estatusMixtos: [],
      adeudosNegativos: [],
      preciosEnCero: [],
      referenciasOCFaltantes: [],
      calculosIncorrectos: []
    };

    // Detectar clientes numéricos
    excelData.ventas.forEach((venta, idx) => {
      if (typeof venta.cliente === 'number') {
        inconsistencias.clientesNumericos.push({
          indice: idx,
          cliente: venta.cliente,
          venta: venta.id
        });
      }
    });

    // Detectar estatus mixtos
    const estatusUnicos = new Set();
    excelData.ventas.forEach(v => {
      if (v.estadoPago) estatusUnicos.add(v.estadoPago);
      if (v.estatus) estatusUnicos.add(v.estatus);
    });

    // Detectar adeudos negativos
    excelData.clientes.forEach((cliente, idx) => {
      if (cliente.adeudo < 0) {
        inconsistencias.adeudosNegativos.push({
          indice: idx,
          nombre: cliente.nombre,
          adeudo: cliente.adeudo
        });
      }
    });

    // Detectar precios en 0
    excelData.ventas.forEach((venta, idx) => {
      if (venta.precioVenta === 0 || venta.precioVenta === '0') {
        inconsistencias.preciosEnCero.push({
          indice: idx,
          cliente: venta.cliente,
          concepto: venta.destino
        });
      }
    });

    // Detectar cálculos incorrectos
    excelData.ventas.forEach((venta, idx) => {
      const calculado = venta.cantidad * venta.precioVenta;
      const diferencia = Math.abs(calculado - venta.totalVenta);
      if (diferencia > 0.01) {
        inconsistencias.calculosIncorrectos.push({
          indice: idx,
          venta: venta.id,
          calculado,
          registrado: venta.totalVenta,
          diferencia
        });
      }
    });

    // Reportar inconsistencias
    console.log('   ⚠️  Clientes numéricos:', inconsistencias.clientesNumericos.length);
    if (inconsistencias.clientesNumericos.length > 0) {
      console.log('      Ejemplos:', inconsistencias.clientesNumericos.slice(0, 3).map(i => i.cliente).join(', '));
    }

    console.log('   ⚠️  Estatus únicos encontrados:', Array.from(estatusUnicos).join(', '));

    console.log('   ⚠️  Adeudos negativos:', inconsistencias.adeudosNegativos.length);
    if (inconsistencias.adeudosNegativos.length > 0) {
      inconsistencias.adeudosNegativos.slice(0, 2).forEach(i => {
        console.log(`      - ${i.nombre}: $${i.adeudo}`);
      });
    }

    console.log('   ⚠️  Precios en 0:', inconsistencias.preciosEnCero.length);
    if (inconsistencias.preciosEnCero.length > 0) {
      inconsistencias.preciosEnCero.slice(0, 3).forEach(i => {
        console.log(`      - ${i.concepto}`);
      });
    }

    console.log('   ⚠️  Cálculos incorrectos:', inconsistencias.calculosIncorrectos.length);
    if (inconsistencias.calculosIncorrectos.length > 0) {
      inconsistencias.calculosIncorrectos.slice(0, 2).forEach(i => {
        console.log(`      - ${i.venta}: Calc=$${i.calculado} vs Reg=$${i.registrado} (Diff=$${i.diferencia.toFixed(2)})`);
      });
    }

    // 4. Análisis de integridad referencial
    console.log('\n🔗 PASO 4: Validación de integridad referencial...');
    const ocIds = new Set(excelData.ordenesCompra.map(oc => oc.id));
    const clienteNombres = new Set(excelData.clientes.map(c => c.nombre));

    let ocFaltantes = 0;
    let clientesFaltantes = 0;

    excelData.ventas.forEach(venta => {
      if (venta.ocRelacionada && !ocIds.has(venta.ocRelacionada)) {
        ocFaltantes++;
      }
      if (typeof venta.cliente === 'string' && !clienteNombres.has(venta.cliente)) {
        clientesFaltantes++;
      }
    });

    console.log('   ⚠️  OCs faltantes:', ocFaltantes);
    console.log('   ⚠️  Clientes no encontrados:', clientesFaltantes);

    // 5. Guardar reporte
    console.log('\n💾 PASO 5: Generando reporte...');
    const reporte = {
      fecha: new Date().toISOString(),
      archivoProcesado: 'excel_data.json',
      estructura: {
        ventas: excelData.ventas?.length || 0,
        clientes: excelData.clientes?.length || 0,
        ordenesCompra: excelData.ordenesCompra?.length || 0,
        distribuidores: excelData.distribuidores?.length || 0,
        bancos: excelData.bancos?.length || 0
      },
      inconsistencias: {
        total: Object.values(inconsistencias).reduce((sum, arr) => sum + arr.length, 0),
        detalle: {
          clientesNumericos: inconsistencias.clientesNumericos.length,
          estatusMixtos: estatusUnicos.size,
          adeudosNegativos: inconsistencias.adeudosNegativos.length,
          preciosEnCero: inconsistencias.preciosEnCero.length,
          calculosIncorrectos: inconsistencias.calculosIncorrectos.length,
          ocFaltantes,
          clientesFaltantes
        },
        ejemplos: {
          clientesNumericos: inconsistencias.clientesNumericos.slice(0, 5),
          adeudosNegativos: inconsistencias.adeudosNegativos.slice(0, 3),
          preciosEnCero: inconsistencias.preciosEnCero.slice(0, 3),
          calculosIncorrectos: inconsistencias.calculosIncorrectos.slice(0, 3)
        }
      },
      integridad: {
        ocFaltantes,
        clientesFaltantes,
        ocsTotales: ocIds.size,
        clientesTotales: clienteNombres.size
      }
    };

    fs.writeFileSync(
      path.join(__dirname, 'analisis_excel_estructural.json'),
      JSON.stringify(reporte, null, 2)
    );

    console.log('✅ Reporte guardado: analisis_excel_estructural.json');
    console.log('\n' + '='.repeat(60));
    console.log('📈 RESUMEN EJECUTIVO:');
    console.log('   Total inconsistencias detectadas:', reporte.inconsistencias.total);
    console.log('   Necesita transformación:', reporte.inconsistencias.total > 0 ? 'SÍ' : 'NO');
    console.log('   Validación enterprise:', 'REQUERIDA');
    console.log('   Nivel de criticidad:', reporte.inconsistencias.total > 20 ? 'ALTO' : reporte.inconsistencias.total > 10 ? 'MEDIO' : 'BAJO');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();
