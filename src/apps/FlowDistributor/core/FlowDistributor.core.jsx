import { useState } from 'react';
import '../../styles/FlowDistributor.css';

import { AlmacenPanel } from '../panels/Almacen/AlmacenPanel';
import { BancosPanel } from '../panels/Bancos/BancosPanel';
import { DashboardPanel } from '../panels/Dashboard/DashboardPanel';
import { PanelIA } from '../panels/IA/PanelIA';
import { OrdenesPanel } from '../panels/Ordenes/OrdenesPanel';
import { VentasPanel } from '../panels/Ventas/VentasPanel';

export const FlowDistributorCore = () => {
  const [activePanel, setActivePanel] = useState('dashboard');

  const panels = {
    dashboard: DashboardPanel,
    ordenes: OrdenesPanel,
    ventas: VentasPanel,
    almacen: AlmacenPanel,
    bancos: BancosPanel,
    ia: PanelIA,
  };

  const ActiveComponent = panels[activePanel] || DashboardPanel;

  return (
    <div className="flow-distributor-container">
      <aside className="sidebar">
        <ul>
          <li onClick={() => setActivePanel('dashboard')}>Dashboard</li>
          <li onClick={() => setActivePanel('ordenes')}>Órdenes</li>
          <li onClick={() => setActivePanel('ventas')}>Ventas</li>
          <li onClick={() => setActivePanel('almacen')}>Almacén</li>
          <li onClick={() => setActivePanel('bancos')}>Bancos</li>
          <li onClick={() => setActivePanel('ia')}>IA</li>
        </ul>
      </aside>
      <main className="main-panel">
        <ActiveComponent setActivePanel={setActivePanel} />
      </main>
    </div>
  );
};
