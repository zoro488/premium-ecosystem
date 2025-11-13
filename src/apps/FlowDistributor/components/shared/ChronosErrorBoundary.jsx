import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import logger, { LOG_CATEGORY } from '../utils/logger';

/**
 * 🎯 CHRONOS ERROR BOUNDARY - Manejo elegante de errores
 * Captura errores de React y muestra UI de recuperación
 */
class ChronosErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const { errorCount } = this.state;

    // Log del error
    logger.error(
      'React Error Boundary caught error',
      {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        errorCount: errorCount + 1
      },
      LOG_CATEGORY.UI
    );

    // Actualizar estado
    this.setState({
      error,
      errorInfo,
      errorCount: errorCount + 1
    });

    // Enviar a servicio de monitoreo si está configurado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    if (this.props.onGoHome) {
      this.props.onGoHome();
    } else {
      globalThis.location.href = '/';
    }
  };

  render() {
    const { hasError, error, errorInfo, errorCount } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }

    // Usar fallback custom si se provee
    if (fallback) {
      return fallback({ error, errorInfo, onReset: this.handleReset });
    }

    // Render CHRONOS error UI
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          {/* Error Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-light text-white text-center mb-4"
            >
              Algo salió mal
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-center mb-8 font-light"
            >
              {errorCount > 3
                ? 'Este componente ha fallado múltiples veces. Por favor contacta soporte.'
                : 'Un error inesperado ocurrió en el componente. Puedes intentar recargar o volver al inicio.'}
            </motion.p>

            {/* Error details (solo en desarrollo) */}
            {import.meta.env.DEV && error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.5 }}
                className="mb-6 p-4 bg-black/40 rounded-lg border border-red-500/20 overflow-hidden"
              >
                <p className="text-red-400 font-mono text-xs mb-2 font-semibold">
                  Error: {error.toString()}
                </p>
                {errorInfo && errorInfo.componentStack && (
                  <details className="mt-2">
                    <summary className="text-gray-500 text-xs cursor-pointer hover:text-gray-400">
                      Component Stack
                    </summary>
                    <pre className="text-gray-500 font-mono text-[10px] mt-2 overflow-auto max-h-40 whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4"
            >
              {/* Retry Button */}
              <button
                onClick={this.handleReset}
                disabled={errorCount > 3}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-light transition-all ${
                  errorCount > 3
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Intentar de nuevo</span>
              </button>

              {/* Home Button */}
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-light bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
              >
                <Home className="w-5 h-5" />
                <span>Ir al inicio</span>
              </button>
            </motion.div>

            {/* Error count indicator */}
            {errorCount > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4 text-center text-xs text-gray-500"
              >
                Este error ha ocurrido {errorCount} {errorCount === 1 ? 'vez' : 'veces'}
              </motion.div>
            )}
          </div>

          {/* Support info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-sm text-gray-600 font-light"
          >
            Si el problema persiste, contacta soporte técnico
          </motion.div>
        </motion.div>
      </div>
    );
  }
}

// PropTypes
ChronosErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onError: PropTypes.func,
  onReset: PropTypes.func,
  onGoHome: PropTypes.func,
  fallback: PropTypes.func
};

// PropTypes
ChronosErrorBoundary.defaultProps = {
  onError: null,
  onReset: null,
  onGoHome: null,
  fallback: null
};

export default ChronosErrorBoundary;
