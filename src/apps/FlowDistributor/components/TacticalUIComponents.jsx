/**
 * 🔊 SISTEMA DE SONIDOS INTEGRADO
 * Configuración y integración completa del sistema de audio tactical
 */
import { useEffect } from 'react';

import { useTacticalSounds } from '../hooks/useTacticalSounds';

/**
 * Provider de sonidos táctiles que se monta globalmente
 */
export const TacticalSoundProvider = ({ children }) => {
  const sounds = useTacticalSounds();

  useEffect(() => {
    // Sonido de bienvenida al cargar el sistema
    const welcomeTimer = setTimeout(() => {
      sounds.playSystemSound('boot');
    }, 1000);

    return () => clearTimeout(welcomeTimer);
  }, [sounds]);

  // Agregar listeners globales para sonidos del sistema
  useEffect(() => {
    const handleError = () => sounds.playSystemSound('error');
    const handleSuccess = () => sounds.playSystemSound('success');
    const handleWarning = () => sounds.playSystemSound('warning');

    // Eventos personalizados para el sistema
    window.addEventListener('tactical-error', handleError);
    window.addEventListener('tactical-success', handleSuccess);
    window.addEventListener('tactical-warning', handleWarning);

    return () => {
      window.removeEventListener('tactical-error', handleError);
      window.removeEventListener('tactical-success', handleSuccess);
      window.removeEventListener('tactical-warning', handleWarning);
    };
  }, [sounds]);

  return children;
};

/**
 * Hook para disparar eventos de sonido desde componentes
 */
export const useTacticalEvents = () => {
  const dispatchError = () => {
    window.dispatchEvent(new CustomEvent('tactical-error'));
  };

  const dispatchSuccess = () => {
    window.dispatchEvent(new CustomEvent('tactical-success'));
  };

  const dispatchWarning = () => {
    window.dispatchEvent(new CustomEvent('tactical-warning'));
  };

  return {
    dispatchError,
    dispatchSuccess,
    dispatchWarning,
  };
};

/**
 * Componente de botón con sonidos integrados
 */
export const TacticalButton = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  soundType = 'click',
  ...props
}) => {
  const { playUISound } = useTacticalSounds();

  const handleClick = (e) => {
    if (!disabled) {
      playUISound(soundType);
      if (onClick) onClick(e);
    }
  };

  const getVariantStyles = () => {
    const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform';

    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-zinc-9000/20 border border-zinc-500/50 text-zinc-200 hover:bg-zinc-9000/30 hover:scale-105 active:scale-95`;
      case 'secondary':
        return `${baseStyles} bg-zinc-800/20 border border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/30 hover:scale-105 active:scale-95`;
      case 'danger':
        return `${baseStyles} bg-zinc-9000/20 border border-zinc-500/50 text-zinc-200 hover:bg-zinc-9000/30 hover:scale-105 active:scale-95`;
      case 'success':
        return `${baseStyles} bg-zinc-9000/20 border border-zinc-500/50 text-zinc-200 hover:bg-zinc-9000/30 hover:scale-105 active:scale-95`;
      default:
        return `${baseStyles} bg-gray-500/20 border border-gray-500/50 text-gray-400 hover:bg-gray-500/30 hover:scale-105 active:scale-95`;
    }
  };

  return (
    <button
      className={`${getVariantStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Componente de input con sonidos
 */
export const TacticalInput = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onFocus,
  onBlur,
  className = '',
  ...props
}) => {
  const { playUISound } = useTacticalSounds();

  const handleFocus = (e) => {
    playUISound('focus');
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    playUISound('blur');
    if (onBlur) onBlur(e);
  };

  const handleChange = (e) => {
    playUISound('type');
    if (onChange) onChange(e);
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`bg-black/50 border border-zinc-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-zinc-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all ${className}`}
      {...props}
    />
  );
};

/**
 * Componente de select con sonidos
 */
export const TacticalSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Seleccionar...',
  className = '',
  ...props
}) => {
  const { playUISound } = useTacticalSounds();

  const handleChange = (e) => {
    playUISound('select');
    if (onChange) onChange(e);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`bg-black/50 border border-zinc-500/30 rounded-lg px-4 py-2 text-white focus:border-zinc-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all cursor-pointer ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option, index) => (
        <option key={index} value={option.value} className="bg-black text-white">
          {option.label}
        </option>
      ))}
    </select>
  );
};

/**
 * Componente de modal con sonidos
 */
export const TacticalModal = ({ isOpen, onClose, title, children, className = '' }) => {
  const { playUISound } = useTacticalSounds();

  useEffect(() => {
    if (isOpen) {
      playUISound('modal_open');
    }
  }, [isOpen, playUISound]);

  const handleClose = () => {
    playUISound('modal_close');
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div
        className={`relative bg-black/90 border border-zinc-500/30 rounded-lg p-6 max-w-2xl w-full mx-4 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-zinc-200">{title}</h2>
          <TacticalButton variant="danger" onClick={handleClose} className="p-2" soundType="click">
            ✕
          </TacticalButton>
        </div>

        {/* Content */}
        <div className="text-white">{children}</div>
      </div>
    </div>
  );
};

/**
 * Componente de notificación con sonidos
 */
export const TacticalNotification = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const { playUISound } = useTacticalSounds();

  useEffect(() => {
    playUISound('notification');

    if (duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, playUISound]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-zinc-500/50 bg-green-900/20 text-zinc-200';
      case 'error':
        return 'border-zinc-500/50 bg-red-900/20 text-zinc-200';
      case 'warning':
        return 'border-zinc-500/50 bg-yellow-900/20 text-zinc-200';
      default:
        return 'border-zinc-700/50 bg-zinc-950/20 text-zinc-300';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 border rounded-lg p-4 max-w-sm ${getTypeStyles()}`}>
      <div className="flex items-start space-x-3">
        <span className="text-xl">{getIcon()}</span>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default {
  TacticalSoundProvider,
  useTacticalEvents,
  TacticalButton,
  TacticalInput,
  TacticalSelect,
  TacticalModal,
  TacticalNotification,
};
