export const MetricCard = ({ title, value, change }) => {
  return (
    <div className="metric-card">
      <h4>{title}</h4>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="metric-value" style={{ fontSize: 20, fontWeight: 700 }}>
          {value}
        </div>
        <div
          className="metric-change"
          style={{ color: change && change.toString().includes('-') ? '#ef4444' : '#10b981' }}
        >
          {change}
        </div>
      </div>
    </div>
  );
};
