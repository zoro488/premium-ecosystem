import { db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, runTransaction, Timestamp } from 'firebase/firestore';

const BANCOS = 'bancos';
const MOVIMIENTOS = 'movimientosBancarios';

export async function getBanco(id) {
  const snap = await getDoc(doc(db, BANCOS, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getTodosBancos() {
  const snap = await getDocs(collection(db, BANCOS));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getMovimientosBancarios(bancoId, filters = {}) {
  let q = query(collection(db, MOVIMIENTOS), where('bancoId', '==', bancoId));
  if (filters.tipo) q = query(q, where('tipo', '==', filters.tipo));
  const snap = await getDocs(query(q, orderBy('fecha', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getTransferencias(bancoId) {
  return getMovimientosBancarios(bancoId, { tipo: 'TRANSFERENCIA_ENTRADA' });
}

export async function crearTransferencia(data) {
  const { bancoOrigen, bancoDestino, monto, concepto } = data;
  return runTransaction(db, async (t) => {
    const orRef = doc(db, BANCOS, bancoOrigen);
    const deRef = doc(db, BANCOS, bancoDestino);
    const orSnap = await t.get(orRef);
    const deSnap = await t.get(deRef);
    if (!orSnap.exists() || !deSnap.exists()) throw new Error('Banco no existe');
    const orData = orSnap.data();
    if (orData.capitalActual < monto) throw new Error('Fondos insuficientes');
    const fecha = Timestamp.now();
    const salidaRef = doc(collection(db, MOVIMIENTOS));
    const entradaRef = doc(collection(db, MOVIMIENTOS));
    t.set(salidaRef, { bancoId: bancoOrigen, tipo: 'TRANSFERENCIA_SALIDA', monto: -monto, destino: bancoDestino, concepto, fecha });
    t.set(entradaRef, { bancoId: bancoDestino, tipo: 'TRANSFERENCIA_ENTRADA', monto, origen: bancoOrigen, concepto, fecha });
    t.update(orRef, { capitalActual: orData.capitalActual - monto });
    t.update(deRef, { capitalActual: deSnap.data().capitalActual + monto });
    return { salidaId: salidaRef.id, entradaId: entradaRef.id };
  });
}

export async function getSaldoTotalBancos() {
  const bancos = await getTodosBancos();
  return bancos.reduce((sum, b) => sum + (b.capitalActual || 0), 0);
}

export const getCuentasBancarias = getTodosBancos;
export const getCuentaBancaria = getBanco;

export async function createMovimientoBancario(data) {
  const ref = await addDoc(collection(db, MOVIMIENTOS), { ...data, createdAt: Timestamp.now() });
  return { id: ref.id, ...data };
}

export async function createCuentaBancaria(data) {
  const ref = await addDoc(collection(db, BANCOS), { ...data, capitalActual: 0, createdAt: Timestamp.now() });
  return { id: ref.id, ...data };
}

export async function updateCuentaBancaria(id, data) {
  await updateDoc(doc(db, BANCOS, id), data);
  return { id, ...data };
}

export async function deleteMovimientoBancario(id) {
  await deleteDoc(doc(db, MOVIMIENTOS, id));
  return { id };
}

export async function deleteCuentaBancaria(id) {
  await deleteDoc(doc(db, BANCOS, id));
  return { id };
}

export async function getIngresos(bancoId) {
  return getMovimientosBancarios(bancoId, { tipo: 'INGRESO' });
}

export async function crearIngreso(data) {
  const ref = await addDoc(collection(db, MOVIMIENTOS), { ...data, tipo: 'INGRESO', createdAt: Timestamp.now() });
  return { id: ref.id, ...data };
}

export async function actualizarIngreso(id, data) {
  await updateDoc(doc(db, MOVIMIENTOS, id), data);
  return { id, ...data };
}

export async function eliminarIngreso(id) {
  await deleteDoc(doc(db, MOVIMIENTOS, id));
  return { id };
}

export async function getGastos(bancoId) {
  return getMovimientosBancarios(bancoId, { tipo: 'GASTO' });
}

export async function crearGasto(data) {
  const ref = await addDoc(collection(db, MOVIMIENTOS), { ...data, tipo: 'GASTO', createdAt: Timestamp.now() });
  return { id: ref.id, ...data };
}

export async function actualizarGasto(id, data) {
  await updateDoc(doc(db, MOVIMIENTOS, id), data);
  return { id, ...data };
}

export async function eliminarGasto(id) {
  await deleteDoc(doc(db, MOVIMIENTOS, id));
  return { id };
}

export async function getRFActual(bancoId) {
  return getBanco(bancoId);
}

export async function calcularTotalesBanco(bancoId) {
  const movimientos = await getMovimientosBancarios(bancoId);
  return movimientos.reduce((acc, m) => {
    if (m.tipo === 'INGRESO') acc.ingresos += m.monto;
    if (m.tipo === 'GASTO') acc.gastos += Math.abs(m.monto);
    return acc;
  }, { ingresos: 0, gastos: 0 });
}

export function subscribeToIngresos(bancoId, callback) {
  return onSnapshot(
    query(collection(db, MOVIMIENTOS), where('bancoId', '==', bancoId), where('tipo', '==', 'INGRESO')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
}

export function subscribeToGastos(bancoId, callback) {
  return onSnapshot(
    query(collection(db, MOVIMIENTOS), where('bancoId', '==', bancoId), where('tipo', '==', 'GASTO')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
}

export function subscribeToRFActual(bancoId, callback) {
  return onSnapshot(doc(db, BANCOS, bancoId), snap => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}
