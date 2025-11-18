const ChartsLoading = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="glass rounded-2xl p-6 border border-white/10">
          {/* Header Skeleton */}
          <div className="h-6 bg-gray-300/20 rounded-lg mb-4 animate-pulse"></div>

          {/* Chart Container Skeleton */}
          <div className="h-[300px] bg-gray-300/10 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-sm text-gray-400">Cargando gráfico...</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartsLoading;
