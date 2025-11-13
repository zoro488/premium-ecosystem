/**
 * 🌊 FLOATING ACTION BUTTON
 *
 * Botón flotante con efectos premium
 * - Ripple effect al hacer clic
 * - Menú expandible (opcional)
 * - Animaciones smooth
 * - Magnetic hover
 * - Badge counter
 *
 * Inspirado en Material Design 3.0 y Pinterest
 * @version 1.0.0
 */

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { memo, useRef, useState } from 'react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  menuItems?: MenuItem[];
  badge?: number;
  color?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  magnetic?: boolean;
}

export const FloatingActionButton = memo<FloatingActionButtonProps>(({
  icon: Icon,
  onClick,
  menuItems = [],
  badge,
  color = '#a855f7',
  position = 'bottom-right',
  magnetic = true,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    // Magnetic attraction within 60px radius
    if (distance < 60) {
      mouseX.set(distanceX * 0.3);
      mouseY.set(distanceY * 0.3);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 600);

    // Handle menu or direct action
    if (menuItems.length > 0) {
      setIsMenuOpen((prev) => !prev);
    } else if (onClick) {
      onClick();
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
    'top-left': 'top-8 left-8',
  };

  const menuDirection = position.includes('bottom') ? 'bottom' : 'top';

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Menu items */}
      <AnimatePresence>
        {isMenuOpen && menuItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute ${
              menuDirection === 'bottom' ? 'bottom-20' : 'top-20'
            } ${
              position.includes('right') ? 'right-0' : 'left-0'
            } space-y-3`}
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                initial={{
                  scale: 0,
                  opacity: 0,
                  y: menuDirection === 'bottom' ? 20 : -20,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  y: menuDirection === 'bottom' ? 20 : -20,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                  delay: index * 0.05,
                }}
                onClick={() => {
                  item.onClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-md border border-white/20 hover:border-white/40 transition-colors group"
                style={{
                  backgroundColor: `${item.color || color}20`,
                }}
                whileHover={{ scale: 1.05, x: position.includes('right') ? -5 : 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon
                  className="w-5 h-5"
                  style={{ color: item.color || color }}
                />
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x, y }}
        className="relative w-16 h-16 rounded-full backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: isMenuOpen
            ? `0 0 30px ${color}80`
            : '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Background gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}CC)`,
          }}
          animate={{
            opacity: isMenuOpen ? 1 : 0.9,
          }}
        />

        {/* Ripples */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute rounded-full bg-white"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 10,
                height: 10,
                marginLeft: -5,
                marginTop: -5,
              }}
            />
          ))}
        </AnimatePresence>

        {/* Icon */}
        <motion.div
          className="relative z-10 w-full h-full flex items-center justify-center"
          animate={{
            rotate: isMenuOpen ? 45 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>

        {/* Badge */}
        {badge !== undefined && badge > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-gray-900"
          >
            {badge > 99 ? '99+' : badge}
          </motion.div>
        )}

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at center, ${color}40 0%, transparent 70%)`,
          }}
          animate={{
            scale: isMenuOpen ? [1, 1.2, 1] : 1,
            opacity: isMenuOpen ? [0.5, 0.8, 0.5] : 0,
          }}
          transition={{
            duration: 2,
            repeat: isMenuOpen ? Infinity : 0,
          }}
        />
      </motion.button>
    </div>
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';

export default FloatingActionButton;
