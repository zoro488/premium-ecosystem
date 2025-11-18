/**
 * ⌨️ KEYBOARD SHORTCUTS PANEL - Ayuda de atajos de teclado premium
 * Panel modal con todos los shortcuts disponibles, categorizados y buscables
 *
 * CARACTERÍSTICAS:
 * - Shortcuts categorizados por función
 * - Búsqueda en tiempo real
 * - Visual keyboard key representation
 * - Animaciones fluidas
 * - Responsive design
 *
 * @version 1.0.0
 */
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Command, HelpCircle, Keyboard, LayoutDashboard, Search, Settings, X } from 'lucide-react';

import { MagneticButton, StaggerContainer, StaggerItem } from './AdvancedAnimations';

const SHORTCUTS_DATA = [
  {
    category: 'Navegación',
    icon: LayoutDashboard,
    color: 'blue',
    shortcuts: [
      { keys: ['Ctrl', 'D'], description: 'Ir al Dashboard', action: 'DASHBOARD' },
      { keys: ['Ctrl', 'A'], description: 'Ir a Almacén', action: 'WAREHOUSE' },
      { keys: ['Ctrl', 'V'], description: 'Ir a Ventas', action: 'SALES' },
      { keys: ['Ctrl', 'O'], description: 'Ir a Distribuidores', action: 'ORDERS' },
      { keys: ['Ctrl', 'U'], description: 'Ir a Clientes', action: 'CLIENTS' },
      { keys: ['Ctrl', 'B'], description: 'Toggle Sidebar', action: 'TOGGLE_SIDEBAR' },
    ],
  },
  {
    category: 'Buscar y Filtrar',
    icon: Search,
    color: 'green',
    shortcuts: [
      { keys: ['Ctrl', 'K'], description: 'Búsqueda rápida', action: 'SEARCH' },
      { keys: ['Ctrl', 'F'], description: 'Filtrar vista actual', action: 'FILTER' },
      { keys: ['Esc'], description: 'Cerrar modal/búsqueda', action: 'CANCEL' },
    ],
  },
  {
    category: 'Acciones',
    icon: Command,
    color: 'purple',
    shortcuts: [
      { keys: ['Ctrl', 'N'], description: 'Nuevo registro', action: 'NEW' },
      { keys: ['Ctrl', 'E'], description: 'Editar seleccionado', action: 'EDIT' },
      { keys: ['Ctrl', 'S'], description: 'Guardar cambios', action: 'SAVE' },
      { keys: ['Delete'], description: 'Eliminar seleccionado', action: 'DELETE' },
      { keys: ['Ctrl', 'Z'], description: 'Deshacer', action: 'UNDO' },
      { keys: ['Ctrl', 'Y'], description: 'Rehacer', action: 'REDO' },
    ],
  },
  {
    category: 'IA y Análisis',
    icon: HelpCircle,
    color: 'cyan',
    shortcuts: [
      { keys: ['Ctrl', 'I'], description: 'Abrir/Cerrar IA', action: 'TOGGLE_AI' },
      { keys: ['Ctrl', 'P'], description: 'Ver predicciones', action: 'PREDICTIONS' },
      { keys: ['Ctrl', 'R'], description: 'Generar reporte', action: 'REPORT' },
    ],
  },
  {
    category: 'Sistema',
    icon: Settings,
    color: 'orange',
    shortcuts: [
      { keys: ['Ctrl', 'N'], description: 'Notificaciones', action: 'NOTIFICATIONS' },
      { keys: ['Ctrl', 'T'], description: 'Theme customizer', action: 'THEME' },
      { keys: ['Ctrl', '?'], description: 'Ayuda (este panel)', action: 'HELP' },
    ],
  },
];

/**
 * Componente para renderizar tecla individual
 */
const KeyBadge = ({ keyName }) => {
  return (
    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-white/20 to-white/10 border border-white/30 shadow-lg text-white font-mono text-xs font-semibold">
      {keyName}
    </span>
  );
};

/**
 * Componente principal KeyboardShortcutsPanel
 */
export const KeyboardShortcutsPanel = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShortcuts = SHORTCUTS_DATA.map((category) => ({
    ...category,
    shortcuts: category.shortcuts.filter(
      (shortcut) =>
        shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.keys.some((key) => key.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter((category) => category.shortcuts.length > 0);

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

          {/* Panel Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] backdrop-blur-2xl bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-gray-900/98 rounded-3xl border border-white/20 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-700">
                    <Keyboard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Atajos de Teclado</h2>
                    <p className="text-white/60 text-sm">Trabaja más rápido con estos shortcuts</p>
                  </div>
                </div>
                <MagneticButton
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </MagneticButton>
              </div>

              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar shortcut..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-primary/50 transition-all outline-none"
                />
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {filteredShortcuts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Search className="w-16 h-16 text-white/20 mb-4" />
                  <p className="text-white/60">No se encontraron shortcuts</p>
                  <p className="text-white/40 text-sm">Intenta con otra búsqueda</p>
                </div>
              ) : (
                <StaggerContainer className="space-y-6">
                  {filteredShortcuts.map((category) => (
                    <StaggerItem key={category.category}>
                      <div className="space-y-3">
                        {/* Categoría Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`p-2 rounded-lg bg-${category.color}-500/20 border border-${category.color}-500/30`}
                          >
                            <category.icon className={`w-5 h-5 text-${category.color}-400`} />
                          </div>
                          <h3 className="text-lg font-bold text-white">{category.category}</h3>
                        </div>

                        {/* Shortcuts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {category.shortcuts.map((shortcut) => (
                            <motion.div
                              key={`${category.category}-${shortcut.description}`}
                              whileHover={{ scale: 1.02 }}
                              className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <p className="text-white/80 text-sm flex-1">
                                  {shortcut.description}
                                </p>
                                <div className="flex items-center gap-1.5">
                                  {shortcut.keys.map((key, keyIdx) => (
                                    <div
                                      key={`${shortcut.description}-key-${key}`}
                                      className="flex items-center gap-1.5"
                                    >
                                      <KeyBadge keyName={key} />
                                      {keyIdx < shortcut.keys.length - 1 && (
                                        <span className="text-white/40 text-xs">+</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-gradient-to-t from-gray-900/50 to-transparent">
              <div className="flex items-center gap-4">
                <div className="flex-1 p-4 rounded-xl bg-gradient-to-r from-zinc-800/10 to-zinc-800/10 border border-zinc-700/20">
                  <p className="text-white/80 text-sm">
                    💡 <span className="font-semibold">Tip:</span> Mantén presionada la tecla Ctrl
                    para ver todos los shortcuts disponibles en cualquier momento
                  </p>
                </div>
                <MagneticButton
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/80 text-white font-medium transition-all shadow-lg shadow-primary/30"
                >
                  Entendido
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsPanel;
