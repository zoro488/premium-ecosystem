/**
 * 🎨 INTERACTIVE TOOLTIP
 *
 * Tooltip premium con contenido rico
 * - Posicionamiento inteligente
 * - Animaciones smooth
 * - Arrow indicator
 * - Rich content support
 * - Multiple themes
 *
 * Inspirado en UI modernas y Pinterest
 * @version 1.0.0
 */

import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useRef, useState } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipTheme = 'dark' | 'light' | 'purple' | 'blue' | 'gradient';

interface InteractiveTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  theme?: TooltipTheme;
  delay?: number;
  maxWidth?: number;
  disabled?: boolean;
}

const THEME_STYLES = {
  dark: {
    bg: 'bg-gray-900/95',
    text: 'text-white',
    border: 'border-gray-700',
  },
  light: {
    bg: 'bg-white/95',
    text: 'text-gray-900',
    border: 'border-gray-200',
  },
  purple: {
    bg: 'bg-purple-900/95',
    text: 'text-white',
    border: 'border-purple-500',
  },
  blue: {
    bg: 'bg-blue-900/95',
    text: 'text-white',
    border: 'border-blue-500',
  },
  gradient: {
    bg: 'bg-gradient-to-br from-purple-900/95 to-pink-900/95',
    text: 'text-white',
    border: 'border-purple-500',
  },
};

const POSITION_VARIANTS = {
  top: {
    initial: { opacity: 0, y: 10, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.9 },
  },
  bottom: {
    initial: { opacity: 0, y: -10, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.9 },
  },
  left: {
    initial: { opacity: 0, x: 10, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 10, scale: 0.9 },
  },
  right: {
    initial: { opacity: 0, x: -10, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -10, scale: 0.9 },
  },
};

export const InteractiveTooltip = memo<InteractiveTooltipProps>(({
  children,
  content,
  position = 'top',
  theme = 'dark',
  delay = 200,
  maxWidth = 300,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState<TooltipPosition>(position);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Adjust position if tooltip goes off screen
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let newPosition = position;

      // Check if tooltip goes off top
      if (position === 'top' && triggerRect.top - tooltipRect.height < 0) {
        newPosition = 'bottom';
      }

      // Check if tooltip goes off bottom
      if (position === 'bottom' && triggerRect.bottom + tooltipRect.height > window.innerHeight) {
        newPosition = 'top';
      }

      // Check if tooltip goes off left
      if (position === 'left' && triggerRect.left - tooltipRect.width < 0) {
        newPosition = 'right';
      }

      // Check if tooltip goes off right
      if (position === 'right' && triggerRect.right + tooltipRect.width > window.innerWidth) {
        newPosition = 'left';
      }

      setActualPosition(newPosition);
    }
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-8 border-x-8 border-x-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-8 border-x-8 border-x-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-8 border-y-8 border-y-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-8 border-y-8 border-y-transparent',
  };

  const themeStyles = THEME_STYLES[theme];

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={`absolute ${positionClasses[actualPosition]} z-50 pointer-events-none`}
            initial={POSITION_VARIANTS[actualPosition].initial}
            animate={POSITION_VARIANTS[actualPosition].animate}
            exit={POSITION_VARIANTS[actualPosition].exit}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
          >
            {/* Tooltip content */}
            <div
              className={`
                ${themeStyles.bg}
                ${themeStyles.text}
                ${themeStyles.border}
                backdrop-blur-md
                border
                rounded-xl
                shadow-2xl
                px-4 py-3
              `}
              style={{ maxWidth: `${maxWidth}px` }}
            >
              {content}
            </div>

            {/* Arrow */}
            <div
              className={`absolute ${arrowClasses[actualPosition]}`}
              style={{
                borderTopColor: theme === 'gradient' ? '#7e22ce' : undefined,
                borderBottomColor: theme === 'gradient' ? '#7e22ce' : undefined,
                borderLeftColor: theme === 'gradient' ? '#7e22ce' : undefined,
                borderRightColor: theme === 'gradient' ? '#7e22ce' : undefined,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

InteractiveTooltip.displayName = 'InteractiveTooltip';

export default InteractiveTooltip;
