/**
 * 💎 SKELETON LOADER - PREMIUM COMPONENTS
 * ========================================
 * Loading states profesionales con animaciones suaves
 */
import { motion } from 'framer-motion';

// Skeleton base component
export const Skeleton = ({ className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50',
    card: 'bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-800/40 backdrop-blur-xl',
    text: 'bg-gradient-to-r from-slate-800/60 via-slate-700/60 to-slate-800/60',
    circle: 'bg-gradient-to-br from-slate-800/50 via-slate-700/50 to-slate-800/50 rounded-full',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`animate-pulse ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {[...Array(columns)].map((_, i) => (
        <Skeleton key={`header-${i}`} className="h-8 rounded-lg" variant="text" />
      ))}
    </div>

    {/* Rows */}
    {[...Array(rows)].map((_, rowIndex) => (
      <motion.div
        key={`row-${rowIndex}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: rowIndex * 0.05 }}
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {[...Array(columns)].map((_, colIndex) => (
          <Skeleton
            key={`cell-${rowIndex}-${colIndex}`}
            className="h-12 rounded-lg"
            variant="card"
          />
        ))}
      </motion.div>
    ))}
  </div>
);

// KPI Card Skeleton
export const KPICardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4"
  >
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-xl" variant="circle" />
      <Skeleton className="h-4 w-32 rounded" variant="text" />
    </div>
    <Skeleton className="h-8 w-40 rounded-lg" variant="text" />
    <Skeleton className="h-3 w-24 rounded" variant="text" />
  </motion.div>
);

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-gradient-to-br from-black/80 to-black/90 rounded-2xl p-8 border border-white/10 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded-xl" variant="text" />
          <Skeleton className="h-4 w-40 rounded" variant="text" />
        </div>
        <Skeleton className="w-32 h-32 rounded-2xl" variant="card" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
      </div>
    </motion.div>

    {/* Tabs */}
    <div className="flex gap-2 backdrop-blur-xl bg-white/5 p-2 rounded-xl border border-white/10">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="flex-1 h-12 rounded-lg" variant="card" />
      ))}
    </div>

    {/* Content */}
    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48 rounded-lg" variant="text" />
        <Skeleton className="h-10 w-40 rounded-lg" variant="card" />
      </div>
      <TableSkeleton rows={8} columns={4} />
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24 rounded" variant="text" />
        <Skeleton className="h-12 w-full rounded-lg" variant="card" />
      </div>
    ))}
    <div className="flex gap-3 pt-4">
      <Skeleton className="flex-1 h-12 rounded-lg" variant="card" />
      <Skeleton className="flex-1 h-12 rounded-lg" variant="card" />
    </div>
  </div>
);

export default Skeleton;
