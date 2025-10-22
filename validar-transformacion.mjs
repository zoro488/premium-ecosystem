#!/usr/bin/env node
/**
 * 🔍 SCRIPT DE VALIDACIÓN - FLOWDISTRIBUTOR
 * Verifica que la transformación Excel → Sistema esté correcta
 */

import fs from 'fs';

console.log('🔍 VALIDANDO TRANSFORMACIÓN EXCEL → FLOWDISTRIBUTOR\n');
console.log('=' .repeat(80));

const validaciones = {
  pasadas: 0,
  fallidas: 0,
  advertencias: 0
};

// ===== VALIDACIÓN 1: Estructura de Storage =====
console.log('\n📦 VALIDACIÓN 1: Storage Keys');
try {
  const storageContent = fs.readFileSync('src/utils/storage.js', 'utf8');

  const keysRequeridos = [
    'FLOW_BANCOS',
    'FLOW_VENTAS',
    'FLOW_CLIENTES',
    'FLOW_ALMACEN',
    'FLOW_GASTOS_ABONOS', // ⭐ NUEVO
  ];

  let todosPresentados = true;
  keysRequeridos.forEach((key) => {
    if (storageContent.includes(key)) {
      console.log(`  ✅ ${key} encontrado`);
      validaciones.pasadas++;
    } else {
      console.log(`  ❌ ${key} NO encontrado`);
      validaciones.fallidas++;
      todosPresentados = false;
    }
  });

  if (todosPresentados) {
    console.log('  ✅ Todos los storage keys están presentes');
  }
} catch (error) {
  console.log(`  ❌ Error al leer storage.js: ${error.message}`);
  validaciones.fallidas++;
}

// ===== VALIDACIÓN 2: Estados en FlowDistributor =====
console.log('\n🧩 VALIDACIÓN 2: Estados en FlowDistributor');
try {
  const flowContent = fs.readFileSync('src/apps/FlowDistributor/FlowDistributor.jsx', 'utf8');

  const estadosRequeridos = [
    'const [bancos, setBancos]',
    'const [ventas, setVentas]',
    'const [clientes, setClientes]',
    'const [gastosAbonos, setGastosAbonos]', // ⭐ NUEVO
  ];

  estadosRequeridos.forEach((estado) => {
    if (flowContent.includes(estado)) {
      console.log(`  ✅ ${estado.split(',')[0]} encontrado`);
      validaciones.pasadas++;
    } else {
      console.log(`  ❌ ${estado.split(',')[0]} NO encontrado`);
      validaciones.fallidas++;
    }
  });

  // Validar que Bóveda USA esté presente
  if (flowContent.includes('bovedaUSA')) {
    console.log('  ✅ Banco "Bóveda USA" agregado correctamente');
    validaciones.pasadas++;
  } else {
    console.log('  ⚠️  Banco "Bóveda USA" no encontrado');
    validaciones.advertencias++;
  }
} catch (error) {
  console.log(`  ❌ Error al leer FlowDistributor.jsx: ${error.message}`);
  validaciones.fallidas++;
}

// ===== VALIDACIÓN 3: Funciones de Negocio =====
console.log('\n⚙️  VALIDACIÓN 3: Funciones de Negocio');
try {
  const flowContent = fs.readFileSync('src/apps/FlowDistributor/FlowDistributor.jsx', 'utf8');

  const funcionesRequeridas = [
    'calcularAdeudoCliente', // ⭐ NUEVA
    'marcarVentaPagada', // ⭐ NUEVA
    'registrarAbono', // ⭐ NUEVA
  ];

  funcionesRequeridas.forEach((funcion) => {
    if (flowContent.includes(`const ${funcion}`)) {
      console.log(`  ✅ Función ${funcion}() implementada`);
      validaciones.pasadas++;
    } else {
      console.log(`  ❌ Función ${funcion}() NO encontrada`);
      validaciones.fallidas++;
    }
  });
} catch (error) {
  console.log(`  ❌ Error al validar funciones: ${error.message}`);
  validaciones.fallidas++;
}

// ===== VALIDACIÓN 4: Estructura de Bancos =====
console.log('\n🏦 VALIDACIÓN 4: Estructura de Bancos');
try {
  const flowContent = fs.readFileSync('src/apps/FlowDistributor/FlowDistributor.jsx', 'utf8');

  const bancosRequeridos = [
    'bovedaMonte',
    'bovedaUSA', // ⭐ NUEVO
    'utilidades',
    'fletes',
    'azteca',
    'leftie',
    'profit',
  ];

  let todosPresentes = true;
  bancosRequeridos.forEach((banco) => {
    if (flowContent.includes(`${banco}:`)) {
      console.log(`  ✅ Banco "${banco}" configurado`);
      validaciones.pasadas++;
    } else {
      console.log(`  ❌ Banco "${banco}" NO configurado`);
      validaciones.fallidas++;
      todosPresentes = false;
    }
  });

  if (todosPresentes) {
    console.log(`  ✅ Los 7 bancos del Excel están configurados`);
  }

  // Validar campo "nombre" en bancos
  if (flowContent.match(/nombre:\s*['"]Bóveda Monte['"]/)) {
    console.log('  ✅ Bancos tienen campo "nombre" legible');
    validaciones.pasadas++;
  } else {
    console.log('  ⚠️  Bancos podrían no tener campo "nombre"');
    validaciones.advertencias++;
  }

  // Validar campo "moneda" en bancos
  if (flowContent.match(/moneda:\s*['"]MXN['"]/)) {
    console.log('  ✅ Bancos tienen campo "moneda" configurado');
    validaciones.pasadas++;
  } else {
    console.log('  ⚠️  Bancos podrían no tener campo "moneda"');
    validaciones.advertencias++;
  }
} catch (error) {
  console.log(`  ❌ Error al validar bancos: ${error.message}`);
  validaciones.fallidas++;
}

// ===== VALIDACIÓN 5: Documentación =====
console.log('\n📄 VALIDACIÓN 5: Documentación Generada');
try {
  const archivosDocumentacion = [
    'ANALISIS_EXCEL_COMPLETO.json',
    'MAPEO_LOGICA_EXCEL_A_SISTEMA.md',
    'TRANSFORMACION_COMPLETA_EXCEL_TO_SYSTEM.md',
    'PLAN_IMPLEMENTACION_LOGICA_NEGOCIO.md',
    'ESTADO_TRANSFORMACION.md',
  ];

  archivosDocumentacion.forEach((archivo) => {
    if (fs.existsSync(archivo)) {
      console.log(`  ✅ ${archivo} existe`);
      validaciones.pasadas++;
    } else {
      console.log(`  ⚠️  ${archivo} no encontrado`);
      validaciones.advertencias++;
    }
  });
} catch (error) {
  console.log(`  ❌ Error al validar documentación: ${error.message}`);
  validaciones.fallidas++;
}

// ===== RESUMEN FINAL =====
console.log('\n' + '='.repeat(80));
console.log('📊 RESUMEN DE VALIDACIÓN');
console.log('='.repeat(80));
console.log(`✅ Validaciones Pasadas:  ${validaciones.pasadas}`);
console.log(`❌ Validaciones Fallidas: ${validaciones.fallidas}`);
console.log(`⚠️  Advertencias:         ${validaciones.advertencias}`);

const porcentajeExito =
  (validaciones.pasadas /
    (validaciones.pasadas + validaciones.fallidas + validaciones.advertencias)) *
  100;
console.log(`\n📈 Porcentaje de Éxito: ${porcentajeExito.toFixed(1)}%`);

if (validaciones.fallidas === 0) {
  console.log('\n🎉 ¡VALIDACIÓN EXITOSA! El sistema está correctamente configurado.');
  console.log('✅ Listo para continuar con las siguientes fases.');
  process.exit(0);
} else {
  console.log('\n⚠️  HAY VALIDACIONES FALLIDAS. Revisa los errores arriba.');
  console.log('❌ Corrige los errores antes de continuar.');
  process.exit(1);
}
