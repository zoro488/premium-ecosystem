/**
 * 🎨 SHARED COMPONENTS INDEX
 *
 * Exportaciones centralizadas de todos los componentes compartidos
 * @version 2.0.0
 */

// Base animated components
export { AnimatedBackground } from './AnimatedBackground';
export { ExpandableSection } from './ExpandableSection';
export { PremiumLoadingScreen } from './PremiumLoadingScreen';

// Premium components (Pinterest-inspired)
export { AnimatedDataTable } from './AnimatedDataTable';
export { AnimatedStatCard } from './AnimatedStatCard';
export { FloatingActionButton } from './FloatingActionButton';
export { GlassmorphismCard } from './GlassmorphismCard';
export { InteractiveTooltip } from './InteractiveTooltip';
export {
    ParallaxCard, ParallaxImage, ParallaxSection, ParallaxText
} from './ParallaxSection';
export {
    SkeletonCardLayout, SkeletonLoader, SkeletonTableLayout
} from './SkeletonLoader';

// Re-export from ElegantComponents (from parent directory)
export { CreativeParticles, ScrollProgress } from '../ElegantComponents';
