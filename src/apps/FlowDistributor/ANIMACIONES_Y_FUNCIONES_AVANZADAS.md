# 🎨 **ANIMACIONES Y FUNCIONES AVANZADAS - FLOWDISTRIBUTOR**

> **📌 Referencia:** Basado en Pinterest refs - Glassmorphism, SaaS Dashboards, Futuristic UI, Data Visualization

---

## 🎭 **SISTEMA DE ANIMACIONES ULTRA PREMIUM**

### **1. ANIMACIONES TAILWIND CUSTOM (tailwind.config.js)**

```javascript
module.exports = {
  theme: {
    extend: {
      // ═══════════════════════════════════════════════════════════
      // KEYFRAMES AVANZADOS
      // ═══════════════════════════════════════════════════════════
      keyframes: {
        // ─────────────────────────────────────────────────────────
        // FADE & SLIDE ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-100%)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'slide-in-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(100%)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },

        // ─────────────────────────────────────────────────────────
        // SCALE & ZOOM ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        'scale-in-bounce': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.5)'
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        'zoom-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.5)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },

        // ─────────────────────────────────────────────────────────
        // BOUNCE & ELASTIC ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'bounce-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3) translateY(-20px)'
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05) translateY(0)'
          },
          '70%': {
            transform: 'scale(0.95)'
          },
          '100%': {
            transform: 'scale(1)'
          }
        },
        'elastic-bounce': {
          '0%': {
            transform: 'scale(1)'
          },
          '30%': {
            transform: 'scale(1.25)'
          },
          '40%': {
            transform: 'scale(0.95)'
          },
          '60%': {
            transform: 'scale(1.08)'
          },
          '80%': {
            transform: 'scale(0.98)'
          },
          '100%': {
            transform: 'scale(1)'
          }
        },

        // ─────────────────────────────────────────────────────────
        // PULSE & GLOW ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 0 0 currentColor'
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 20px 5px currentColor'
          }
        },
        'pulse-glow-green': {
          '0%, 100%': {
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
          },
          '50%': {
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.6)'
          }
        },
        'pulse-glow-blue': {
          '0%, 100%': {
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
          },
          '50%': {
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.6)'
          }
        },
        'pulse-glow-purple': {
          '0%, 100%': {
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
          },
          '50%': {
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.6)'
          }
        },
        'pulse-rainbow': {
          '0%': {
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
          },
          '25%': {
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
          },
          '50%': {
            boxShadow: '0 4px 16px rgba(236, 72, 153, 0.4)'
          },
          '75%': {
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
          },
          '100%': {
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
          }
        },

        // ─────────────────────────────────────────────────────────
        // SHIMMER & SHINE ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'shimmer': {
          '0%': {
            backgroundPosition: '-1000px 0'
          },
          '100%': {
            backgroundPosition: '1000px 0'
          }
        },
        'shimmer-wave': {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(100%)'
          }
        },
        'shine': {
          '0%': {
            backgroundPosition: '-200% center'
          },
          '100%': {
            backgroundPosition: '200% center'
          }
        },

        // ─────────────────────────────────────────────────────────
        // ROTATE & SPIN ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'spin-slow': {
          '0%': {
            transform: 'rotate(0deg)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          }
        },
        'spin-reverse': {
          '0%': {
            transform: 'rotate(360deg)'
          },
          '100%': {
            transform: 'rotate(0deg)'
          }
        },
        'wiggle': {
          '0%, 100%': {
            transform: 'rotate(-3deg)'
          },
          '50%': {
            transform: 'rotate(3deg)'
          }
        },
        'swing': {
          '0%, 100%': {
            transform: 'rotate(0deg)'
          },
          '25%': {
            transform: 'rotate(15deg)'
          },
          '75%': {
            transform: 'rotate(-15deg)'
          }
        },

        // ─────────────────────────────────────────────────────────
        // SHAKE & VIBRATE ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'shake': {
          '0%, 100%': {
            transform: 'translateX(0)'
          },
          '10%, 30%, 50%, 70%, 90%': {
            transform: 'translateX(-5px)'
          },
          '20%, 40%, 60%, 80%': {
            transform: 'translateX(5px)'
          }
        },
        'vibrate': {
          '0%, 100%': {
            transform: 'translate(0, 0)'
          },
          '10%, 30%, 50%, 70%, 90%': {
            transform: 'translate(-2px, -2px)'
          },
          '20%, 40%, 60%, 80%': {
            transform: 'translate(2px, 2px)'
          }
        },

        // ─────────────────────────────────────────────────────────
        // COMPLEX ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        },
        'float-gentle': {
          '0%, 100%': {
            transform: 'translateY(0px) scale(1)'
          },
          '50%': {
            transform: 'translateY(-5px) scale(1.02)'
          }
        },
        'breathe': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(1.03)',
            opacity: '0.95'
          }
        },
        'morph': {
          '0%, 100%': {
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
          },
          '50%': {
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%'
          }
        },

        // ─────────────────────────────────────────────────────────
        // DATA VISUALIZATION ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'count-up': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.5)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        'progress-bar': {
          '0%': {
            width: '0%'
          },
          '100%': {
            width: '100%'
          }
        },
        'draw-line': {
          '0%': {
            strokeDashoffset: '1000'
          },
          '100%': {
            strokeDashoffset: '0'
          }
        },

        // ─────────────────────────────────────────────────────────
        // NOTIFICATION ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'slide-in-notification': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'toast-in': {
          '0%': {
            transform: 'translateY(100%) scale(0.8)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1'
          }
        },

        // ─────────────────────────────────────────────────────────
        // MODAL ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'modal-overlay-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'modal-content-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95) translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)'
          }
        },

        // ─────────────────────────────────────────────────────────
        // LOADING ANIMATIONS
        // ─────────────────────────────────────────────────────────
        'skeleton-loading': {
          '0%': {
            backgroundPosition: '-200% 0'
          },
          '100%': {
            backgroundPosition: '200% 0'
          }
        },
        'dots-bounce': {
          '0%, 80%, 100%': {
            transform: 'scale(0.5)',
            opacity: '0.3'
          },
          '40%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'spinner': {
          '0%': {
            transform: 'rotate(0deg)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          }
        }
      },

      // ═══════════════════════════════════════════════════════════
      // ANIMATION UTILITIES
      // ═══════════════════════════════════════════════════════════
      animation: {
        // Fade animations
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out',

        // Slide animations
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'slide-in-left': 'slide-in-left 0.4s ease-out',

        // Scale animations
        'scale-in': 'scale-in 0.3s ease-out',
        'scale-in-bounce': 'scale-in-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'zoom-in': 'zoom-in 0.4s ease-out',

        // Bounce animations
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'elastic-bounce': 'elastic-bounce 0.8s ease-out',

        // Pulse & Glow
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-glow-green': 'pulse-glow-green 2s ease-in-out infinite',
        'pulse-glow-blue': 'pulse-glow-blue 2s ease-in-out infinite',
        'pulse-glow-purple': 'pulse-glow-purple 2s ease-in-out infinite',
        'pulse-rainbow': 'pulse-rainbow 4s ease-in-out infinite',

        // Shimmer & Shine
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'shimmer-wave': 'shimmer-wave 2s ease-in-out infinite',
        'shine': 'shine 3s ease-in-out infinite',

        // Rotate animations
        'spin-slow': 'spin-slow 3s linear infinite',
        'spin-reverse': 'spin-reverse 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'swing': 'swing 2s ease-in-out infinite',

        // Shake animations
        'shake': 'shake 0.5s ease-in-out',
        'vibrate': 'vibrate 0.3s ease-in-out',

        // Complex animations
        'float': 'float 3s ease-in-out infinite',
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'morph': 'morph 8s ease-in-out infinite',

        // Data visualization
        'count-up': 'count-up 0.8s ease-out',
        'progress-bar': 'progress-bar 1.5s ease-out',
        'draw-line': 'draw-line 2s ease-out',

        // Notifications
        'slide-in-notification': 'slide-in-notification 0.4s ease-out',
        'toast-in': 'toast-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',

        // Modals
        'modal-overlay-in': 'modal-overlay-in 0.3s ease-out',
        'modal-content-in': 'modal-content-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',

        // Loading
        'skeleton-loading': 'skeleton-loading 1.5s ease-in-out infinite',
        'dots-bounce': 'dots-bounce 1.4s ease-in-out infinite',
        'spinner': 'spinner 1s linear infinite'
      }
    }
  }
}
```

---

## ⚡ **FRAMER MOTION - ANIMACIONES AVANZADAS**

### **2. ANIMATION VARIANTS (React Components)**

```typescript
import { Variants } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════
// CONTAINER ANIMATIONS (Stagger Children)
// ═══════════════════════════════════════════════════════════════════
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05,
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// ITEM ANIMATIONS
// ═══════════════════════════════════════════════════════════════════
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// ═══════════════════════════════════════════════════════════════════
// CARD ANIMATIONS (Hover, Tap, Focus)
// ═══════════════════════════════════════════════════════════════════
export const cardVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 12px 40px rgba(102,126,234,0.3)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  tap: {
    scale: 0.98,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  }
};

// ═══════════════════════════════════════════════════════════════════
// BUTTON ANIMATIONS
// ═══════════════════════════════════════════════════════════════════
export const buttonVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    y: -2,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17
    }
  },
  tap: {
    scale: 0.95,
    y: 0,
    boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
  }
};

// ═══════════════════════════════════════════════════════════════════
// MODAL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════
export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: -50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      mass: 0.8
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 50,
    transition: { duration: 0.2 }
  }
};

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR ANIMATIONS
// ═══════════════════════════════════════════════════════════════════
export const sidebarVariants: Variants = {
  collapsed: {
    width: '80px',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  expanded: {
    width: '280px',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

export const sidebarTextVariants: Variants = {
  collapsed: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  },
  expanded: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.1, duration: 0.3 }
  }
};

// ═══════════════════════════════════════════════════════════════════
// DROPDOWN ANIMATIONS
// ═══════════════════════════════════════════════════════════════════
export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.2 }
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
      mass: 0.8
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// TABLE ROW ANIMATIONS
// ═══════════════════════════════════════════════════════════════════
export const tableRowVariants: Variants = {
  initial: {
    backgroundColor: 'transparent'
  },
  hover: {
    backgroundColor: 'rgba(102,126,234,0.08)',
    x: 4,
    transition: { duration: 0.2 }
  }
};

// ═══════════════════════════════════════════════════════════════════
// BADGE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════
export const badgeVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: '0 0 0 0 currentColor'
  },
  pulse: {
    scale: [1, 1.05, 1],
    boxShadow: ['0 0 0 0 currentColor', '0 0 15px 5px currentColor', '0 0 0 0 currentColor'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// CHART ANIMATIONS
// ═══════════════════════════════════════════════════════════════════
export const chartVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATION ANIMATIONS
// ═══════════════════════════════════════════════════════════════════
export const notificationVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.2 }
  }
};
```

---

## 🎨 **GLASSMORPHISM EFFECTS**

### **3. CSS GLASSMORPHISM UTILITIES**

```css
/* ═══════════════════════════════════════════════════════════════════
   GLASSMORPHISM - Efecto Cristal Moderno
   ═══════════════════════════════════════════════════════════════════ */

.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-dark {
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.glass-light {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px) saturate(200%);
  -webkit-backdrop-filter: blur(16px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow:
    0 16px 56px rgba(102, 126, 234, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* ═══════════════════════════════════════════════════════════════════
   GRADIENT BACKGROUNDS
   ═══════════════════════════════════════════════════════════════════ */

.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.gradient-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-danger {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.gradient-rainbow {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #4facfe 75%,
    #00f2fe 100%
  );
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   GLOW EFFECTS
   ═══════════════════════════════════════════════════════════════════ */

.glow-primary {
  box-shadow:
    0 0 20px rgba(102, 126, 234, 0.4),
    0 0 40px rgba(102, 126, 234, 0.2),
    0 0 60px rgba(102, 126, 234, 0.1);
}

.glow-success {
  box-shadow:
    0 0 20px rgba(16, 185, 129, 0.4),
    0 0 40px rgba(16, 185, 129, 0.2);
}

.glow-danger {
  box-shadow:
    0 0 20px rgba(239, 68, 68, 0.4),
    0 0 40px rgba(239, 68, 68, 0.2);
}

.glow-text {
  text-shadow:
    0 0 10px rgba(102, 126, 234, 0.8),
    0 0 20px rgba(102, 126, 234, 0.6),
    0 0 30px rgba(102, 126, 234, 0.4);
}

/* ═══════════════════════════════════════════════════════════════════
   RIPPLE EFFECT
   ═══════════════════════════════════════════════════════════════════ */

.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple:active::after {
  width: 300px;
  height: 300px;
}
```

---

## 📊 **DATA VISUALIZATION ANIMATIONS**

### **4. CHART ANIMATION CONFIG (Recharts)**

```typescript
// ═══════════════════════════════════════════════════════════════════
// RECHARTS ANIMATION CONFIG
// ═══════════════════════════════════════════════════════════════════

export const chartAnimationConfig = {
  // Line Chart Animation
  lineChart: {
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease-in-out',
    isAnimationActive: true
  },

  // Bar Chart Animation
  barChart: {
    animationBegin: 100,
    animationDuration: 1000,
    animationEasing: 'ease-out',
    isAnimationActive: true
  },

  // Area Chart Animation
  areaChart: {
    animationBegin: 0,
    animationDuration: 1800,
    animationEasing: 'ease-in-out',
    isAnimationActive: true
  },

  // Pie Chart Animation
  pieChart: {
    animationBegin: 200,
    animationDuration: 1200,
    animationEasing: 'ease-out',
    isAnimationActive: true,
    startAngle: 90,
    endAngle: 450
  }
};

// ═══════════════════════════════════════════════════════════════════
// CUSTOM ANIMATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export const customChartAnimations = {
  // Counter Animation for Numbers
  animateNumber: (start: number, end: number, duration: number = 1000) => {
    return {
      from: start,
      to: end,
      duration,
      onUpdate: (value: number) => Math.floor(value)
    };
  },

  // Progress Bar Animation
  animateProgress: (progress: number) => {
    return {
      initial: { width: '0%' },
      animate: { width: `${progress}%` },
      transition: { duration: 1.5, ease: 'easeOut' }
    };
  },

  // Stagger Animation for Multiple Elements
  staggerAnimation: (itemCount: number) => {
    return {
      delayChildren: 0.1,
      staggerChildren: 0.05,
      itemCount
    };
  }
};
```

---

## 🎯 **MICRO-INTERACTIONS**

### **5. INTERACTIVE ELEMENTS**

```typescript
// ═══════════════════════════════════════════════════════════════════
// HOVER EFFECTS LIBRARY
// ═══════════════════════════════════════════════════════════════════

export const hoverEffects = {
  // Lift Effect
  lift: {
    whileHover: {
      y: -4,
      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
      transition: { duration: 0.2 }
    }
  },

  // Scale Effect
  scale: {
    whileHover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 300 }
    },
    whileTap: {
      scale: 0.95
    }
  },

  // Glow Effect
  glow: {
    whileHover: {
      boxShadow: '0 0 20px rgba(102,126,234,0.6)',
      transition: { duration: 0.3 }
    }
  },

  // Rotate Effect
  rotate: {
    whileHover: {
      rotate: 5,
      transition: { type: 'spring', stiffness: 200 }
    }
  },

  // Shine Effect
  shine: {
    whileHover: {
      backgroundPosition: '200% center',
      transition: { duration: 0.5 }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// FOCUS EFFECTS
// ═══════════════════════════════════════════════════════════════════

export const focusEffects = {
  ring: {
    whileFocus: {
      boxShadow: '0 0 0 4px rgba(102,126,234,0.3)',
      borderColor: 'rgba(102,126,234,0.8)'
    }
  },

  glow: {
    whileFocus: {
      boxShadow: '0 0 20px rgba(102,126,234,0.5)',
      borderColor: 'rgba(102,126,234,1)'
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// TAP EFFECTS
// ═══════════════════════════════════════════════════════════════════

export const tapEffects = {
  press: {
    whileTap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  },

  bounce: {
    whileTap: {
      scale: 0.9,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
  }
};
```

---

## 🚀 **PERFORMANCE OPTIMIZATION**

### **6. ANIMATION BEST PRACTICES**

```typescript
// ═══════════════════════════════════════════════════════════════════
// OPTIMIZED ANIMATION SETTINGS
// ═══════════════════════════════════════════════════════════════════

export const optimizedAnimationSettings = {
  // Use GPU-accelerated properties only
  gpuAccelerated: {
    transform: true,
    opacity: true,
    filter: false, // Avoid when possible
    boxShadow: false // Use sparingly
  },

  // Reduce Motion for Accessibility
  respectReducedMotion: {
    variants: {
      noMotion: {
        transition: { duration: 0.01 }
      },
      motion: {
        transition: { duration: 0.3 }
      }
    }
  },

  // Lazy Load Animations
  lazyLoadConfig: {
    threshold: 0.1,
    triggerOnce: true
  },

  // Will-Change Optimization
  willChange: {
    onHoverStart: (element) => {
      element.style.willChange = 'transform';
    },
    onHoverEnd: (element) => {
      element.style.willChange = 'auto';
    }
  }
};
```

---

**🎯 PRÓXIMOS PASOS:**

1. Implementar todas las animaciones en Tailwind config
2. Crear componentes con Framer Motion variants
3. Aplicar glassmorphism en Cards, Modals, Sidebar
4. Configurar chart animations en todos los gráficos
5. Agregar micro-interactions en todos los botones y elementos interactivos

**¿Implementamos el Header y Sidebar con todas estas animaciones primero?** 🚀
