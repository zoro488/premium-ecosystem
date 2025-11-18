/**
 * 🔥 ACTUALIZACIÓN MASIVA DE PANELES ULTRA A FIRESTORE
 *
 * Este script documenta cómo actualizar cada panel Ultra para que use Firestore
 * en tiempo real en lugar de archivos JSON estáticos.
 *
 * PANELES A ACTUALIZAR:
 * =====================
 *
 * BANCOS (7):
 * 1. PanelAztecaUltra.tsx          → azteca
 * 2. PanelBovedaMonteUltra.tsx     → boveda_monte
 * 3. PanelBovedaUSAUltra.jsx       → boveda_usa
 * 4. PanelFletesUltra.jsx          → fletes
 * 5. PanelLeftieUltra.jsx          → leftie
 * 6. PanelProfitUltra.jsx          → profit
 * 7. PanelUtilidadesUltra.jsx      → utilidades
 *
 * NEGOCIO (6):
 * 8. PanelAlmacenUltra.jsx         → useAlmacenData()
 * 9. PanelVentasUltra.jsx          → useVentasData()
 * 10. PanelClientesUltra.jsx       → useClientesData()
 * 11. PanelDistribuidoresUltra.jsx → useDistribuidoresData()
 * 12. PanelOrdenesCompraUltra.jsx  → useOrdenesCompraData()
 * 13. DashboardUltra.jsx/tsx       → useDashboardData()
 *
 * TEMPLATE DE ACTUALIZACIÓN:
 * ==========================
 */

// ============================================
// PASO 1: Importar hooks de Firestore
// ============================================
// ANTES:
// import panelDataManual from '../data/panel-azteca-manual.json';

// DESPUÉS:
import { useBancoData } from '../services/firestore-hooks.service';

// ============================================
// PASO 2: Dentro del componente, reemplazar useState con hook
// ============================================
// ANTES:
/*
const [loading] = useState(false);
const datosManual = useMemo(() => {
  const data = panelDataManual.azteca;
  return {
    totalIngresos: data.ingresos || 0,
    ingresosList: data.ingresosList || [],
    // ...
  };
}, []);
*/

// DESPUÉS:
const { gastos, ingresos, loading, stats } = useBancoData('azteca');

// Los datos ya vienen mapeados correctamente:
const datosManual = {
  totalIngresos: stats.totalIngresos,
  totalGastos: stats.totalGastos,
  ingresosList: ingresos,
  gastosList: gastos,
  // cortes y transferencias se pueden agregar en el futuro
};


export default ACTUALIZACION_PANELES_GUIDE;
