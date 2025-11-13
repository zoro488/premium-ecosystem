/**
 * 🎨 PREMIUM UI COMPONENTS - INDEX
 * Sistema completo de componentes UI/UX optimizados
 */

// ============================================
// HOOKS DE ANIMACIONES
// ============================================
export {
  use3DTilt,
  useAnimatedGradient,
  useAnimationFrame,
  useDebounce,
  useElasticHover,
  useElementSize,
  useFloating,
  useGlassMorphism,
  useHover,
  useIntersectionObserver,
  useLazyLoad,
  useMagneticCursor,
  useMediaQuery,
  useMorphing,
  useMousePosition,
  useParallax,
  useParticles,
  usePerformanceMonitor,
  usePrefersReducedMotion,
  useRipple,
  useScrollProgress,
  useShimmer,
  useStaggerChildren,
  useTypingAnimation,
  useWaveAnimation,
} from '../../hooks/useAnimations';

// ============================================
// GRÁFICOS AVANZADOS
// ============================================
export {
  AnimatedDonut,
  ComparisonBar,
  GaugeChart,
  GradientProgress,
  Heatmap,
  Sparkline,
  TrendPrediction,
} from '../charts/AdvancedCharts';
// ============================================
// EFECTOS VISUALES
// ============================================
export {
  AuroraBackground,
  BlobAnimations,
  FloatingParticles,
  GlowEffect,
  GradientBorder,
  GradientMesh,
  LiquidCursor,
  ParallaxLayer,
  RainbowGradient,
  ShimmerWave,
  StarField,
} from '../effects/VisualEffects';

// ============================================
// FEEDBACK VISUAL
// ============================================
export {
  CircularProgress,
  ConfettiCelebration,
  LoadingSpinner,
  NotificationBadge,
  ProgressSteps,
  SkeletonShimmer,
  Toast,
} from '../feedback/FeedbackSystem';

// ============================================
// COMPONENTES INTERACTIVOS
// ============================================
export {
  ColorPicker,
  CommandPalette,
  DraggableCard,
  DropZone,
  SortableList,
  SpotlightSearch,
  SwipeableCard,
} from '../interactive/InteractivePremium';

// ============================================
// NAVEGACIÓN
// ============================================
export {
  AnimatedDropdown,
  AnimatedSidebar,
  FloatingActionButton,
  LiquidTabBar,
  MobileMenu,
  PremiumBreadcrumbs,
} from '../navigation/PremiumNavigation';
// ============================================
// TRANSICIONES
// ============================================
export {
  BlurSlide,
  Curtain,
  FadeScale,
  ModalTransition,
  MorphCard,
  PageTransition,
  RotationFade,
  Slide,
  StaggerItem,
  StaggerList,
  TabTransition,
  Zoom,
} from '../transitions/PageTransitions';
// ============================================
// MICROINTERACCIONES
// ============================================
export {
  AnimatedSlider,
  FloatingInput,
  LiquidCheckbox,
  LiquidToggle,
  OrigamiDropdown,
  RippleButton,
} from '../ui/MicroInteractions';

// ============================================
// EXPORTS POR CATEGORÍA
// ============================================

/**
 * Microinteracciones - Componentes con feedback táctil
 * TODO: Implementar estos componentes
 */
// export const Microinteractions = {
//   RippleButton,
//   FloatingInput,
//   LiquidToggle,
//   LiquidCheckbox,
//   OrigamiDropdown,
//   AnimatedSlider,
// };

/**
 * Gráficos - Visualizaciones de datos avanzadas
 * TODO: Verificar imports de AdvancedCharts
 */
// export const Charts = {
//   Sparkline,
//   Heatmap,
//   GaugeChart,
//   TrendPrediction,
//   AnimatedDonut,
//   ComparisonBar,
//   GradientProgress,
// };

/**
 * Transiciones - Animaciones de página y modales
 * TODO: Implementar componentes de transici\u00f3n
 */
// export const Transitions = {
//   FadeScale,
//   Slide,
//   Curtain,
//   RotationFade,
//   StaggerList,
//   StaggerItem,
//   MorphCard,
//   Zoom,
//   BlurSlide,
//   PageTransition,
//   TabTransition,
//   ModalTransition,
// };

/**
 * Feedback - Notificaciones y estados de carga
 * TODO: Implementar componentes de feedback
 */
// export const Feedback = {
//   Toast,
//   ConfettiCelebration,
//   CircularProgress,
//   SkeletonShimmer,
//   ProgressSteps,
//   LoadingSpinner,
//   NotificationBadge,
// };

/**
 * Interactivos - Drag & Drop, Command Palette, etc.
 * TODO: Implementar componentes interactivos
 */
// export const Interactive = {
//   DraggableCard,
//   SwipeableCard,
//   CommandPalette,
//   DropZone,
//   SortableList,
//   ColorPicker,
//   SpotlightSearch,
// };

/**
 * Navegación - Menús, tabs, breadcrumbs
 * TODO: Implementar componentes de navegación
 */
// export const Navigation = {
//   LiquidTabBar,
//   PremiumBreadcrumbs,
//   FloatingActionButton,
//   MobileMenu,
//   AnimatedSidebar,
//   AnimatedDropdown,
// };

/**
 * Efectos - Fondos animados y efectos visuales
 * TODO: Implementar componentes de efectos
 */
// export const Effects = {
//   GradientMesh,
//   AuroraBackground,
//   BlobAnimations,
//   FloatingParticles,
//   LiquidCursor,
//   ParallaxLayer,
//   ShimmerWave,
//   GlowEffect,
//   GradientBorder,
//   StarField,
//   RainbowGradient,
// };

/**
 * Hooks - Custom hooks para animaciones (Ya exportados individualmente)
 * TODO: Verificar que todos existan en useAnimations
 */
// export const Hooks = {
//   // Cursor & Mouse
//   useMagneticCursor,
//   useMousePosition,
//   useHover,
//
//   // Scroll & Parallax
//   useParallax,
//   useScrollProgress,
//
//   // Morphing & Shapes
//   useMorphing,
//   use3DTilt,
//
//   // Effects
//   useRipple,
//   useFloating,
//   useGlassMorphism,
//   useElasticHover,
//   useAnimatedGradient,
//   useWaveAnimation,
//   useShimmer,
//   useParticles,
//
//   // Text & Content
//   useTypingAnimation,
//
//   // Layout & Lists
//   useStaggerChildren,
//   useIntersectionObserver,
//   useElementSize,
//
//   // Performance
//   usePrefersReducedMotion,
//   useDebounce,
//   useAnimationFrame,
//   usePerformanceMonitor,
//   useLazyLoad,
//   useMediaQuery,
// };

// ============================================
// DEFAULT EXPORT - Todo el sistema
// ============================================
// export default {
//   Microinteractions,
//   Charts,
//   Transitions,
//   Feedback,
//   Interactive,
//   Navigation,
//   Effects,
//   Hooks,
// };
