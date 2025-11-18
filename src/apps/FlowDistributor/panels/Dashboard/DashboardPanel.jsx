
export const DashboardPanel = ({ setActivePanel }) => {
  const metrics = [
    { title: 'Ventas Hoy', value: '$45,231', change: '+12%' },
    { title: 'Órdenes Pendientes', value: '23', change: '-5%' },
    { title: 'Inventario Bajo', value: '8', change: '+2' },
    { title: 'Bancos Total', value: '$1.2M', change: '+8%' }
  ];

  return (
    <div className="dashboard-panel">
      <div className="metrics-grid">
        {metrics.map(metric => (
          <div key={metric.title} className="metric-card">
            <h4>{metric.title}</h4>
            <p className="metric-value">{metric.value}</p>
            <small className="metric-change">{metric.change}</small>
          </div>
        ))}
      </div>
      <div className="quick-actions">
        <button onClick={() => setActivePanel('ordenes')}>Ir a Órdenes</button>
        <button onClick={() => setActivePanel('ventas')}>Ir a Ventas</button>
      </div>
    </div>
  );
};
