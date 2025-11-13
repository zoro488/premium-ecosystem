import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const cardVariants = {
  sizes: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  },
  variants: {
    default: 'card-premium',
    glass: 'glass-card',
    strong: 'glass-strong rounded-2xl',
    gradient:
      'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-xl rounded-2xl',
    glow: 'card-premium hover-glow',
  },
};

const Card = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  hoverable = true,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={clsx(
        // Estilos base
        'transition-all duration-300 ease-out',

        // Tamaños
        cardVariants.sizes[size],

        // Variantes
        cardVariants.variants[variant],

        // Clases adicionales
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx('mb-6', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className, ...props }) => (
  <h3 className={clsx('text-xl font-bold text-white mb-2', className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className, ...props }) => (
  <p className={clsx('text-slate-400 text-sm', className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx('mt-6 pt-4 border-t border-white/10', className)} {...props}>
    {children}
  </div>
);

// Exportar componentes
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
