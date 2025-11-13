#!/usr/bin/env node
/**
 * Script para listar modelos disponibles de Gemini
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar API key
const envPath = path.join(__dirname, '.env');
let API_KEY;

try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
  API_KEY = match ? match[1].trim() : null;
} catch {
  API_KEY = process.env.VITE_GEMINI_API_KEY;
}

if (!API_KEY) {
  console.error('❌ Error: VITE_GEMINI_API_KEY no encontrada');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

console.log('🔍 Listando modelos disponibles de Gemini...\n');

try {
  const models = await genAI.listModels();

  console.log(`✅ Total de modelos: ${models.length}\n`);

  models.forEach((model, index) => {
    console.log(`${index + 1}. ${model.name}`);
    console.log(`   Display Name: ${model.displayName}`);
    console.log(`   Description: ${model.description || 'N/A'}`);

    if (model.supportedGenerationMethods) {
      console.log(`   Métodos: ${model.supportedGenerationMethods.join(', ')}`);
    }

    console.log('');
  });
} catch (error) {
  console.error('❌ Error:', error.message);
}
