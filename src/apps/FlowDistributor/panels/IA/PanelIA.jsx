import { useState } from 'react';

export const PanelIA = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {role:'user', content: input}]);
    setInput('');
    setTimeout(() => setMessages(prev => [...prev, {role:'assistant', content:'Respuesta simulada'}]), 800);
  };

  return (
    <div className="panel-ia">
      <h2>Panel IA</h2>
      <div className="chat" style={{height:300, overflow:'auto', border:'1px solid #eee', padding:8}}>
        {messages.map((m,i) => <div key={i} style={{marginBottom:6}}><strong>{m.role}</strong>: {m.content}</div>)}
      </div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <input value={input} onChange={(e)=>setInput(e.target.value)} style={{flex:1}} />
        <button onClick={send}>Enviar</button>
      </div>
    </div>
  );
};
