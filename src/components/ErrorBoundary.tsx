/**
 * Error Boundary Component
 * Captura errores de JavaScript en cualquier parte del árbol de componentes hijo
 * y muestra una UI de fallback en lugar de crashear toda la aplicación
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary - Captura y maneja errores en componentes React
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MiComponente />
 * </ErrorBoundary>
 * ```
 *
 * @example Con fallback personalizado
 * ```tsx
 * <ErrorBoundary fallback={<div>Error personalizado</div>}>
 *   <MiComponente />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Actualizar estado para que el siguiente render muestre el fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Registrar el error en servicio de logging (ej: Sentry, LogRocket)
    console.error('❌ ErrorBoundary capturó un error:', error, errorInfo);

    this.setState({
      errorInfo,
    });

    // Callback opcional para logging externo
    this.props.onError?.(error, errorInfo);

    // TODO: Integrar con Sentry
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    // }
  }

  componentDidUpdate(prevProps: Props): void {
    // Reset error si resetKeys cambian
    if (this.state.hasError && this.props.resetKeys) {
      const prevKeys = prevProps.resetKeys || [];
      const currentKeys = this.props.resetKeys || [];

      const keysChanged = currentKeys.some((key, i) => key !== prevKeys[i]);

      if (keysChanged) {
        this.reset();
      }
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Si se proporcionó un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de error por defecto - profesional y user-friendly
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-700 via-orange-50 to-yellow-50 px-4 py-8">
          <div className="w-full max-w-2xl">
            <div className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-900/5">
              {/* Header */}
              <div className="mb-6 flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="rounded-full bg-red-100 p-3">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    ¡Oops! Algo salió mal
                  </h2>
                  <p className="mt-2 text-gray-600">
                    La aplicación encontró un error inesperado. No te preocupes, tus datos están
                    seguros.
                  </p>
                </div>
              </div>

              {/* Error Details (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 overflow-hidden rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 font-mono text-sm font-semibold text-gray-700">
                    Detalles del Error (solo en desarrollo):
                  </h3>
                  <pre className="overflow-x-auto text-xs text-red-600">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-medium text-gray-600 hover:text-gray-900">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 overflow-x-auto text-xs text-gray-600">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={this.reset}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Intentar de Nuevo
                </button>

                <button
                  onClick={() => (window.location.href = '/')}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 text-gray-700 transition-all hover:bg-gray-200 hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <Home className="h-5 w-5" />
                  Ir al Inicio
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-all hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Recargar Página
                </button>
              </div>

              {/* Help Text */}
              <p className="mt-6 text-center text-sm text-gray-500">
                Si el problema persiste, por favor contacta al soporte técnico.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Componente de Error Fallback simple para paneles
 */
interface PanelErrorFallbackProps {
  panelName: string;
  error?: Error;
  resetError?: () => void;
}

export const PanelErrorFallback: React.FC<PanelErrorFallbackProps> = ({
  panelName,
  error,
  resetError,
}) => {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg bg-red-50 p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>

        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Error en {panelName}
        </h3>

        <p className="mb-4 text-sm text-gray-600">
          No se pudo cargar este panel. Por favor, intenta recargar.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <pre className="mb-4 overflow-auto rounded bg-gray-100 p-2 text-left text-xs text-red-600">
            {error.toString()}
          </pre>
        )}

        {resetError && (
          <button
            onClick={resetError}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;
