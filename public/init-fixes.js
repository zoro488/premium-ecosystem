// Suprimir errores conocidos de extensiones de navegador
(function () {
  'use strict';

  // Suprimir advertencias de APIs obsoletas de Firefox (Components)
  if (typeof window.Components !== 'undefined') {
    try {
      window.Components = undefined;
      Object.defineProperty(window, 'Components', {
        get: function () {
          return undefined;
        },
        configurable: true,
      });
    } catch (e) {
      // Ignorar silenciosamente
    }
  }

  // Mejorar manejo de errores de extensiones
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = function (...args) {
    const errorString = args.join(' ');

    // Lista de errores a filtrar (relacionados con extensiones y APIs obsoletas)
    const suppressPatterns = [
      'Promised response from onMessage listener went out of scope',
      'Extensions',
      'chrome.runtime',
      'browser.runtime',
      'Could not establish connection',
      'Extension context invalidated',
      'message port closed',
      'Components es obsoleto',
      'Components is obsolete',
      'Components will be removed',
    ];

    // Si el error NO es de extensiones, mostrarlo normalmente
    const shouldSuppress = suppressPatterns.some((pattern) => errorString.includes(pattern));

    if (!shouldSuppress) {
      originalError.apply(console, args);
    }
  };

  console.warn = function (...args) {
    const warnString = args.join(' ');

    // Filtrar advertencias de Components obsoleto
    const suppressPatterns = [
      'Components es obsoleto',
      'Components is deprecated',
      'Components.utils',
      'Components.classes',
    ];

    const shouldSuppress = suppressPatterns.some((pattern) => warnString.includes(pattern));

    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };

  // Prevenir que el objeto Components cause problemas
  Object.defineProperty(window, 'Components', {
    get: function () {
      return undefined;
    },
    set: function () {
      // No hacer nada
    },
    configurable: false,
  });

  // Manejar errores de WebSocket y extensiones de forma robusta
  window.addEventListener('error', function (event) {
    const errorMessage = event.message || '';
    const errorSource = event.filename || '';

    // Suprimir errores de WebSocket durante carga inicial o reconexión
    if (
      errorMessage.includes('WebSocket') ||
      errorMessage.includes('ws://') ||
      errorMessage.includes('interrumpió') ||
      errorMessage.includes('failed to connect')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Suprimir errores de extensiones de navegador
    if (
      errorMessage.includes('Extension') ||
      errorMessage.includes('chrome-extension://') ||
      errorMessage.includes('moz-extension://') ||
      errorSource.includes('extension') ||
      errorMessage.includes('Promised response from onMessage')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Suprimir errores unhandled promise rejections de extensiones
  window.addEventListener('unhandledrejection', function (event) {
    const reason = event.reason || {};
    const message = reason.message || String(reason);

    if (
      message.includes('Extension') ||
      message.includes('onMessage') ||
      message.includes('chrome.runtime') ||
      message.includes('browser.runtime')
    ) {
      event.preventDefault();
      return false;
    }
  });
})();
