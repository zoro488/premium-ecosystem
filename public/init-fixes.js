// Suprimir errores conocidos de extensiones de navegador
(function () {
  'use strict';

  // Suprimir advertencias de APIs obsoletas (Components)
  if (typeof Components !== 'undefined') {
    try {
      delete window.Components;
    } catch (e) {
      // Ignorar si no se puede eliminar
    }
  }

  // Mejorar manejo de errores de extensiones
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = function (...args) {
    const errorString = args.join(' ');

    // Lista de errores a filtrar (relacionados con extensiones)
    const suppressPatterns = [
      'Promised response from onMessage listener went out of scope',
      'Extensions',
      'chrome.runtime',
      'browser.runtime',
      'Could not establish connection',
      'Extension context invalidated',
      'message port closed',
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

  // Manejar errores de WebSocket de forma más robusta
  window.addEventListener('error', function (event) {
    const errorMessage = event.message || '';

    if (
      errorMessage.includes('WebSocket') ||
      errorMessage.includes('ws://') ||
      errorMessage.includes('interrumpió')
    ) {
      // Suprimir errores de WebSocket durante carga inicial
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
})();
