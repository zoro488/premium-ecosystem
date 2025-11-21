import React from 'react';
import { Loader2 } from 'lucide-react';

interface ChronosButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  icon?: React.ElementType;
}

export const ChronosButton = ({ 
    children, 
    variant = 'primary', 
    isLoading = false, 
    icon: Icon,
    className = '',
    ...props 
}: ChronosButtonProps) => {
  
  const baseStyles = "relative overflow-hidden rounded-xl px-6 py-3 font-orbitron text-sm tracking-wider font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center space-x-2";
  
  const variants = {
      primary: "bg-gradient-to-r from-chronos-600 to-chronos-400 text-white hover:shadow-neon border border-transparent",
      secondary: "bg-white/5 text-metal-100 hover:bg-white/10 border border-white/10",
      danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
  };

  return (
    <button 
        className={`${baseStyles} ${variants[variant]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
    >
        {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
            <>
                {Icon && <Icon className="w-4 h-4" />}
                <span>{children}</span>
            </>
        )}
    </button>
  );
};