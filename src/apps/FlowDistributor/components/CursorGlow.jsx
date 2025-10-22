import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

/**
 * CursorGlow - Efecto visual de brillo siguiendo el cursor
 * Crea un efecto premium con gradiente radial
 */
export const CursorGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed w-96 h-96 rounded-full pointer-events-none z-0 opacity-20"
      style={{
        background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
        left: mousePosition.x - 192,
        top: mousePosition.y - 192,
      }}
      animate={{
        x: mousePosition.x - 192,
        y: mousePosition.y - 192,
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 200,
      }}
    />
  );
};

export default CursorGlow;
