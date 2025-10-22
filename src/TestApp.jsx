
// Componente simple de prueba
const TestApp = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>✅ PREMIUM ECOSYSTEM</h1>
        <h2 style={{ fontSize: '1.5rem', color: '#60a5fa' }}>Sistema Funcionando Correctamente</h2>
        <p style={{ marginTop: '20px', fontSize: '1.1rem' }}>🎯 Servidor: http://localhost:3000</p>
        <p style={{ marginTop: '10px', color: '#10b981' }}>
          ✅ React + Vite ✅ Todos los componentes ✅ Optimizado
        </p>
      </div>
    </div>
  );
};

export default TestApp;
