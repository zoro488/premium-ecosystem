export const BancoDetail = ({ banco }) => {
  const tabs = ['Cuentas', 'Movimientos', 'Saldos', 'Conciliación'];
  return (
    <div className="banco-detail" style={{ borderTop: `4px solid ${banco.color}`, padding: 16 }}>
      <h3>{banco.nombre}</h3>
      <p>Tabs: {tabs.join(' | ')}</p>
      <div style={{ height: 300 }}>Aquí irán las tablas de datos (DataGrid)</div>
    </div>
  );
};
