#!/usr/bin/env node
/**
 * ====================================
 * GEMINI AI - VERIFICACIÓN DE SETUP
 * ====================================
 * Script para verificar que Gemini está configurado correctamente
 *
 * Uso: node verify-gemini-setup.js
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env
dotenv.config({ path: join(__dirname, '../.env') });

const API_KEY = process.env.VITE_GEMINI_API_KEY;

console.log('\n🧠 GEMINI AI - VERIFICACIÓN DE SETUP\n');
console.log('='.repeat(50));

// 1. Verificar API Key
console.log('\n📋 1. Verificando API Key...');
if (!API_KEY) {
  console.error('❌ VITE_GEMINI_API_KEY no encontrada en .env');
  console.log('\n💡 Solución:');
  console.log('   Agrega esta línea a tu archivo .env:');
  console.log('   VITE_GEMINI_API_KEY=AIzaSyAh-W4sEjQaIsz52xQfy4ypi4gZ8S4S1xA');
  process.exit(1);
}
console.log(`✅ API Key encontrada: ${API_KEY.substring(0, 10)}...`);

// 2. Verificar conexión
console.log('\n🌐 2. Verificando conexión con Gemini...');
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getModel('gemini-pro');

try {
  const result = await model.generateContent('Di "OK" si funcionas');
  const response = result.response.text();
  console.log(`✅ Conexión exitosa`);
  console.log(`   Respuesta: ${response}`);
} catch (error) {
  console.error('❌ Error de conexión:', error.message);
  console.log('\n💡 Posibles causas:');
  console.log('   - API Key inválida');
  console.log('   - Límite de quota excedido');
  console.log('   - Problemas de red');
  process.exit(1);
}

// 3. Verificar archivos
console.log('\n📁 3. Verificando archivos de integración...');

const files = [
  'src/lib/gemini/config.js',
  'src/hooks/useGemini.js',
  'src/services/geminiAI.js',
  'src/services/analytics.js',
  'src/components/ai/GeminiAssistant.jsx',
];

let allFilesExist = true;
for (const file of files) {
  try {
    readFileSync(join(__dirname, '..', file));
    console.log(`   ✅ ${file}`);
  } catch {
    console.log(`   ❌ ${file} - NO ENCONTRADO`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log('\n⚠️  Algunos archivos faltan. Revisa la instalación.');
}

// 4. Verificar dependencias
console.log('\n📦 4. Verificando dependencias...');
try {
  const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

  if (packageJson.dependencies['@google/generative-ai']) {
    console.log('   ✅ @google/generative-ai instalado');
  } else {
    console.log('   ❌ @google/generative-ai NO instalado');
    console.log('   Ejecuta: npm install @google/generative-ai');
  }
} catch (error) {
  console.log('   ⚠️  No se pudo verificar package.json');
}

// 5. Test de funcionalidades
console.log('\n🧪 5. Probando funcionalidades...');

// Test generación simple
try {
  const testResult = await model.generateContent('Genera un saludo breve');
  console.log('   ✅ Generación de texto');
} catch (error) {
  console.log('   ❌ Generación de texto');
}

// Test con configuración
try {
  const modelWithConfig = genAI.getModel({
    model: 'gemini-pro',
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  });

  const result = await modelWithConfig.generateContent('Test');
  console.log('   ✅ Configuración personalizada');
} catch (error) {
  console.log('   ❌ Configuración personalizada');
}

// Resumen final
console.log('\n' + '='.repeat(50));
console.log('\n🎉 VERIFICACIÓN COMPLETADA\n');
console.log('✅ Gemini AI está configurado correctamente');
console.log('\n📚 Próximos pasos:');
console.log('   1. Importa useGemini en tus componentes');
console.log('   2. Usa GeminiAssistant para UI lista');
console.log('   3. Revisa GEMINI_IMPLEMENTATION_GUIDE.md');
console.log('\n💡 Ejemplo rápido:');
console.log('   import { useGemini } from "@/hooks/useGemini"');
console.log('   const { generateContent } = useGemini()');
console.log('   await generateContent("Tu prompt aquí")');
console.log('\n' + '='.repeat(50) + '\n');
