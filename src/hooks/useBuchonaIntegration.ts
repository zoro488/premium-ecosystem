/**
 * 🎯 Hook para integración completa de Buchona Assistant
 *
 * Features:
 * - Seguimiento de interacciones del usuario
 * - Respuestas contextuales según panel
 * - Movimiento inteligente a componentes
 * - Estados emocionales dinámicos
 * - Integración con AGI backend
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface BuchonaState {
  emotional:
    | 'idle'
    | 'celebrating'
    | 'thinking'
    | 'working'
    | 'surprised'
    | 'confident'
    | 'dancing';
  position: { x: number; y: number };
  message: string;
  isVisible: boolean;
}

interface InteractionEvent {
  type: 'click' | 'hover' | 'navigate' | 'error' | 'success';
  target?: string;
  timestamp: number;
}

const AGI_HOST = import.meta.env.VITE_AGI_HOST || 'http://localhost:8000';

export const useBuchonaIntegration = () => {
  const location = useLocation();
  const [state, setState] = useState<BuchonaState>({
    emotional: 'idle',
    position: { x: window.innerWidth - 200, y: 100 },
    message: '¡Qué onda! 💎',
    isVisible: true,
  });

  const [recentInteractions, setRecentInteractions] = useState<InteractionEvent[]>([]);
  const userId = localStorage.getItem('user_id') || 'demo_user';
  const wsRef = useRef<WebSocket | null>(null);

  // Mensajes según contexto
  const contextMessages = {
    '/flowdistributor': [
      '¡A darle con los flujos! 💼',
      'Vamos a organizar esto bien 📋',
      '¡Eso, muy chido! ✨',
    ],
    '/smartsales': [
      '¡A vender se ha dicho! 💰',
      'Hora de hacer dinero 💵',
      '¡Dale con las ventas! 🚀',
    ],
    '/clienthub': [
      'Vamos a ver a los clientes 👥',
      '¡A cuidar a la clientela! 💎',
      'Checando la cartera 📱',
    ],
    '/analyticspro': ['¡Vamos con los números! 📊', 'A ver esos datos 📈', '¡Eso se ve bien! 📉'],
    '/teamsync': ['¡Vamos equipo! 🤝', 'A coordinar con la raza 👥', '¡Dale, sincronizados! 🔄'],
  };

  // Reacciones a eventos
  const reactions = {
    success: ['¡A huevo! ✨', '¡Eso! 👑', '¡De lujo! 💎', '¡Perfecto! 🔥'],
    error: [
      'Órale, algo pasó 😅',
      'No hay pedo, lo arreglamos 🔧',
      'Dale otra vez 💪',
      'Tranqui, vamos de nuevo 🎯',
    ],
    thinking: ['Déjame pensar... 🤔', 'Analizando... 🧠', 'Viendo... 👀', 'Procesando... ⚡'],
  };

  // Conectar con AGI Backend
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`${AGI_HOST.replace('http', 'ws')}/ws/assistant`);

        ws.onopen = () => {
          console.log('🔌 Buchona conectada al AGI');
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.action === 'state_change') {
            setState((prev) => ({
              ...prev,
              emotional: data.emotional,
              message: data.message,
            }));
          }

          if (data.action === 'move_to') {
            setState((prev) => ({
              ...prev,
              position: data.position,
            }));
          }
        };

        ws.onerror = () => {
          console.log('⚠️ Buchona en modo offline');
        };

        wsRef.current = ws;
      } catch (error) {
        console.log('Buchona funcionando sin AGI backend');
      }
    };

    connectWebSocket();

    return () => {
      wsRef.current?.close();
    };
  }, []);

  // Reaccionar a cambios de ruta
  useEffect(() => {
    const path = location.pathname;
    const messages = contextMessages[path as keyof typeof contextMessages] || [
      '¡Vamos! 🚀',
      '¡Dale! 💪',
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    setState((prev) => ({
      ...prev,
      emotional: 'confident',
      message: randomMessage,
    }));

    // Volver a idle después de 3s
    setTimeout(() => {
      setState((prev) => ({ ...prev, emotional: 'idle' }));
    }, 3000);
  }, [location.pathname]);

  // Trackear interacciones
  const trackInteraction = useCallback(
    (type: InteractionEvent['type'], target?: string) => {
      const event: InteractionEvent = {
        type,
        target,
        timestamp: Date.now(),
      };

      setRecentInteractions((prev) => [...prev.slice(-10), event]);

      // Reaccionar según tipo
      if (type === 'success') {
        setState((prev) => ({
          ...prev,
          emotional: 'celebrating',
          message: reactions.success[Math.floor(Math.random() * reactions.success.length)],
        }));
      } else if (type === 'error') {
        setState((prev) => ({
          ...prev,
          emotional: 'surprised',
          message: reactions.error[Math.floor(Math.random() * reactions.error.length)],
        }));
      }

      // Enviar al backend
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            action: 'track_interaction',
            user_id: userId,
            event,
          })
        );
      }
    },
    [userId]
  );

  // Mover a componente específico
  const moveToComponent = useCallback((componentId: string) => {
    const element = document.getElementById(componentId);

    if (element) {
      const rect = element.getBoundingClientRect();

      setState((prev) => ({
        ...prev,
        position: {
          x: rect.left - 150,
          y: rect.top + rect.height / 2 - 60,
        },
        emotional: 'working',
        message: '¡Ahí voy! 🚀',
      }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, emotional: 'confident' }));
      }, 2000);
    }
  }, []);

  // Celebrar
  const celebrate = useCallback(() => {
    setState((prev) => ({
      ...prev,
      emotional: 'celebrating',
      message: reactions.success[Math.floor(Math.random() * reactions.success.length)],
    }));

    setTimeout(() => {
      setState((prev) => ({ ...prev, emotional: 'idle' }));
    }, 3000);
  }, []);

  // Pensar
  const think = useCallback(() => {
    setState((prev) => ({
      ...prev,
      emotional: 'thinking',
      message: reactions.thinking[Math.floor(Math.random() * reactions.thinking.length)],
    }));
  }, []);

  // Bailar
  const dance = useCallback(() => {
    setState((prev) => ({
      ...prev,
      emotional: 'dancing',
      message: '¡Dale! 💃🔥',
    }));

    setTimeout(() => {
      setState((prev) => ({ ...prev, emotional: 'idle' }));
    }, 5000);
  }, []);

  // Mostrar/Ocultar
  const toggle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isVisible: !prev.isVisible,
    }));
  }, []);

  // Mensaje personalizado
  const say = useCallback((message: string, emotional?: BuchonaState['emotional']) => {
    setState((prev) => ({
      ...prev,
      message,
      emotional: emotional || 'confident',
    }));

    setTimeout(() => {
      setState((prev) => ({ ...prev, emotional: 'idle' }));
    }, 3000);
  }, []);

  return {
    state,
    trackInteraction,
    moveToComponent,
    celebrate,
    think,
    dance,
    toggle,
    say,
    recentInteractions,
  };
};

export default useBuchonaIntegration;
