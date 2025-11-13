/**
 * 📂 EXPANDABLE SECTION COMPONENT
 *
 * Sección expandible/colapsable reutilizable con:
 * - Animaciones suaves de altura con Framer Motion
 * - Íconos rotativos
 * - Soporte para contenido nested
 * - Navegación por teclado
 * - Estados visual feedback
 * - Variants personalizables
 *
 * Inspirado en: Pinterest expansions, Notion toggles, Linear collapsibles
 *
 * @version 1.0.0
 */

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react';
import { type ReactNode, memo, useCallback, useState } from 'react';

interface ExpandableSectionProps {
  /**
   * Título de la sección
   */
  title: string | ReactNode;

  /**
   * Contenido de la sección
   */
  children: ReactNode;

  /**
   * Ícono personalizado (opcional)
   */
  icon?: LucideIcon;

  /**
   * Estado inicial (expandido/colapsado)
   */
  defaultExpanded?: boolean;

  /**
   * Callback cuando cambia el estado
   */
  onToggle?: (isExpanded: boolean) => void;

  /**
   * Variante de estilo
   */
  variant?: 'default' | 'card' | 'minimal' | 'bordered';

  /**
   * Tamaño
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Color del tema
   */
  theme?: 'purple' | 'blue' | 'green' | 'orange' | 'teal';

  /**
   * Clases CSS adicionales
   */
  className?: string;

  /**
   * Mostrar badge con contador
   */
  badge?: number | string;

  /**
   * Deshabilitar interacción
   */
  disabled?: boolean;
}

// Temas de colores
const THEME_COLORS = {
  purple: {
    bg: 'from-purple-500/10 to-pink-500/10',
    border: 'border-purple-500/30 hover:border-purple-400/50',
    icon: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
  },
  blue: {
    bg: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/30 hover:border-blue-400/50',
    icon: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300',
  },
  green: {
    bg: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/30 hover:border-green-400/50',
    icon: 'text-green-400',
    badge: 'bg-green-500/20 text-green-300',
  },
  orange: {
    bg: 'from-orange-500/10 to-amber-500/10',
    border: 'border-orange-500/30 hover:border-orange-400/50',
    icon: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-300',
  },
  teal: {
    bg: 'from-teal-500/10 to-cyan-500/10',
    border: 'border-teal-500/30 hover:border-teal-400/50',
    icon: 'text-teal-400',
    badge: 'bg-teal-500/20 text-teal-300',
  },
};

// Variantes de estilo
const VARIANTS = {
  default: 'bg-white/5 backdrop-blur-sm',
  card: 'bg-gradient-to-br shadow-lg backdrop-blur-xl',
  minimal: 'bg-transparent',
  bordered: 'bg-white/5 backdrop-blur-sm border-2',
};

// Tamaños
const SIZES = {
  sm: { padding: 'p-3', title: 'text-sm', icon: 'w-4 h-4' },
  md: { padding: 'p-4', title: 'text-base', icon: 'w-5 h-5' },
  lg: { padding: 'p-6', title: 'text-lg', icon: 'w-6 h-6' },
};

/**
 * 📂 Componente Principal: Expandable Section
 */
export const ExpandableSection = memo<ExpandableSectionProps>(({
  title,
  children,
  icon: Icon,
  defaultExpanded = false,
  onToggle,
  variant = 'default',
  size = 'md',
  theme = 'purple',
  className = '',
  badge,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const colors = THEME_COLORS[theme];
  const variantClass = VARIANTS[variant];
  const sizeConfig = SIZES[size];

  // Handler para toggle
  const handleToggle = useCallback(() => {
    if (disabled) return;

    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  }, [disabled, isExpanded, onToggle]);

  // Handler para teclado
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  }, [disabled, handleToggle]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-xl overflow-hidden
        ${variantClass}
        ${variant === 'card' ? colors.bg : ''}
        ${variant === 'bordered' ? colors.border : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-300
        ${className}
      `}
    >
      {/* Header */}
      <motion.div
        className={`
          flex items-center justify-between
          ${sizeConfig.padding}
          ${disabled ? '' : 'hover:bg-white/5'}
          transition-colors duration-200
        `}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isExpanded}
        aria-disabled={disabled}
        whileHover={disabled ? {} : { scale: 1.01 }}
        whileTap={disabled ? {} : { scale: 0.99 }}
      >
        {/* Left side: Icon + Title */}
        <div className="flex items-center gap-3 flex-1">
          {Icon && (
            <motion.div
              className={`${colors.icon} ${sizeConfig.icon}`}
              animate={{ rotate: isExpanded ? 360 : 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <Icon className={sizeConfig.icon} />
            </motion.div>
          )}

          <div className={`font-semibold text-white ${sizeConfig.title}`}>
            {title}
          </div>

          {badge !== undefined && (
            <motion.span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colors.badge}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              {badge}
            </motion.span>
          )}
        </div>

        {/* Right side: Chevron */}
        <motion.div
          className={`${colors.icon} ${sizeConfig.icon}`}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
        >
          {isExpanded ? (
            <ChevronDown className={sizeConfig.icon} />
          ) : (
            <ChevronRight className={sizeConfig.icon} />
          )}
        </motion.div>
      </motion.div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: 'easeOut' },
                opacity: { duration: 0.2, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: 'easeIn' },
                opacity: { duration: 0.2 },
              },
            }}
            style={{ overflow: 'hidden' }}
          >
            <motion.div
              className={`${sizeConfig.padding} pt-0 border-t border-white/10`}
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

ExpandableSection.displayName = 'ExpandableSection';

export default ExpandableSection;
