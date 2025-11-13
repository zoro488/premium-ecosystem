/**
 * Main App Component - Chronos OS
 */
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AIFloatingButton } from '@/components/ai/AIFloatingButton';
import { ChronosCore } from '@/components/ai/ChronosCore';
import { MegaAIWidget } from '@/components/ai/MegaAIWidget';
import { Layout } from '@/components/layout';
import AlmacenView from '@/views/almacen/AlmacenView';
import { UniversalBankView } from '@/views/bancos/UniversalBankView';
import ClientesView from '@/views/clientes/ClientesView';
import DashboardMasterView from '@/views/dashboard/DashboardMasterView';
import DistribuidoresView from '@/views/distribuidores/DistribuidoresView';
import GastosView from '@/views/gastos/GastosView';
import OrdenesCompraView from '@/views/ordenes/OrdenesCompraView';
import ReportesView from '@/views/reportes/ReportesView';
import VentasView from '@/views/ventas/VentasView';

export function App() {
  const [showAIWidget, setShowAIWidget] = useState(false);
  const userId = 'user-demo-001'; // TODO: Obtener del auth

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Dashboard Principal */}
          <Route path="/" element={<DashboardMasterView />} />
          <Route path="/dashboard" element={<DashboardMasterView />} />

          {/* Vista Universal de Bancos */}
          <Route path="/bancos/:bancoId" element={<UniversalBankView />} />

          {/* Módulos de Negocio */}
          <Route path="/ventas" element={<VentasView />} />
          <Route path="/clientes" element={<ClientesView />} />
          <Route path="/almacen" element={<AlmacenView />} />
          <Route path="/inventario" element={<AlmacenView />} />

          {/* Módulos de Gestión */}
          <Route path="/ordenes" element={<OrdenesCompraView />} />
          <Route path="/distribuidores" element={<DistribuidoresView />} />
          <Route path="/gastos" element={<GastosView />} />

          {/* Analíticas */}
          <Route path="/reportes" element={<ReportesView />} />
        </Routes>
      </Layout>

      {/* ChronosCore - Omnipresente */}
      <ChronosCore />

      {/* AI Floating Button */}
      <AIFloatingButton onClick={() => setShowAIWidget(!showAIWidget)} isActive={showAIWidget} />

      {/* AI Widget */}
      {showAIWidget && <MegaAIWidget userId={userId} onClose={() => setShowAIWidget(false)} />}
    </BrowserRouter>
  );
}
