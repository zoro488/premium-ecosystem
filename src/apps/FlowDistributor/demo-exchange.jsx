import React from 'react';
import ReactDOM from 'react-dom/client';
import { CurrencyExchangeWidget } from './components/widgets/CurrencyExchangeWidget';
import './styles/premium-animations.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          💱 Sistema de Tipo de Cambio USD/MXN
        </h1>
        <CurrencyExchangeWidget
          inventory={{ usd: 50000, mxn: 800000 }}
          autoRefresh={true}
          refreshInterval={30000}
          onRateUpdate={(rate) => console.log('Nueva tasa:', rate)}
        />
      </div>
    </div>
  </React.StrictMode>
);
