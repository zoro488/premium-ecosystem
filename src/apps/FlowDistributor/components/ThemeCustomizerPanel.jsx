/**
 * 🎨 THEME CUSTOMIZER PANEL - Personalizador de tema premium
 * Panel para personalizar colores, fuentes, espaciado y efectos visuales
 *
 * CARACTERÍSTICAS:
 * - Color picker avanzado
 * - Presets de temas predefinidos
 * - Preview en tiempo real
 * - Glassmorphism intensity control
 * - Font size scaling
 * - Animation speed control
 * - Export/Import configuración
 *
 * @version 1.0.0
 */
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Download,
  Moon,
  Palette,
  RefreshCw,
  Sparkles,
  Sun,
  Upload,
  X,
  Zap,
} from 'lucide-react';

import { MagneticButton, StaggerContainer, StaggerItem } from './AdvancedAnimations';

const THEME_PRESETS = [
  {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: { primary: '#0EA5E9', secondary: '#06B6D4', accent: '#3B82F6' },
    icon: '🌊',
  },
  {
    id: 'forest',
    name: 'Forest Green',
    colors: { primary: '#10B981', secondary: '#059669', accent: '#34D399' },
    icon: '🌲',
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    colors: { primary: '#F97316', secondary: '#FB923C', accent: '#FDBA74' },
    icon: '🌅',
  },
  {
    id: 'purple',
    name: 'Purple Dream',
    colors: { primary: '#8B5CF6', secondary: '#A78BFA', accent: '#C4B5FD' },
    icon: '💜',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: { primary: '#FF00FF', secondary: '#00FFFF', accent: '#FFFF00' },
    icon: '🤖',
  },
  {
    id: 'elegant',
    name: 'Elegant Dark',
    colors: { primary: '#64748B', secondary: '#94A3B8', accent: '#CBD5E1' },
    icon: '🎩',
  },
];

/**
 * Componente Color Picker
 */
const ColorPicker = ({ label, value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-white/80 text-sm font-medium block">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-16 rounded-xl border-2 border-white/20 cursor-pointer bg-transparent"
        />
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono focus:bg-white/10 focus:border-primary/50 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Componente principal ThemeCustomizerPanel
 */
export const ThemeCustomizerPanel = ({ isOpen, onClose }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customColors, setCustomColors] = useState({
    primary: '#0EA5E9',
    secondary: '#8B5CF6',
    accent: '#10B981',
  });
  const [glassIntensity, setGlassIntensity] = useState(10);
  const [fontSize, setFontSize] = useState(16);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.id);
    setCustomColors(preset.colors);
  };

  const handleReset = () => {
    setDarkMode(true);
    setSelectedPreset(null);
    setCustomColors({ primary: '#0EA5E9', secondary: '#8B5CF6', accent: '#10B981' });
    setGlassIntensity(10);
    setFontSize(16);
    setAnimationSpeed(1);
  };

  const handleExport = () => {
    const config = {
      darkMode,
      customColors,
      glassIntensity,
      fontSize,
      animationSpeed,
      preset: selectedPreset,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme-config.json';
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target.result);
          setDarkMode(config.darkMode ?? true);
          setCustomColors(config.customColors);
          setGlassIntensity(config.glassIntensity ?? 10);
          setFontSize(config.fontSize ?? 16);
          setAnimationSpeed(config.animationSpeed ?? 1);
          setSelectedPreset(config.preset ?? null);
        } catch (error) {
          console.error('Error importing theme:', error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg backdrop-blur-2xl bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-gray-900/98 border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-zinc-700 to-zinc-800">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Personalizador</h2>
                    <p className="text-white/60 text-sm">Personaliza tu experiencia</p>
                  </div>
                </div>
                <MagneticButton
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </MagneticButton>
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <StaggerContainer>
                {/* Dark Mode Toggle */}
                <StaggerItem>
                  <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {darkMode ? (
                          <Moon className="w-5 h-5 text-zinc-300" />
                        ) : (
                          <Sun className="w-5 h-5 text-zinc-200" />
                        )}
                        <div>
                          <h3 className="text-white font-semibold">Modo Oscuro</h3>
                          <p className="text-white/60 text-xs">Activado por defecto</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          darkMode ? 'bg-primary' : 'bg-white/20'
                        }`}
                      >
                        <motion.div
                          animate={{ x: darkMode ? 24 : 2 }}
                          className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                        />
                      </button>
                    </div>
                  </div>
                </StaggerItem>

                {/* Presets */}
                <StaggerItem>
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-zinc-200" />
                      Temas Predefinidos
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {THEME_PRESETS.map((preset) => (
                        <MagneticButton
                          key={preset.id}
                          onClick={() => handlePresetSelect(preset)}
                          className={`p-4 rounded-xl backdrop-blur-md border transition-all ${
                            selectedPreset === preset.id
                              ? 'bg-primary/20 border-primary/50'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{preset.icon}</span>
                            {selectedPreset === preset.id && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <h4 className="text-white font-semibold text-sm">{preset.name}</h4>
                          <div className="flex gap-1 mt-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.colors.primary }}
                            />
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.colors.secondary }}
                            />
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.colors.accent }}
                            />
                          </div>
                        </MagneticButton>
                      ))}
                    </div>
                  </div>
                </StaggerItem>

                {/* Custom Colors */}
                <StaggerItem>
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Palette className="w-4 h-4 text-zinc-700" />
                      Colores Personalizados
                    </h3>
                    <ColorPicker
                      label="Color Primario"
                      value={customColors.primary}
                      onChange={(color) => setCustomColors({ ...customColors, primary: color })}
                    />
                    <ColorPicker
                      label="Color Secundario"
                      value={customColors.secondary}
                      onChange={(color) => setCustomColors({ ...customColors, secondary: color })}
                    />
                    <ColorPicker
                      label="Color de Acento"
                      value={customColors.accent}
                      onChange={(color) => setCustomColors({ ...customColors, accent: color })}
                    />
                  </div>
                </StaggerItem>

                {/* Glass Intensity */}
                <StaggerItem>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">Intensidad Glassmorphism</h3>
                      <span className="text-primary font-mono text-sm">{glassIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={glassIntensity}
                      onChange={(e) => setGlassIntensity(e.target.value)}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>
                </StaggerItem>

                {/* Font Size */}
                <StaggerItem>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">Tamaño de Fuente</h3>
                      <span className="text-primary font-mono text-sm">{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>
                </StaggerItem>

                {/* Animation Speed */}
                <StaggerItem>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-zinc-200" />
                        Velocidad de Animaciones
                      </h3>
                      <span className="text-primary font-mono text-sm">{animationSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={animationSpeed}
                      onChange={(e) => setAnimationSpeed(e.target.value)}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 space-y-3">
              <div className="flex gap-2">
                <MagneticButton
                  onClick={handleExport}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </MagneticButton>
                <MagneticButton
                  onClick={handleImport}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Importar
                </MagneticButton>
              </div>
              <div className="flex gap-2">
                <MagneticButton
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-9000/20 hover:bg-zinc-9000/30 text-red-300 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resetear
                </MagneticButton>
                <MagneticButton
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary hover:bg-primary/80 text-white font-medium transition-all shadow-lg shadow-primary/30"
                >
                  Aplicar Cambios
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ThemeCustomizerPanel;
