// 🔥 CARGAR DATOS REALES DESDE ARCHIVOS JSON LOCALES
// Ejecutar en CONSOLA DEL NAVEGADOR (F12) en http://localhost:3001/

(async function cargarDatosRealesCompletos() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  🔥 CARGANDO DATOS REALES DE ARCHIVOS JSON        ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  const db = firebase.firestore();
  let totalCargados = 0;

  // Función helper para cargar una colección
  const cargarColeccion = async (nombre, documentos) => {
    if (!documentos || documentos.length === 0) return 0;

    console.log(`📤 Cargando ${nombre}... (${documentos.length} documentos)`);

    const batch = db.batch();
    let count = 0;

    for (const doc of documentos) {
      const docId = doc.id || db.collection(nombre).doc().id;
      batch.set(db.collection(nombre).doc(docId), {
        ...doc,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      count++;

      if (count % 500 === 0) {
        await batch.commit();
      }
    }

    await batch.commit();
    console.log(`✅ ${nombre}: ${documentos.length} documentos`);
    return documentos.length;
  };

  try {
    // 1. Dashboard
    console.log('\n📊 Dashboard...');
    const dashboardRes = await fetch('/src/apps/FlowDistributor/data/panel-dashboard-manual.json');
    const dashboardData = await dashboardRes.json();

    await db
      .collection('dashboard')
      .doc('main')
      .set({
        ...dashboardData.dashboard,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    console.log('✅ Dashboard: 1 documento');
    totalCargados += 1;

    // 2. Órdenes de Compra
    console.log('\n📦 Órdenes de Compra...');
    const ordenesRes = await fetch(
      '/src/apps/FlowDistributor/data/panel-ordenes-compra-manual.json'
    );
    const ordenesData = await ordenesRes.json();
    totalCargados += await cargarColeccion('compras', ordenesData.distribuidores.ordenesCompra);
    totalCargados += await cargarColeccion(
      'distribuidores',
      ordenesData.distribuidores.distribuidores
    );

    // 3. Ventas Local
    console.log('\n💰 Ventas Local...');
    const ventasRes = await fetch('/src/apps/FlowDistributor/data/panel-ventas-local-manual.json');
    const ventasData = await ventasRes.json();
    totalCargados += await cargarColeccion('ventas', ventasData.ventasLocal);

    // 4. Clientes
    console.log('\n👥 Clientes...');
    const clientesRes = await fetch('/src/apps/FlowDistributor/data/panel-clientes-manual.json');
    const clientesData = await clientesRes.json();
    totalCargados += await cargarColeccion('clientes', clientesData.clientes);

    // 5. Gastos y Abonos
    console.log('\n💸 Gastos y Abonos...');
    const gyaRes = await fetch('/src/apps/FlowDistributor/data/panel-gastos-abonos-manual.json');
    const gyaData = await gyaRes.json();
    totalCargados += await cargarColeccion('gya', gyaData.gastosAbonos);

    // 6. Almacén Monte
    console.log('\n📦 Almacén Monte...');
    const almacenRes = await fetch(
      '/src/apps/FlowDistributor/data/panel-almacen-monte-manual.json'
    );
    const almacenData = await almacenRes.json();

    await db.collection('almacen').doc('main').set({
      ingresos: almacenData.almacenMonte.ingresos,
      salida: almacenData.almacenMonte.salida,
      rfActual: almacenData.almacenMonte.rfActual,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    totalCargados += await cargarColeccion(
      'almacen_ordenes',
      almacenData.almacenMonte.ordenesCompra
    );
    totalCargados += await cargarColeccion('almacen_salidas', almacenData.almacenMonte.salidas);
    totalCargados += await cargarColeccion('almacen_cortes', almacenData.almacenMonte.rfCortes);

    // 7-13. BANCOS
    const bancos = [
      { key: 'azteca', file: 'panel-azteca-manual.json', name: 'Azteca' },
      { key: 'bovedaMonte', file: 'panel-boveda-monte-manual.json', name: 'Bóveda Monte' },
      { key: 'bovedaUsa', file: 'panel-boveda-usa-manual.json', name: 'Bóveda USA' },
      { key: 'fleteSur', file: 'panel-fletes-manual.json', name: 'Flete Sur' },
      { key: 'leftie', file: 'panel-leftie-manual.json', name: 'Leftie' },
      { key: 'profit', file: 'panel-profit-manual.json', name: 'Profit' },
      { key: 'utilidades', file: 'panel-utilidades-manual.json', name: 'Utilidades' },
    ];

    for (const banco of bancos) {
      console.log(`\n🏦 ${banco.name}...`);
      const res = await fetch(`/src/apps/FlowDistributor/data/${banco.file}`);
      const data = await res.json();
      const bancoData = data[banco.key];

      // Guardar resumen del banco
      await db
        .collection('bancos')
        .doc(banco.key)
        .set({
          nombre: banco.name,
          ingresos: bancoData.ingresos || 0,
          gastos: bancoData.gastos || 0,
          rfActual: bancoData.rfActual || 0,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

      // Ingresos
      if (bancoData.ingresosList && bancoData.ingresosList.length > 0) {
        totalCargados += await cargarColeccion(`${banco.key}_ingresos`, bancoData.ingresosList);
      }

      // Gastos
      if (bancoData.gastosList && bancoData.gastosList.length > 0) {
        totalCargados += await cargarColeccion(`${banco.key}_gastos`, bancoData.gastosList);
      }

      // Si fleteSur tiene array 'gastos' también
      if (banco.key === 'fleteSur' && bancoData.gastos && Array.isArray(bancoData.gastos)) {
        totalCargados += await cargarColeccion(`${banco.key}_gastos_detalle`, bancoData.gastos);
      }

      // Cortes RF
      if (bancoData.rfCortes && bancoData.rfCortes.length > 0) {
        totalCargados += await cargarColeccion(`${banco.key}_cortes`, bancoData.rfCortes);
      }

      console.log(`✅ ${banco.name} completado`);
    }

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('✅ CARGA COMPLETA DE DATOS REALES');
    console.log('='.repeat(60));
    console.log(`📊 Total documentos cargados: ${totalCargados}`);
    console.log(`🔥 Proyecto: premium-ecosystem-1760790572`);
    console.log('\n🎉 ¡Todos los datos reales están en Firestore!');
    console.log('🔄 Recarga la página para verlos en el sistema\n');
  } catch (error) {
    console.error('❌ Error durante la carga:', error);
    console.log('\n⚠️ Asegúrate de ejecutar este script en http://localhost:3001/');
  }
})();
