
export const QuickActions = ({ setActivePanel }) => {
  return (
    <div style={{display:'flex', gap:8, marginTop:12}}>
      <button onClick={() => setActivePanel && setActivePanel('ordenes')}>Nueva Orden</button>
      <button onClick={() => setActivePanel && setActivePanel('ventas')}>Ver Ventas</button>
    </div>
  );
};
