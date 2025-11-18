/**
 * 🚀 SHOWCASE AAA ENHANCED CON IA
 * Demostración interactiva de todos los componentes AAA
 * + Exportador de animaciones a Lottie/After Effects
 * + IA para generar variaciones de componentes
 * + Avatar IA interactivo como asistente
 *
 * @version 5.0.0
 */
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import AIDesignAutomationEngine from '../../services/adobe/AIDesignAutomationEngine';
import { useAnimationExporter } from '../../services/adobe/AnimationExporter';
import AIAvatarInteractive from '../ai/AIAvatarInteractive';
import { ButtonAAA, CardAAA, InputAAA, ToggleAAA } from './ComponentsAAA';

export const ShowcaseEnhancedAAA = () => {
  const [activeSection, setActiveSection] = useState('buttons');
  const [showAvatar, setShowAvatar] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedVariations, setGeneratedVariations] = useState([]);
  const [_showExportMenu, _setShowExportMenu] = useState(false);

  const { exportAnimation, exporting, progress } = useAnimationExporter();
  const aiEngine = new AIDesignAutomationEngine();

  // Definiciones de animaciones para exportar
  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4 },
    },
    slideRight: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5 },
    },
    rotateIn: {
      initial: { opacity: 0, rotate: -180, scale: 0 },
      animate: { opacity: 1, rotate: 0, scale: 1 },
      transition: { duration: 0.6, type: 'spring' },
    },
  };

  // Generar variaciones con IA
  const handleGenerateVariations = async (componentType) => {
    setGenerating(true);
    try {
      const variations = await aiEngine.generateDesignVariations(componentType, 3);
      setGeneratedVariations(variations);
    } catch (_error) {
      // Error en generación de variaciones
    } finally {
      setGenerating(false);
    }
  };

  // Exportar animación específica
  const handleExportAnimation = async (animName) => {
    const anim = animations[animName];
    await exportAnimation(anim, animName, ['lottie', 'ae']);
  };

  // Exportar todas las animaciones
  const handleExportAll = async () => {
    for (const [name, anim] of Object.entries(animations)) {
      await exportAnimation(anim, `FlowDistributor_${name}`, ['lottie', 'ae']);
    }
  };

  const sections = {
    buttons: 'Botones Premium',
    inputs: 'Inputs Interactivos',
    cards: 'Cards con Depth',
    toggles: 'Toggles Animados',
    animations: 'Exportar Animaciones',
    ai: 'IA Generativa',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-indigo-900 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold bg-gradient-to-r from-zinc-800 via-zinc-700 to-blue-400 bg-clip-text text-transparent mb-4">
          Showcase AAA + IA
        </h1>
        <p className="text-xl text-gray-300">
          Componentes premium con animaciones exportables y generación por IA
        </p>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {Object.entries(sections).map(([key, label]) => (
          <motion.button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-300
              ${
                activeSection === key
                  ? 'bg-gradient-to-r from-zinc-800 to-zinc-800 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {label}
          </motion.button>
        ))}
      </div>

      {/* AI Avatar Button (flotante) */}
      <motion.button
        onClick={() => setShowAvatar(!showAvatar)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-800 shadow-2xl flex items-center justify-center text-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={showAvatar ? { rotate: 180 } : { rotate: 0 }}
      >
        {showAvatar ? '✕' : '🤖'}
      </motion.button>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {/* BUTTONS SECTION */}
          {activeSection === 'buttons' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">🎯 Botones AAA</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <ButtonAAA variant="primary">Primary</ButtonAAA>
                <ButtonAAA variant="secondary">Secondary</ButtonAAA>
                <ButtonAAA variant="ghost">Ghost</ButtonAAA>
                <ButtonAAA variant="danger">Danger</ButtonAAA>
              </div>

              <div className="flex gap-4">
                <ButtonAAA size="sm">Small</ButtonAAA>
                <ButtonAAA size="md">Medium</ButtonAAA>
                <ButtonAAA size="lg">Large</ButtonAAA>
              </div>

              <div className="flex gap-4">
                <ButtonAAA loading>Loading...</ButtonAAA>
                <ButtonAAA disabled>Disabled</ButtonAAA>
                <ButtonAAA icon={<span>🚀</span>}>Con Icono</ButtonAAA>
              </div>

              {/* AI Controls */}
              <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-zinc-700/30">
                <h3 className="text-xl font-bold text-white mb-4">🤖 Generar con IA</h3>
                <ButtonAAA
                  onClick={() => handleGenerateVariations('ButtonAAA')}
                  loading={generating}
                >
                  {generating ? 'Generando variaciones...' : 'Generar 3 Variaciones'}
                </ButtonAAA>
              </div>
            </div>
          )}

          {/* INPUTS SECTION */}
          {activeSection === 'inputs' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">📝 Inputs AAA</h2>

              <InputAAA label="Email Premium" placeholder="tu@email.com" icon={<span>📧</span>} />

              <InputAAA
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                icon={<span>🔒</span>}
              />

              <InputAAA
                label="Búsqueda Inteligente"
                placeholder="Buscar con IA..."
                icon={<span>🔍</span>}
                withClearButton
              />

              <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-zinc-700/30">
                <h3 className="text-xl font-bold text-white mb-4">🤖 Generar con IA</h3>
                <ButtonAAA
                  onClick={() => handleGenerateVariations('InputAAA')}
                  loading={generating}
                >
                  {generating ? 'Generando variaciones...' : 'Generar 3 Variaciones'}
                </ButtonAAA>
              </div>
            </div>
          )}

          {/* CARDS SECTION */}
          {activeSection === 'cards' && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardAAA
                title="Card Premium"
                subtitle="Con efecto de profundidad 2.5D"
                footer={<ButtonAAA size="sm">Ver más</ButtonAAA>}
              >
                Contenido de la card con glassmorphism y animaciones suaves.
              </CardAAA>

              <CardAAA
                variant="neon"
                title="Card Neon"
                subtitle="Estilo cyberpunk"
                footer={
                  <ButtonAAA variant="secondary" size="sm">
                    Explorar
                  </ButtonAAA>
                }
              >
                Card con efectos de neón y gradientes vibrantes.
              </CardAAA>

              <CardAAA variant="glow" title="Card Glow" subtitle="Con resplandor suave">
                Card con efecto de resplandor elegante.
              </CardAAA>

              <CardAAA variant="gradient" title="Card Gradient" subtitle="Gradiente animado">
                Card con gradiente que cambia con el tiempo.
              </CardAAA>

              <div className="col-span-full mt-8 p-6 bg-white/5 rounded-2xl border border-zinc-700/30">
                <h3 className="text-xl font-bold text-white mb-4">🤖 Generar con IA</h3>
                <ButtonAAA onClick={() => handleGenerateVariations('CardAAA')} loading={generating}>
                  {generating ? 'Generando variaciones...' : 'Generar 3 Variaciones'}
                </ButtonAAA>
              </div>
            </div>
          )}

          {/* TOGGLES SECTION */}
          {activeSection === 'toggles' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">🔄 Toggles AAA</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-2xl">
                  <ToggleAAA label="Modo oscuro" />
                </div>
                <div className="p-6 bg-white/5 rounded-2xl">
                  <ToggleAAA label="Notificaciones" defaultChecked />
                </div>
                <div className="p-6 bg-white/5 rounded-2xl">
                  <ToggleAAA label="Modo público" />
                </div>
                <div className="p-6 bg-white/5 rounded-2xl">
                  <ToggleAAA label="Auto-guardar" defaultChecked />
                </div>
              </div>

              <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-zinc-700/30">
                <h3 className="text-xl font-bold text-white mb-4">🤖 Generar con IA</h3>
                <ButtonAAA
                  onClick={() => handleGenerateVariations('ToggleAAA')}
                  loading={generating}
                >
                  {generating ? 'Generando variaciones...' : 'Generar 3 Variaciones'}
                </ButtonAAA>
              </div>
            </div>
          )}

          {/* ANIMATIONS EXPORT SECTION */}
          {activeSection === 'animations' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">🎬 Exportar Animaciones</h2>

              <div className="p-6 bg-white/5 rounded-2xl border border-zinc-700/30">
                <h3 className="text-xl font-bold text-white mb-4">Animaciones Disponibles</h3>
                <p className="text-gray-300 mb-6">
                  Exporta cualquier animación a formato Lottie (JSON) o After Effects (.jsx)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {Object.keys(animations).map((animName) => (
                    <motion.div
                      key={animName}
                      className="p-4 bg-gradient-to-r from-zinc-800/10 to-zinc-800/10 rounded-xl border border-zinc-700/30"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-white">{animName}</h4>
                          <p className="text-sm text-gray-400">
                            {JSON.stringify(animations[animName].initial)} →{' '}
                            {JSON.stringify(animations[animName].animate)}
                          </p>
                        </div>
                        <ButtonAAA
                          size="sm"
                          onClick={() => handleExportAnimation(animName)}
                          disabled={exporting}
                        >
                          📥 Exportar
                        </ButtonAAA>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <ButtonAAA
                  onClick={handleExportAll}
                  loading={exporting}
                  variant="primary"
                  icon={<span>🎬</span>}
                >
                  {exporting ? `Exportando... ${progress}%` : 'Exportar Todas (Lottie + AE)'}
                </ButtonAAA>

                {exporting && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-zinc-800 to-zinc-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-green-500/30">
                <h3 className="text-xl font-bold text-white mb-4">
                  ✅ Cómo usar los archivos exportados
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>
                    📦 <strong>Lottie JSON:</strong> Usar con lottie-react o lottie-web
                  </li>
                  <li>
                    🎬 <strong>After Effects .jsx:</strong> Abrir en Adobe After Effects → File →
                    Scripts → Run Script File
                  </li>
                  <li>
                    🚀 <strong>Web:</strong> Importar el JSON y usar con{' '}
                    <code className="text-zinc-200">{'<Lottie animationData={json} />'}</code>
                  </li>
                  <li>
                    📱 <strong>Mobile:</strong> Compatible con Lottie para iOS y Android
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* AI GENERATIVE SECTION */}
          {activeSection === 'ai' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">🤖 IA Generativa</h2>

              <div className="p-6 bg-white/5 rounded-2xl border border-zinc-700/30">
                <h3 className="text-xl font-bold text-white mb-4">Generar Componente Nuevo</h3>
                <p className="text-gray-300 mb-6">
                  Describe el componente que necesitas y la IA lo generará con código, estilos,
                  animaciones y tests.
                </p>

                <InputAAA
                  label="Descripción del Componente"
                  placeholder="Ej: Un botón de descarga con animación de progreso circular"
                  multiline
                  rows={3}
                />

                <div className="mt-4">
                  <ButtonAAA
                    onClick={() => handleGenerateVariations('CustomComponent')}
                    loading={generating}
                    icon={<span>✨</span>}
                  >
                    {generating ? 'Generando con IA...' : 'Generar Componente'}
                  </ButtonAAA>
                </div>
              </div>

              {generatedVariations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-white/5 rounded-2xl border border-green-500/30"
                >
                  <h3 className="text-xl font-bold text-white mb-4">✅ Variaciones Generadas</h3>
                  <div className="space-y-4">
                    {generatedVariations.map((variation, idx) => (
                      <div key={idx} className="p-4 bg-black/30 rounded-xl">
                        <h4 className="font-semibold text-zinc-200 mb-2">Variación {idx + 1}</h4>
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          {JSON.stringify(variation, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* AI Avatar Modal */}
      <AnimatePresence>
        {showAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-end justify-end p-8"
            onClick={() => setShowAvatar(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-zinc-800/90 to-indigo-900/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-zinc-700/50 shadow-2xl max-w-md"
            >
              <AIAvatarInteractive
                name="FlowBot Supreme"
                personality="professional-friendly"
                voiceEnabled={true}
                particlesEnabled={true}
                holographicEffect={true}
                size="large"
                onMessage={(_data) => {}}
                initialGreeting="¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte con los componentes?"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowcaseEnhancedAAA;
