/**
 * 💰 useGYA Hook - Gastos Y Abonos
 * =================================
 * Hook para acceso en tiempo real a datos de GYA desde Firebase
 */
import { useEffect, useState } from 'react';

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

import { db } from '../../../lib/firebase';

export const useGYA = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }

    const q = query(collection(db, 'gya'), orderBy('fecha', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const datos = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            valor: parseFloat(data.valor) || 0,
            fecha: data.fecha?.toDate?.() || data.fecha,
          };
        });
        setData(datos);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error loading GYA:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { data, isLoading, error };
};
