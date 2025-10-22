/**
 * 🚀 FLOWDISTRIBUTOR PREMIUM COMPONENTS
 * Componentes épicos con animaciones y efectos avanzados
 * Optimizados para rendimiento y experiencia de usuario premium
 */

// 🎨 Fondos y efectos visuales
export {
  AnimatedBackground,
  CursorGlow,
  FloatingElements,
} from './AnimatedBackground';

// 💎 Cards y contenedores glassmorphism
export {
  GlassCard,
  StatCard,
  MetricCard,
} from './GlassCard';

// 🎬 Transiciones y animaciones
export {
  PageTransition,
  FadeSlide,
  StaggerContainer,
  StaggerItem,
  ScaleFade,
  RotateFade,
  FlipCard,
  HoverLift,
  PulseGlow,
  WaveEffect,
  MorphShape,
  SlideReveal,
} from './AnimatedTransitions';

// 🎭 Modales y overlays
export {
  PremiumModal,
  Drawer,
  Tooltip,
  Popover,
} from './PremiumModal';

// ⏳ Loading y skeleton states
export {
  PremiumLoader,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
  LoadingOverlay,
  ProgressBar,
  ShimmerEffect,
} from './PremiumLoading';

// 📊 Tablas virtualizadas
export { VirtualizedTable } from './VirtualizedTable';

/**
 * 🎯 GUÍA DE USO RÁPIDO
 *
 * ANIMACIONES DE FONDO:
 * <AnimatedBackground variant="particles" />
 * <CursorGlow />
 * <FloatingElements />
 *
 * CARDS PREMIUM:
 * <GlassCard variant="primary" hover glow>
 *   <StatCard title="Capital" value="$1M" icon={DollarSign} trend="up" />
 * </GlassCard>
 *
 * TRANSICIONES:
 * <PageTransition>
 *   <StaggerContainer>
 *     <StaggerItem>Contenido 1</StaggerItem>
 *     <StaggerItem>Contenido 2</StaggerItem>
 *   </StaggerContainer>
 * </PageTransition>
 *
 * MODALES:
 * <PremiumModal isOpen={true} title="Título" size="lg" variant="glass">
 *   Contenido del modal
 * </PremiumModal>
 *
 * LOADING STATES:
 * <LoadingOverlay message="Procesando..." />
 * <SkeletonCard lines={3} showImage />
 * <PremiumLoader variant="spinner" size="lg" />
 *
 * TABLAS:
 * <VirtualizedTable
 *   data={datos}
 *   columns={columnas}
 *   sortable
 *   searchable
 * />
 */
