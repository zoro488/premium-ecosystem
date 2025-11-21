import { useEffect, useState } from 'react';

// 🎨 THEME SYSTEM - Sistema de Temas Personalizables

// Definición de temas predefinidos
export const THEMES = {
  cosmic: {
    name: 'Cosmic Purple',
    icon: '🌌',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
      background: 'rgba(17, 24, 39, 0.95)',
      foreground: '#F9FAFB',
      border: 'rgba(255, 255, 255, 0.1)',
      glass: 'rgba(255, 255, 255, 0.05)',
    },
    gradients: {
      primary: 'from-zinc-800 via-zinc-700 to-zinc-800',
      secondary: 'from-blue-500 to-cyan-500',
      success: 'from-green-500 to-emerald-500',
      warning: 'from-yellow-500 to-orange-500',
      danger: 'from-zinc-700 to-zinc-800',
    },
  },

  ocean: {
    name: 'Ocean Blue',
    icon: '🌊',
    colors: {
      primary: '#3B82F6',
      secondary: '#06B6D4',
      accent: '#10B981',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
      background: 'rgba(15, 23, 42, 0.95)',
      foreground: '#F1F5F9',
      border: 'rgba(59, 130, 246, 0.2)',
      glass: 'rgba(59, 130, 246, 0.05)',
    },
    gradients: {
      primary: 'from-blue-500 to-cyan-500',
      secondary: 'from-cyan-500 to-teal-500',
      success: 'from-emerald-500 to-green-500',
      warning: 'from-amber-500 to-orange-500',
      danger: 'from-rose-500 to-zinc-800',
    },
  },

  sunset: {
    name: 'Sunset Vibes',
    icon: '🌅',
    colors: {
      primary: '#F59E0B',
      secondary: '#EF4444',
      accent: '#EC4899',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
      background: 'rgba(30, 20, 20, 0.95)',
      foreground: '#FEF3C7',
      border: 'rgba(245, 158, 11, 0.2)',
      glass: 'rgba(245, 158, 11, 0.05)',
    },
    gradients: {
      primary: 'from-orange-500 to-zinc-800',
      secondary: 'from-zinc-700 to-zinc-800',
      success: 'from-green-500 to-lime-500',
      warning: 'from-yellow-500 to-orange-500',
      danger: 'from-zinc-700 to-zinc-800',
    },
  },

  forest: {
    name: 'Forest Green',
    icon: '🌲',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#84CC16',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
      background: 'rgba(20, 30, 20, 0.95)',
      foreground: '#ECFDF5',
      border: 'rgba(16, 185, 129, 0.2)',
      glass: 'rgba(16, 185, 129, 0.05)',
    },
    gradients: {
      primary: 'from-emerald-500 to-green-600',
      secondary: 'from-green-500 to-lime-500',
      success: 'from-green-400 to-emerald-500',
      warning: 'from-yellow-500 to-amber-500',
      danger: 'from-zinc-700 to-orange-500',
    },
  },

  midnight: {
    name: 'Midnight Dark',
    icon: '🌙',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#A78BFA',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
      background: 'rgba(10, 10, 20, 0.98)',
      foreground: '#E0E7FF',
      border: 'rgba(99, 102, 241, 0.2)',
      glass: 'rgba(99, 102, 241, 0.05)',
    },
    gradients: {
      primary: 'from-indigo-500 to-zinc-800',
      secondary: 'from-zinc-800 to-violet-600',
      success: 'from-emerald-500 to-teal-500',
      warning: 'from-amber-500 to-yellow-500',
      danger: 'from-zinc-700 to-rose-600',
    },
  },

  candy: {
    name: 'Candy Pop',
    icon: '🍭',
    colors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      accent: '#A855F7',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
      background: 'rgba(30, 20, 30, 0.95)',
      foreground: '#FCE7F3',
      border: 'rgba(236, 72, 153, 0.2)',
      glass: 'rgba(236, 72, 153, 0.05)',
    },
    gradients: {
      primary: 'from-zinc-800 via-zinc-700 to-zinc-800',
      secondary: 'from-fuchsia-500 to-zinc-800',
      success: 'from-green-400 to-emerald-400',
      warning: 'from-orange-400 to-amber-400',
      danger: 'from-zinc-700 to-zinc-800',
    },
  },
};

// Tamaños de componentes
export const COMPONENT_SIZES = {
  compact: {
    name: 'Compacto',
    padding: 'sm',
    fontSize: 'sm',
    spacing: 'tight',
    cardPadding: 'p-4',
    buttonPadding: 'px-4 py-2',
    textSize: 'text-sm',
    headingSize: 'text-xl',
  },
  normal: {
    name: 'Normal',
    padding: 'md',
    fontSize: 'base',
    spacing: 'normal',
    cardPadding: 'p-6',
    buttonPadding: 'px-6 py-3',
    textSize: 'text-base',
    headingSize: 'text-2xl',
  },
  comfortable: {
    name: 'Confortable',
    padding: 'lg',
    fontSize: 'lg',
    spacing: 'relaxed',
    cardPadding: 'p-8',
    buttonPadding: 'px-8 py-4',
    textSize: 'text-lg',
    headingSize: 'text-3xl',
  },
};

// 🎨 Custom Hook para gestionar temas
export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('flowdistributor-theme');
    return saved || 'cosmic';
  });

  const [componentSize, setComponentSize] = useState(() => {
    const saved = localStorage.getItem('flowdistributor-component-size');
    return saved || 'normal';
  });

  const [customAccent, setCustomAccent] = useState(() => {
    const saved = localStorage.getItem('flowdistributor-custom-accent');
    return saved || null;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('flowdistributor-dark-mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Aplicar tema al DOM
  useEffect(() => {
    const theme = THEMES[currentTheme];
    if (!theme) return;

    const root = document.documentElement;

    // Aplicar colores CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Aplicar modo claro/oscuro
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Guardar en localStorage
    localStorage.setItem('flowdistributor-theme', currentTheme);
  }, [currentTheme, isDarkMode]);

  useEffect(() => {
    localStorage.setItem('flowdistributor-component-size', componentSize);
  }, [componentSize]);

  useEffect(() => {
    if (customAccent) {
      document.documentElement.style.setProperty('--color-accent-custom', customAccent);
      localStorage.setItem('flowdistributor-custom-accent', customAccent);
    }
  }, [customAccent]);

  useEffect(() => {
    localStorage.setItem('flowdistributor-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const changeTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeComponentSize = (size) => {
    if (COMPONENT_SIZES[size]) {
      setComponentSize(size);
    }
  };

  const setAccentColor = (color) => {
    setCustomAccent(color);
  };

  const resetTheme = () => {
    setCurrentTheme('cosmic');
    setComponentSize('normal');
    setCustomAccent(null);
    setIsDarkMode(true);
    localStorage.removeItem('flowdistributor-theme');
    localStorage.removeItem('flowdistributor-component-size');
    localStorage.removeItem('flowdistributor-custom-accent');
    localStorage.removeItem('flowdistributor-dark-mode');
  };

  return {
    currentTheme,
    theme: THEMES[currentTheme],
    componentSize,
    sizeConfig: COMPONENT_SIZES[componentSize],
    customAccent,
    isDarkMode,
    changeTheme,
    toggleDarkMode,
    changeComponentSize,
    setAccentColor,
    resetTheme,
    availableThemes: Object.keys(THEMES),
    availableSizes: Object.keys(COMPONENT_SIZES),
  };
};

// 🎨 Componente de Configuración de Tema
export const ThemeCustomizer = ({ isOpen, onClose }) => {
  const {
    currentTheme,
    theme,
    componentSize,
    customAccent,
    isDarkMode,
    changeTheme,
    toggleDarkMode,
    changeComponentSize,
    setAccentColor,
    resetTheme,
    availableThemes,
    availableSizes,
  } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="glass rounded-2xl p-8 max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">🎨 Personalizar Tema</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="mb-6 p-4 glass rounded-xl border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold mb-1">Modo Oscuro</h3>
              <p className="text-sm text-slate-400">Activa o desactiva el modo oscuro</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                isDarkMode ? 'bg-zinc-800' : 'bg-slate-600'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  isDarkMode ? 'translate-x-8' : 'translate-x-0'
                }`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs">
                  {isDarkMode ? '🌙' : '☀️'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Esquema de Color</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableThemes.map((themeName) => {
              const t = THEMES[themeName];
              return (
                <button
                  key={themeName}
                  onClick={() => changeTheme(themeName)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    currentTheme === themeName
                      ? 'border-zinc-700 bg-zinc-900/10 scale-105'
                      : 'border-white/10 hover:border-white/20 hover:scale-102'
                  }`}
                >
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <div className="flex gap-1 mt-2">
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: t.colors.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: t.colors.secondary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: t.colors.accent }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Component Size */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Tamaño de Componentes</h3>
          <div className="grid grid-cols-3 gap-3">
            {availableSizes.map((size) => {
              const s = COMPONENT_SIZES[size];
              return (
                <button
                  key={size}
                  onClick={() => changeComponentSize(size)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    componentSize === size
                      ? 'border-zinc-700 bg-zinc-900/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <p className="text-sm font-semibold">{s.name}</p>
                  <div className={`mt-2 ${s.textSize}`}>Aa</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Accent Color */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Color Acento Personalizado</h3>
          <div className="flex gap-3">
            <input
              type="color"
              value={customAccent || theme.colors.accent}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-16 h-16 rounded-xl border-2 border-white/10 cursor-pointer"
            />
            <div className="flex-1 p-4 glass rounded-xl border border-white/10">
              <p className="text-sm text-slate-400 mb-1">Color seleccionado</p>
              <p className="font-mono text-sm">{customAccent || theme.colors.accent}</p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 glass rounded-xl border border-white/10">
          <h3 className="font-semibold mb-3">Vista Previa</h3>
          <div className="space-y-3">
            <div
              className={`${COMPONENT_SIZES[componentSize].cardPadding} rounded-xl border border-white/10`}
              style={{
                background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                opacity: 0.8,
              }}
            >
              <p className={`${COMPONENT_SIZES[componentSize].textSize} font-semibold text-white`}>
                Tarjeta de ejemplo
              </p>
            </div>
            <button
              className={`${COMPONENT_SIZES[componentSize].buttonPadding} ${COMPONENT_SIZES[componentSize].textSize} rounded-xl font-semibold`}
              style={{ backgroundColor: customAccent || theme.colors.accent }}
            >
              Botón de ejemplo
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={resetTheme}
            className="flex-1 px-4 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
          >
            Restaurar Predeterminado
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default { useTheme, ThemeCustomizer, THEMES, COMPONENT_SIZES };
