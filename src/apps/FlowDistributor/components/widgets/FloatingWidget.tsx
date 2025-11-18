/**
 * 🎨 FloatingWidget - Componente base para widgets flotantes arrastables y redimensionables
 * Características:
 * - Draggable con Framer Motion
 * - Estados: normal, minimizado, maximizado
 * - Glassmorphism design
 * - Z-index management
 * - Persistencia de posición en localStorage
 */
import React, { useEffect, useRef, useState } from 'react';

import { PanInfo, motion } from 'framer-motion';
import { Expand, GripHorizontal, Maximize2, Minimize2, Minus, X } from 'lucide-react';

export interface FloatingWidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  onClose?: () => void;
  onMinimize?: () => void;
  icon?: React.ReactNode;
  className?: string;
  resizable?: boolean;
  zIndex?: number;
  onFocus?: () => void;
}

export type WidgetState = 'normal' | 'minimized' | 'maximized';

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({
  id,
  title,
  children,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 400, height: 300 },
  minSize = { width: 300, height: 200 },
  maxSize = { width: 800, height: 600 },
  onClose,
  onMinimize,
  icon,
  className = '',
  resizable = true,
  zIndex = 10,
  onFocus,
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [widgetState, setWidgetState] = useState<WidgetState>('normal');
  const [isResizing, setIsResizing] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // 💾 Cargar posición guardada del localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`widget-${id}`);
    if (savedData) {
      try {
        const { position: savedPos, size: savedSize, state } = JSON.parse(savedData);
        if (savedPos) setPosition(savedPos);
        if (savedSize) setSize(savedSize);
        if (state) setWidgetState(state);
      } catch (error) {
        console.error('Error loading widget data:', error);
      }
    }
  }, [id]);

  // 💾 Guardar estado en localStorage cuando cambia
  useEffect(() => {
    const dataToSave = {
      position,
      size,
      state: widgetState,
    };
    localStorage.setItem(`widget-${id}`, JSON.stringify(dataToSave));
  }, [id, position, size, widgetState]);

  // 🎯 Manejar drag del widget
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (widgetState !== 'maximized') {
      setPosition({
        x: position.x + info.offset.x,
        y: position.y + info.offset.y,
      });
    }
  };

  // ⬜ Toggle maximizar
  const toggleMaximize = () => {
    if (widgetState === 'maximized') {
      setWidgetState('normal');
    } else {
      setWidgetState('maximized');
    }
  };

  // ➖ Toggle minimizar
  const toggleMinimize = () => {
    if (widgetState === 'minimized') {
      setWidgetState('normal');
    } else {
      setWidgetState('minimized');
      onMinimize?.();
    }
  };

  // ❌ Cerrar widget
  const handleClose = () => {
    localStorage.removeItem(`widget-${id}`);
    onClose?.();
  };

  // 🎯 Traer al frente cuando se hace click
  const handleMouseDown = () => {
    onFocus?.();
  };

  // 📐 Calcular estilos según estado
  const getWidgetStyles = () => {
    if (widgetState === 'maximized') {
      return {
        x: 0,
        y: 0,
        width: '100vw',
        height: '100vh',
      };
    }

    if (widgetState === 'minimized') {
      return {
        x: position.x,
        y: position.y,
        width: size.width,
        height: 60,
      };
    }

    return {
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
    };
  };

  return (
    <motion.div
      ref={widgetRef}
      drag={widgetState !== 'maximized'}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: 0,
        top: 0,
        right: window.innerWidth - size.width,
        bottom: window.innerHeight - 60,
      }}
      onDragEnd={handleDragEnd}
      onMouseDown={handleMouseDown}
      className={`fixed rounded-xl shadow-2xl ${className}`}
      style={{
        ...getWidgetStyles(),
        zIndex,
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
    >
      {/* 🎯 HEADER - Barra de título con controles */}
      <motion.div
        className="flex items-center justify-between px-4 py-3 cursor-move border-b border-white/10"
        style={{
          background:
            'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <GripHorizontal className="w-5 h-5 text-slate-400" />
          {icon && <div className="text-zinc-200">{icon}</div>}
          <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
        </div>

        {/* 🎮 Controles */}
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMinimize}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title={widgetState === 'minimized' ? 'Expandir' : 'Minimizar'}
          >
            <Minus className="w-4 h-4 text-slate-300" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMaximize}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title={widgetState === 'maximized' ? 'Restaurar' : 'Maximizar'}
          >
            {widgetState === 'maximized' ? (
              <Minimize2 className="w-4 h-4 text-slate-300" />
            ) : (
              <Maximize2 className="w-4 h-4 text-slate-300" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-zinc-9000/20 transition-colors"
            title="Cerrar"
          >
            <X className="w-4 h-4 text-zinc-200" />
          </motion.button>
        </div>
      </motion.div>

      {/* 📦 CONTENIDO */}
      {widgetState !== 'minimized' && (
        <motion.div
          className="h-[calc(100%-60px)] overflow-auto p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.div>
      )}

      {/* 📐 RESIZE HANDLES - Solo si es redimensionable y no está maximizado */}
      {resizable && widgetState === 'normal' && (
        <>
          {/* Esquina inferior derecha */}
          <motion.div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            whileHover={{ scale: 1.2 }}
            style={{
              background: 'linear-gradient(135deg, transparent 50%, rgba(99, 102, 241, 0.5) 50%)',
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
            }}
          />
        </>
      )}
    </motion.div>
  );
};

export default FloatingWidget;
