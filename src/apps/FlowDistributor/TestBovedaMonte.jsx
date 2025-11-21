/**
 * 🧪 TEST PAGE - Panel Bóveda Monte Ultra V2
 * ==========================================
 * Página de prueba para el nuevo componente conectado a Firestore
 *
 * Para probar:
 * 1. npm run dev
 * 2. Navegar a /test-boveda-monte
 * 3. Verificar que los datos se cargan desde Firestore
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import PanelBovedaMonteUltraV2 from './components/PanelBovedaMonteUltraV2';

// Crear instancia de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

export default function TestBovedaMonte() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-900">
        {/* Header de Test */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">
              🧪 Test: Panel Bóveda Monte Ultra V2
            </h1>
            <p className="text-slate-300 text-sm">
              Conectado a Firestore • Datos en tiempo real • 69 ingresos, 26 gastos, 5 cortes
            </p>
          </div>
        </div>

        {/* Component Under Test */}
        <PanelBovedaMonteUltraV2 />
      </div>
    </QueryClientProvider>
  );
}
