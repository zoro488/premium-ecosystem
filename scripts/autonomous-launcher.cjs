#!/usr/bin/env node

/**
 * 🚀 CHRONOS AUTONOMOUS SYSTEM - LAUNCHER v2.0
 *
 * Script mejorado para iniciar el sistema autónomo con diferentes configuraciones
 */

const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  🚀 CHRONOS AUTONOMOUS SYSTEM - LAUNCHER v2.0             ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('Selecciona el modo de ejecución:\n');
console.log('1. 🚀 Modo Rápido (HTTP Simple - Recomendado)');
console.log('   → Verificación rápida con HTTP');
console.log('   → 10 intentos máximos');
console.log('   → Sin Puppeteer\n');

console.log('2. 🔍 Modo Completo (Puppeteer)');
console.log('   → Monitoreo con navegador real');
console.log('   → Captura de screenshots');
console.log('   → Detección de errores de consola\n');

console.log('3. 🤖 Modo Headless (Puppeteer sin ventana)');
console.log('   → Igual que Modo Completo');
console.log('   → Sin ventana de navegador visible\n');

rl.question('Elige una opción (1-3): ', (answer) => {
  rl.close();

  let env = {};

  switch (answer.trim()) {
    case '1':
      console.log('\n✨ Iniciando Modo Rápido (HTTP Simple)...\n');
      env = { USE_PUPPETEER: 'false' };
      break;

    case '2':
      console.log('\n✨ Iniciando Modo Completo (Puppeteer Visible)...\n');
      env = { USE_PUPPETEER: 'true', HEADLESS: 'false' };
      break;

    case '3':
      console.log('\n✨ Iniciando Modo Headless (Puppeteer Oculto)...\n');
      env = { USE_PUPPETEER: 'true', HEADLESS: 'true' };
      break;

    default:
      console.log('\n❌ Opción inválida. Usando Modo Rápido por defecto...\n');
      env = { USE_PUPPETEER: 'false' };
  }

  // Iniciar el sistema autónomo
  const child = spawn('node', ['scripts/chronos-autonomous-system.cjs'], {
    env: { ...process.env, ...env },
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    console.log(`\n\n Sistema autónomo finalizado con código: ${code}\n`);
    process.exit(code);
  });

  // Manejar Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Deteniendo sistema autónomo...\n');
    child.kill('SIGINT');
    process.exit(0);
  });
});
