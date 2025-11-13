import { useState } from 'react';

export const WidgetIA = () => {
  const [open, setOpen] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const submit = async () => {
    if (!prompt.trim()) return;
    setResponse('Procesando...');
    await new Promise(r => setTimeout(r, 800));
    setResponse('Respuesta simulada: ' + prompt.slice(0,120));
  };

  if (!open) return <button onClick={()=>setOpen(true)}>Abrir IA</button>;

  return (
    <div className="widget-ia" style={{position:'fixed', bottom:20, right:20, width:320}}>
      <div style={{background:'#fff', padding:10, borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,0.12)'}}>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <strong>🤖 Asistente IA</strong>
          <button onClick={()=>setOpen(false)}>−</button>
        </div>
        <textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} rows={3} style={{width:'100%', marginTop:8}} />
        <button onClick={submit} style={{width:'100%', marginTop:8}}>Enviar</button>
        {response && <div style={{marginTop:8, background:'#f5f5f5', padding:8}}>{response}</div>}
      </div>
    </div>
  );
};
