/**
 * 🚀 Auto-Configuración de ZeroForce AI con Ollama
 * Este script configura automáticamente ZeroForce para usar Ollama
 */

// Función para auto-configurar ZeroForce
function autoConfigureZeroForce() {
  console.log('🧠 Iniciando auto-configuración de ZEROFORCE...');

  // Configuración optimizada para tus modelos
  const config = {
    host: 'http://localhost:11434',
    model: 'qwen2.5:32b', // Tu mejor modelo para español
    temperature: '0.7', // Equilibrio perfecto
    streaming: 'true', // Activar streaming
    voice: 'false', // Desactivado por defecto (activar manualmente si deseas)
    proactive: 'true', // Sugerencias proactivas
    multiagent: 'true', // Sistema multi-agente
    rag: 'true', // RAG activado
    autoopt: 'true', // Auto-optimización
  };

  // Guardar configuración en localStorage
  Object.entries(config).forEach(([key, value]) => {
    const storageKey = `zeroforce_${key}`;
    localStorage.setItem(storageKey, value);
    console.log(`✅ ${storageKey} = ${value}`);
  });

  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  ✅ ZEROFORCE CONFIGURADO AUTOMÁTICAMENTE          ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📋 CONFIGURACIÓN APLICADA:');
  console.log('   • Host: http://localhost:11434');
  console.log('   • Modelo: qwen2.5:32b (Mejor para español)');
  console.log('   • Streaming: Activado ✅');
  console.log('   • Temperatura: 0.7 (Equilibrado)');
  console.log('   • Modo Multi-Agente: Activado ✅');
  console.log('   • RAG: Activado ✅');
  console.log('');
  console.log('🎯 SIGUIENTE PASO:');
  console.log('   1. Busca el botón 🧠 (esquina inferior derecha)');
  console.log('   2. Haz clic para abrir ZeroForce');
  console.log('   3. ¡Empieza a chatear!');
  console.log('');
  console.log('💡 TIP: Puedes cambiar el modelo en ⚙️ Settings');
  console.log('   Modelos disponibles en tu sistema:');
  console.log('   • llama3.2:3b - ⚡ Ultra rápido');
  console.log('   • codellama:7b - 💻 Para código');
  console.log('   • qwen2.5:32b - 🌍 Mejor para español ⭐');
  console.log('   • llama3.1:70b - 💎 Máxima calidad');
  console.log('   • gpt-oss:120b - 🚀 Ultra premium');
  console.log('');

  // Retornar configuración para verificación
  return config;
}

// Función para verificar configuración actual
function verifyZeroForceConfig() {
  console.log('🔍 Verificando configuración actual...');
  console.log('');

  const keys = [
    'host',
    'model',
    'temp',
    'streaming',
    'voice',
    'proactive',
    'multiagent',
    'rag',
    'autoopt',
  ];
  const config = {};

  keys.forEach((key) => {
    const value = localStorage.getItem(`zeroforce_${key}`);
    config[key] = value;
    const icon = value ? '✅' : '❌';
    console.log(`${icon} zeroforce_${key}: ${value || 'No configurado'}`);
  });

  console.log('');
  return config;
}

// Función para resetear configuración
function resetZeroForceConfig() {
  console.log('🔄 Reseteando configuración de ZEROFORCE...');

  const keys = [
    'host',
    'model',
    'temp',
    'streaming',
    'voice',
    'proactive',
    'multiagent',
    'rag',
    'autoopt',
    'learning',
  ];
  keys.forEach((key) => {
    localStorage.removeItem(`zeroforce_${key}`);
  });

  console.log('✅ Configuración reseteada. Recarga la página para aplicar valores por defecto.');
}

// Función para probar conexión con Ollama
async function testOllamaConnection() {
  console.log('🔌 Probando conexión con Ollama...');

  try {
    const response = await fetch('http://localhost:11434/api/tags');

    if (!response.ok) {
      throw new Error('No se pudo conectar');
    }

    const data = await response.json();
    const models = data.models || [];

    console.log('');
    console.log('✅ Conexión exitosa con Ollama!');
    console.log('');
    console.log(`📦 Modelos disponibles (${models.length}):`);

    models.forEach((model, index) => {
      const size = (model.size / 1024 ** 3).toFixed(1);
      const modified = new Date(model.modified_at).toLocaleDateString();
      console.log(`   ${index + 1}. ${model.name} - ${size} GB (modificado: ${modified})`);
    });

    console.log('');
    return { success: true, models };
  } catch (error) {
    console.error('❌ Error conectando con Ollama:', error.message);
    console.log('');
    console.log('💡 SOLUCIONES:');
    console.log('   1. Verifica que Ollama esté corriendo:');
    console.log('      ollama serve');
    console.log('');
    console.log('   2. Verifica en tu navegador:');
    console.log('      http://localhost:11434');
    console.log('');
    return { success: false, error: error.message };
  }
}

// Función para chat de prueba
async function testZeroForceChat(message = 'Hola, ¿cómo estás?') {
  console.log('💬 Probando chat con ZeroForce...');
  console.log(`📝 Mensaje: "${message}"`);
  console.log('');

  const config = {
    host: localStorage.getItem('zeroforce_host') || 'http://localhost:11434',
    model: localStorage.getItem('zeroforce_model') || 'qwen2.5:32b',
  };

  try {
    const response = await fetch(`${config.host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        prompt: message,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 150,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('🤖 Respuesta de ZeroForce:');
    console.log('');
    console.log(data.response);
    console.log('');
    console.log('✅ Test exitoso!');

    return { success: true, response: data.response };
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    console.log('');
    console.log('💡 Verifica:');
    console.log('   1. Ollama está corriendo: ollama serve');
    console.log(`   2. El modelo existe: ollama list | grep ${config.model}`);
    console.log('');
    return { success: false, error: error.message };
  }
}

// Función principal para setup completo
async function setupZeroForceComplete() {
  console.clear();
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║      🚀 SETUP COMPLETO DE ZEROFORCE AI             ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');

  // 1. Configurar
  console.log('📝 PASO 1: Configurando ZeroForce...');
  autoConfigureZeroForce();

  // 2. Verificar conexión
  console.log('🔌 PASO 2: Verificando conexión con Ollama...');
  const connectionTest = await testOllamaConnection();

  if (!connectionTest.success) {
    console.log('');
    console.log('⚠️  Ollama no está accesible. Por favor inicia el servidor:');
    console.log('   ollama serve');
    return;
  }

  // 3. Test de chat
  console.log('💬 PASO 3: Probando chat...');
  await testZeroForceChat('Hola, ¿estás funcionando correctamente?');

  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║        ✅ SETUP COMPLETADO EXITOSAMENTE            ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('🎯 ¿QUÉ HACER AHORA?');
  console.log('');
  console.log('   1. Busca el botón flotante 🧠 en la esquina inferior derecha');
  console.log('   2. Haz clic para abrir ZeroForce');
  console.log('   3. ¡Empieza a chatear!');
  console.log('');
  console.log('📚 COMANDOS ÚTILES:');
  console.log('   • verifyZeroForceConfig() - Ver configuración actual');
  console.log('   • testOllamaConnection() - Probar conexión');
  console.log('   • testZeroForceChat("mensaje") - Probar chat');
  console.log('   • resetZeroForceConfig() - Resetear configuración');
  console.log('');
}

// Exportar funciones para uso en consola
if (typeof window !== 'undefined') {
  window.autoConfigureZeroForce = autoConfigureZeroForce;
  window.verifyZeroForceConfig = verifyZeroForceConfig;
  window.resetZeroForceConfig = resetZeroForceConfig;
  window.testOllamaConnection = testOllamaConnection;
  window.testZeroForceChat = testZeroForceChat;
  window.setupZeroForceComplete = setupZeroForceComplete;

  console.log('🎮 COMANDOS DE ZEROFORCE CARGADOS');
  console.log('');
  console.log('Para configurar automáticamente, ejecuta:');
  console.log('   setupZeroForceComplete()');
  console.log('');
}

// Auto-ejecutar si se carga directamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('');
    console.log('💡 ZeroForce Auto-Config listo. Ejecuta: setupZeroForceComplete()');
    console.log('');
  });
} else {
  console.log('');
  console.log('💡 ZeroForce Auto-Config listo. Ejecuta: setupZeroForceComplete()');
  console.log('');
}
