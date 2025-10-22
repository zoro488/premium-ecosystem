/**
 * 🎯 TOUR GUIADO INTERACTIVO
 * Onboarding para nuevos usuarios
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Pasos del tour
 */
export const TOUR_STEPS = [
  {
    id: 'welcome',
    title: '¡Bienvenido a FlowDistributor! 🚀',
    content:
      'Tu sistema completo de gestión empresarial. Te mostraremos las funciones principales en solo 2 minutos.',
    target: null,
    position: 'center',
  },
  {
    id: 'dashboard',
    title: 'Dashboard Inteligente 📊',
    content:
      'Aquí verás el resumen de tu negocio: KPIs, gráficos en tiempo real, alertas y acciones rápidas.',
    target: '.dashboard-section',
    position: 'bottom',
  },
  {
    id: 'search',
    title: 'Búsqueda Global 🔍',
    content:
      'Busca cualquier cosa: clientes, productos, ventas u órdenes. Usa Ctrl+K para acceso rápido.',
    target: 'button[aria-label="search"]',
    position: 'bottom',
  },
  {
    id: 'navigation',
    title: 'Navegación Rápida 🗺️',
    content:
      'Accede a todos los módulos desde el sidebar. También puedes usar atajos: Ctrl+1 a Ctrl+8.',
    target: 'aside nav',
    position: 'right',
  },
  {
    id: 'ai-assistant',
    title: 'Flow AI - Tu Asistente Inteligente 🤖',
    content:
      'Pregunta cualquier cosa en lenguaje natural. Flow AI analiza tus datos y te da recomendaciones personalizadas.',
    target: '.ai-widget',
    position: 'top',
  },
  {
    id: 'notifications',
    title: 'Centro de Notificaciones 🔔',
    content:
      'Recibe alertas de stock bajo, ventas importantes, adeudos y más. Todo organizado por prioridad.',
    target: 'button[aria-label="notifications"]',
    position: 'bottom',
  },
  {
    id: 'shortcuts',
    title: 'Atajos de Teclado ⌨️',
    content: 'Acelera tu trabajo con shortcuts. Presiona ? para ver todos los atajos disponibles.',
    target: null,
    position: 'center',
  },
  {
    id: 'complete',
    title: '¡Todo Listo! ✨',
    content:
      'Ya conoces lo básico. Explora FlowDistributor y descubre todas sus funcionalidades. ¡Éxito en tu gestión!',
    target: null,
    position: 'center',
  },
];

/**
 * Hook para gestionar el tour
 */
export const useTour = (steps = TOUR_STEPS) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(() => {
    try {
      return localStorage.getItem('flowdistributor_tour_completed') === 'true';
    } catch {
      return false;
    }
  });

  const start = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      complete();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skip = () => {
    setIsActive(false);
    setCompleted(true);
    localStorage.setItem('flowdistributor_tour_completed', 'true');
  };

  const complete = () => {
    setIsActive(false);
    setCompleted(true);
    localStorage.setItem('flowdistributor_tour_completed', 'true');
  };

  const reset = () => {
    setCompleted(false);
    setCurrentStep(0);
    localStorage.removeItem('flowdistributor_tour_completed');
  };

  return {
    isActive,
    currentStep,
    completed,
    totalSteps: steps.length,
    currentStepData: steps[currentStep],
    start,
    next,
    prev,
    skip,
    complete,
    reset,
  };
};

/**
 * Componente del Tour
 */
export const GuidedTour = ({ tour }) => {
  const { isActive, currentStep, totalSteps, currentStepData, next, prev, skip } = tour;
  const [highlightedElement, setHighlightedElement] = useState(null);

  useEffect(() => {
    if (isActive && currentStepData?.target) {
      const element = document.querySelector(currentStepData.target);
      setHighlightedElement(element);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setHighlightedElement(null);
    }
  }, [isActive, currentStep, currentStepData]);

  if (!isActive) return null;

  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const isCentered = currentStepData.position === 'center';

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999]"
      >
        {/* Highlight del elemento */}
        {highlightedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute border-4 border-blue-500 rounded-lg shadow-2xl shadow-blue-500/50 pointer-events-none"
            style={{
              top: highlightedElement.offsetTop - 8,
              left: highlightedElement.offsetLeft - 8,
              width: highlightedElement.offsetWidth + 16,
              height: highlightedElement.offsetHeight + 16,
            }}
          />
        )}

        {/* Card del tour */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`fixed bg-slate-900 rounded-2xl shadow-2xl border border-white/20 max-w-md w-full p-6 ${
            isCentered ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''
          }`}
          style={
            !isCentered && highlightedElement
              ? {
                  top:
                    currentStepData.position === 'bottom'
                      ? highlightedElement.offsetTop + highlightedElement.offsetHeight + 20
                      : currentStepData.position === 'top'
                        ? highlightedElement.offsetTop - 300
                        : highlightedElement.offsetTop,
                  left:
                    currentStepData.position === 'right'
                      ? highlightedElement.offsetLeft + highlightedElement.offsetWidth + 20
                      : highlightedElement.offsetLeft,
                }
              : {}
          }
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                  {currentStep + 1}
                </div>
                <span className="text-xs text-slate-400">
                  Paso {currentStep + 1} de {totalSteps}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{currentStepData.title}</h3>
            </div>
            <button onClick={skip} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido */}
          <p className="text-slate-300 mb-6 leading-relaxed">{currentStepData.content}</p>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            {!isFirst && (
              <button
                onClick={prev}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
            )}
            <button
              onClick={next}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isLast ? (
                <>
                  Finalizar
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Skip */}
          {!isLast && (
            <button
              onClick={skip}
              className="w-full mt-3 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Saltar tutorial
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default { useTour, GuidedTour, TOUR_STEPS };
