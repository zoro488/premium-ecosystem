import { useEffect, useState } from 'react';
import { firestoreService } from '../../services/firestore.service';

export const OrdenesPanel = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await firestoreService.getCollection('ordenes');
        if (mounted) setOrdenes(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="ordenes-panel">
      <h2>Gestión de Órdenes</h2>
      <table className="simple-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.cliente}</td>
              <td>{o.fecha}</td>
              <td>{o.total}</td>
              <td>{o.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
