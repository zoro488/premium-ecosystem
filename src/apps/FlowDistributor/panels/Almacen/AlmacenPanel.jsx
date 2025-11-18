import { useEffect, useState } from 'react';
import { firestoreService } from '../../services/firestore.service';

export const AlmacenPanel = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const p = await firestoreService.getCollection('productos');
        setProductos(p);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div className="almacen-panel">
      <h2>Gestión de Almacén</h2>
      <p>{productos.length} productos cargados</p>
    </div>
  );
};
