import React from 'react';

import { AlertCircle, RefreshCw } from 'lucide-react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Extraer información serializable del error para evitar referencias circulares
    const safeError = {
      message: error?.message || 'Unknown error',
      stack: error?.stack || '',
      name: error?.name || 'Error',
    };

    const safeErrorInfo = {
      componentStack: errorInfo?.componentStack || '',
    };

    this.setState({
      error: safeError,
      errorInfo: safeErrorInfo,
    });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-red-400">Algo salió mal</h1>
                <p className="text-gray-400 text-sm">Lo sentimos, ocurrió un error inesperado</p>
              </div>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <p className="text-xs font-mono text-red-300 mb-2">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.errorInfo && this.state.errorInfo.componentStack && (
                  <details className="text-xs font-mono text-gray-400">
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-300">
                      Stack trace
                    </summary>
                    <pre className="mt-2 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Intentar de nuevo
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Si el problema persiste, intenta recargar la página
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
