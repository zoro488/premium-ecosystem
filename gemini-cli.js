#!/usr/bin/env node
/**
 * ====================================
 * GEMINI CLI - HERRAMIENTA DE LÍNEA DE COMANDOS
 * ====================================
 * CLI potente para usar Gemini desde la terminal
 *
 * Uso:
 *   gemini ask "tu pregunta"
 *   gemini code "genera una función recursiva"
 *   gemini analyze archivo.js
 *   gemini chat
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { dirname } from 'path';
import * as readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Cargar API key desde .env
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
  console.error(`${colors.red}❌ Error: VITE_GEMINI_API_KEY no encontrada${colors.reset}`);
  console.error(`${colors.yellow}Configúrala en .env o como variable de entorno${colors.reset}`);
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Modelos disponibles (probando diferentes versiones)
const models = {
  balanced: genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' }),
  creative: genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 1.0,
      topK: 50,
      topP: 0.98,
    },
  }),
  precise: genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.3,
      topK: 20,
      topP: 0.85,
    },
  }),
  code: genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.2,
      topK: 10,
      topP: 0.8,
    },
  }),
  summary: genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 512,
    },
  }),
};

// Mostrar ayuda
function showHelp() {
  console.log(`
${colors.cyan}${colors.bright}🧠 GEMINI CLI - Herramienta de Línea de Comandos${colors.reset}
${colors.dim}${'='.repeat(60)}${colors.reset}

${colors.bright}USO:${colors.reset}
  ${colors.green}gemini ask${colors.reset} <pregunta>              Pregunta algo a Gemini
  ${colors.green}gemini code${colors.reset} <descripción>          Genera código
  ${colors.green}gemini analyze${colors.reset} <archivo>          Analiza un archivo
  ${colors.green}gemini explain${colors.reset} <archivo>          Explica un archivo
  ${colors.green}gemini fix${colors.reset} <archivo>              Sugiere mejoras
  ${colors.green}gemini translate${colors.reset} <texto>          Traduce texto
  ${colors.green}gemini summarize${colors.reset} <archivo|texto> Resume contenido
  ${colors.green}gemini chat${colors.reset}                        Chat interactivo
  ${colors.green}gemini help${colors.reset}                        Muestra esta ayuda

${colors.bright}OPCIONES:${colors.reset}
  ${colors.yellow}--model${colors.reset} <tipo>        Modelo: balanced, creative, precise, code
  ${colors.yellow}--output${colors.reset} <archivo>    Guarda respuesta en archivo
  ${colors.yellow}--stream${colors.reset}               Streaming de respuesta
  ${colors.yellow}--json${colors.reset}                 Output en formato JSON

${colors.bright}EJEMPLOS:${colors.reset}
  ${colors.dim}gemini ask "¿Cómo funciona async/await?"${colors.reset}
  ${colors.dim}gemini code "función para validar emails" --model code${colors.reset}
  ${colors.dim}gemini analyze src/App.jsx${colors.reset}
  ${colors.dim}gemini chat${colors.reset}

${colors.dim}${'='.repeat(60)}${colors.reset}
`);
}

// Spinner de carga
function showSpinner(message) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;

  return setInterval(() => {
    process.stdout.write(`\r${colors.cyan}${frames[i]} ${message}${colors.reset}`);
    i = (i + 1) % frames.length;
  }, 80);
}

// Generar respuesta
async function generate(prompt, modelType = 'balanced', options = {}) {
  const model = models[modelType] || models.balanced;
  const spinner = showSpinner('Pensando...');

  try {
    if (options.stream) {
      clearInterval(spinner);
      process.stdout.write('\r' + ' '.repeat(50) + '\r');

      const result = await model.generateContentStream(prompt);
      console.log(`${colors.magenta}${colors.bright}Gemini:${colors.reset}\n`);

      for await (const chunk of result.stream) {
        process.stdout.write(chunk.text());
      }
      console.log('\n');
    } else {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      clearInterval(spinner);
      process.stdout.write('\r' + ' '.repeat(50) + '\r');

      console.log(`${colors.magenta}${colors.bright}Gemini:${colors.reset}\n`);
      console.log(text);
      console.log('');

      return text;
    }
  } catch (error) {
    clearInterval(spinner);
    process.stdout.write('\r' + ' '.repeat(50) + '\r');
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Comando: ask
async function cmdAsk(question, options) {
  await generate(question, options.model, options);
}

// Comando: code
async function cmdCode(description, options) {
  const prompt = `Genera código limpio y bien documentado para: ${description}

Requisitos:
- Código funcional y probado
- Comentarios explicativos
- Buenas prácticas
- Manejo de errores

Responde solo con el código, sin explicaciones adicionales.`;

  await generate(prompt, 'code', options);
}

// Comando: analyze
async function cmdAnalyze(filePath, options) {
  if (!fs.existsSync(filePath)) {
    console.error(`${colors.red}❌ Archivo no encontrado: ${filePath}${colors.reset}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath);

  const prompt = `Analiza este archivo ${ext}:

\`\`\`${ext}
${content}
\`\`\`

Proporciona:
1. Resumen de funcionalidad
2. Calidad del código (1-10)
3. Posibles bugs o problemas
4. Sugerencias de mejora
5. Mejores prácticas no aplicadas`;

  await generate(prompt, 'precise', options);
}

// Comando: explain
async function cmdExplain(filePath, options) {
  if (!fs.existsSync(filePath)) {
    console.error(`${colors.red}❌ Archivo no encontrado: ${filePath}${colors.reset}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const prompt = `Explica de manera clara y detallada qué hace este código:

\`\`\`
${content}
\`\`\``;

  await generate(prompt, 'balanced', options);
}

// Comando: fix
async function cmdFix(filePath, options) {
  if (!fs.existsSync(filePath)) {
    console.error(`${colors.red}❌ Archivo no encontrado: ${filePath}${colors.reset}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const prompt = `Revisa este código y sugiere mejoras específicas:

\`\`\`
${content}
\`\`\`

Para cada problema encontrado, proporciona:
1. Descripción del problema
2. Por qué es un problema
3. Solución específica con código`;

  await generate(prompt, 'precise', options);
}

// Comando: translate
async function cmdTranslate(text, options) {
  const prompt = `Traduce al español de manera natural y profesional: ${text}`;
  await generate(prompt, 'balanced', options);
}

// Comando: summarize
async function cmdSummarize(input, options) {
  let content;

  if (fs.existsSync(input)) {
    content = fs.readFileSync(input, 'utf-8');
  } else {
    content = input;
  }

  const prompt = `Resume este contenido de manera concisa pero completa:\n\n${content}`;
  await generate(prompt, 'balanced', options);
}

// Comando: chat
async function cmdChat(options) {
  console.log(`${colors.cyan}${colors.bright}💬 Modo Chat Interactivo${colors.reset}`);
  console.log(
    `${colors.dim}Escribe 'exit' para salir, 'clear' para limpiar historial${colors.reset}\n`
  );

  const model = models[options.model] || models.balanced;
  const chat = model.startChat({
    history: [],
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = () => {
    rl.question(`${colors.green}Tú:${colors.reset} `, async (input) => {
      const message = input.trim();

      if (message.toLowerCase() === 'exit') {
        console.log(`${colors.cyan}👋 ¡Hasta luego!${colors.reset}`);
        rl.close();
        return;
      }

      if (message.toLowerCase() === 'clear') {
        console.clear();
        console.log(`${colors.yellow}🗑️  Historial limpiado${colors.reset}\n`);
        askQuestion();
        return;
      }

      if (!message) {
        askQuestion();
        return;
      }

      const spinner = showSpinner('Pensando...');

      try {
        const result = await chat.sendMessage(message);
        const text = result.response.text();

        clearInterval(spinner);
        process.stdout.write('\r' + ' '.repeat(50) + '\r');

        console.log(`${colors.magenta}Gemini:${colors.reset} ${text}\n`);
      } catch (error) {
        clearInterval(spinner);
        process.stdout.write('\r' + ' '.repeat(50) + '\r');
        console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}\n`);
      }

      askQuestion();
    });
  };

  askQuestion();
}

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }

  const command = args[0];
  const input = args
    .slice(1)
    .filter((arg) => !arg.startsWith('--'))
    .join(' ');

  // Parsear opciones
  const options = {
    model: 'balanced',
    output: null,
    stream: false,
    json: false,
  };

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--model' && args[i + 1]) {
      options.model = args[i + 1];
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    } else if (args[i] === '--stream') {
      options.stream = true;
    } else if (args[i] === '--json') {
      options.json = true;
    }
  }

  // Ejecutar comando
  switch (command) {
    case 'ask':
      await cmdAsk(input, options);
      break;
    case 'code':
      await cmdCode(input, options);
      break;
    case 'analyze':
      await cmdAnalyze(input, options);
      break;
    case 'explain':
      await cmdExplain(input, options);
      break;
    case 'fix':
      await cmdFix(input, options);
      break;
    case 'translate':
      await cmdTranslate(input, options);
      break;
    case 'summarize':
      await cmdSummarize(input, options);
      break;
    case 'chat':
      await cmdChat(options);
      break;
    default:
      console.error(`${colors.red}❌ Comando desconocido: ${command}${colors.reset}`);
      console.log(`${colors.yellow}Usa 'gemini help' para ver comandos disponibles${colors.reset}`);
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(`${colors.red}❌ Error fatal: ${error.message}${colors.reset}`);
  process.exit(1);
});
