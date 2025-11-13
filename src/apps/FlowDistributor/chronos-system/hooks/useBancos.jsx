import { useState, useEffect } from 'react';
import { getTodosBancos, getBanco, getMovimientosBancarios } from '../services/bancos-v2.service';

export function useBancos() {
  const [bancos, setBancos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTodosBancos()
      .then(setBancos)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { bancos, loading, error };
}

export function useBanco(id) {
  const [banco, setBanco] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getBanco(id).then(setBanco).finally(() => setLoading(false));
  }, [id]);

  return { banco, loading };
}

export function useMovimientosBancarios(id) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getMovimientosBancarios(id).then(setMovimientos).finally(() => setLoading(false));
  }, [id]);

  return { movimientos, loading };
}

export default useBancos;
