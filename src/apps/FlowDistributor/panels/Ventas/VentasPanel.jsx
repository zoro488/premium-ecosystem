import { useEffect, useState } from 'react';
import { firestoreService } from '../../services/firestore.service';

export const VentasPanel = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const v = await firestoreService.getCollection('ventas');
        setData(v);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="ventas-panel">
      <h2>Panel de Ventas</h2>
      <p>Gráficos y métricas estarán aquí (Chart.js si está instalado)</p>
    </div>
  );
};
