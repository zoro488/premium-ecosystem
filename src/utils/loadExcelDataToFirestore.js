/**
 * Script para cargar datos del Excel (JSON) a Firestore
 * Ejecutar una sola vez para inicializar la base de datos
 */
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';

import { db } from '../config/firebase';

export async function cargarDatosExcelAFirestore() {
  try {
    console.log('🚀 Iniciando carga de datos del Excel a Firestore...');

    // Fetch del JSON
    const response = await fetch(
      '/src/apps/FlowDistributor/data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json'
    );
    const data = await response.json();

    console.log('📊 Datos cargados del JSON:', {
      ventas: data.ventas?.length || 0,
      clientes: data.clientes?.length || 0,
      distribuidores: data.distribuidores?.length || 0,
      bancos: Object.keys(data.bancos || {}).length,
      almacen: data.almacen ? 'OK' : 'NO',
    });

    // === CLIENTES ===
    if (data.clientes && data.clientes.length > 0) {
      console.log('📥 Cargando clientes...');
      const batch = writeBatch(db);
      data.clientes.forEach((cliente) => {
        const clienteRef = doc(
          collection(db, 'clientes'),
          cliente.id || `CLI-${Date.now()}-${Math.random()}`
        );
        batch.set(clienteRef, {
          ...cliente,
          fechaCreacion: new Date().toISOString(),
        });
      });
      await batch.commit();
      console.log('✅ Clientes cargados:', data.clientes.length);
    }

    // === VENTAS ===
    if (data.ventas && data.ventas.length > 0) {
      console.log('📥 Cargando ventas...');
      const batch = writeBatch(db);
      let count = 0;
      for (const venta of data.ventas) {
        const ventaRef = doc(collection(db, 'ventas'), venta.id || `VENTA-${Date.now()}-${count}`);
        batch.set(ventaRef, venta);
        count++;

        // Firestore limit: 500 operations per batch
        if (count % 400 === 0) {
          await batch.commit();
          console.log(`  ✓ ${count} ventas procesadas...`);
        }
      }
      await batch.commit();
      console.log('✅ Ventas cargadas:', data.ventas.length);
    }

    // === DISTRIBUIDORES ===
    if (data.distribuidores && data.distribuidores.length > 0) {
      console.log('📥 Cargando distribuidores...');
      const batch = writeBatch(db);
      data.distribuidores.forEach((dist) => {
        const distRef = doc(collection(db, 'distribuidores'), dist.nombre);
        batch.set(distRef, dist);
      });
      await batch.commit();
      console.log('✅ Distribuidores cargados:', data.distribuidores.length);
    }

    // === BANCOS ===
    if (data.bancos) {
      console.log('📥 Cargando bancos...');
      for (const [nombreBanco, dataBanco] of Object.entries(data.bancos)) {
        const bancoRef = doc(db, 'bancos', nombreBanco);
        await setDoc(bancoRef, {
          nombre: nombreBanco,
          capitalActual: dataBanco.capitalActual || 0,
          ingresos: dataBanco.ingresos || [],
          gastos: dataBanco.gastos || [],
          cortes: dataBanco.cortes || [],
          transferencias: dataBanco.transferencias || [],
          fechaActualizacion: new Date().toISOString(),
        });
      }
      console.log('✅ Bancos cargados:', Object.keys(data.bancos).length);
    }

    // === ALMACEN ===
    if (data.almacen) {
      console.log('📥 Cargando almacén...');
      const almacenRef = doc(db, 'almacen', 'principal');
      await setDoc(almacenRef, {
        ...data.almacen,
        fechaActualizacion: new Date().toISOString(),
      });
      console.log('✅ Almacén cargado');
    }

    console.log('🎉 TODOS LOS DATOS CARGADOS EXITOSAMENTE');
    return { success: true };
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    return { success: false, error: error.message };
  }
}

// Para ejecutar desde la consola del navegador
if (typeof window !== 'undefined') {
  window.cargarDatosExcelAFirestore = cargarDatosExcelAFirestore;
}
