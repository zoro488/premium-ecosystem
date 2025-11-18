import { useState } from 'react';
import { BancoDetail } from './BancoDetail';

const BANCOS = [
  { id: 'santander', nombre: 'Santander', color: '#EC0000' },
  { id: 'bbva', nombre: 'BBVA', color: '#004481' },
  { id: 'banamex', nombre: 'Banamex', color: '#0033A0' },
  { id: 'hsbc', nombre: 'HSBC', color: '#DB0011' },
  { id: 'scotiabank', nombre: 'Scotiabank', color: '#EE0000' },
  { id: 'banorte', nombre: 'Banorte', color: '#C8102E' },
  { id: 'inbursa', nombre: 'Inbursa', color: '#003DA5' }
];

export const BancosPanel = () => {
  const [selected, setSelected] = useState(0);
  return (
    <div className="bancos-panel">
      <h2>Gestión de Bancos</h2>
      <div className="bancos-tabs">
        {BANCOS.map((b, i) => (
          <button key={b.id} onClick={() => setSelected(i)} style={{marginRight:8}}>{b.nombre}</button>
        ))}
      </div>
      <BancoDetail banco={BANCOS[selected]} />
    </div>
  );
};
