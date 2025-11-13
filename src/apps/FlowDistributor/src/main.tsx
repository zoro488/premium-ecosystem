// src/main.tsx - PUNTO DE ENTRADA CORRECTO
import React from 'react'
import ReactDOM from 'react-dom/client'
import FlowDistributor from '../FlowDistributor.jsx'

// Estilos globales necesarios
import '../cinematicAnimations.css'
import '../styles/FlowDistributor.css'
import '../styles/premium-animations.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FlowDistributor />
  </React.StrictMode>,
)
