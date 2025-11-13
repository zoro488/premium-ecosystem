/**
 * Análisis detallado de gastosAbonos en Firestore
 */
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDo7cXp9-iODHW5cxlM9UL32qz2z_L8krc',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.appspot.com',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🔍 Analizando gastosAbonos en Firestore');
console.log('─'.repeat(80));

const snapshot = await getDocs(collection(db, 'gastosAbonos'));

console.log(`📊 Total documentos: ${snapshot.size}`);

const origenes = {};
const fechas = {};

snapshot.forEach((doc) => {
  const data = doc.data();
  const origen = data.origen || 'Sin origen';
  const fecha = data.fecha || 'Sin fecha';

  origenes[origen] = (origenes[origen] || 0) + 1;
  fechas[fecha] = (fechas[fecha] || 0) + 1;
});

console.log(`\n📋 Distribución por Origen:`);
Object.entries(origenes)
  .sort((a, b) => b[1] - a[1])
  .forEach(([origen, count]) => {
    console.log(`   ${origen}: ${count}`);
  });

console.log(`\n📅 Primeras 10 fechas más frecuentes:`);
Object.entries(fechas)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([fecha, count]) => {
    console.log(`   ${fecha}: ${count}`);
  });

console.log(`\n📈 Total origenes únicos: ${Object.keys(origenes).length}`);
console.log(`📈 Total fechas únicas: ${Object.keys(fechas).length}`);

// Verificar si hay duplicados exactos
const registros = [];
snapshot.forEach((doc) => {
  const d = doc.data();
  registros.push(`${d.fecha}|${d.origen}|${d.valor}`);
});

const duplicados = registros.filter((item, index) => registros.indexOf(item) !== index);
console.log(`\n🔁 Registros duplicados exactos: ${duplicados.length}`);
if (duplicados.length > 0) {
  console.log(`   Primeros 5: ${duplicados.slice(0, 5).join(', ')}`);
}
