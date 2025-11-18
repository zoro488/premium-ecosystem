/**
 * Actualizar el campo balanceTotal en el documento de capitales
 */
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDo7cXp9-iODHW5cxlM9UL32qz2z_L8krc',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.appspot.com',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixBalance() {
  console.log('\n🔧 CORRIGIENDO BALANCE EN FIRESTORE\n');
  console.log('═'.repeat(80));

  const docRef = doc(db, 'capitales', 'balance-total');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log('\n📊 DATOS ACTUALES:');
    console.log(
      `  rfActualTotal: $${data.rfActualTotal?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`
    );
    console.log(
      `  balanceTotal: $${data.balanceTotal?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`
    );

    if (data.rfActualTotal && !data.balanceTotal) {
      console.log('\n✅ Agregando campo balanceTotal...');
      await updateDoc(docRef, {
        balanceTotal: data.rfActualTotal,
      });
      console.log('✅ Campo balanceTotal actualizado correctamente\n');

      const updatedSnap = await getDoc(docRef);
      const updatedData = updatedSnap.data();
      console.log('📊 DATOS ACTUALIZADOS:');
      console.log(
        `  balanceTotal: $${updatedData.balanceTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      );
    } else if (data.balanceTotal) {
      console.log('\n✅ El campo balanceTotal ya existe con valor correcto');
    }
  } else {
    console.log('❌ No se encontró el documento de capitales');
  }

  console.log('\n' + '═'.repeat(80) + '\n');
}

fixBalance().catch(console.error);
