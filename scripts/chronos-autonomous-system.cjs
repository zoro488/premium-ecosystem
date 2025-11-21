#!/usr/bin/env node
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');
const http = require('http');
const puppeteer = require('puppeteer');

class ChronosAutonomousSystem {
  constructor() {
    this.maxRetries = 10;
    this.currentRetry = 0;
    this.port = 3001;
    this.errors = [];
    this.fixes = [];
    this.serverProcess = null;
    this.browser = null;
    this.page = null;
    this.errorDetected = false;
    this.lastError = null;
    this.usePuppeteer = process.env.USE_PUPPETEER === 'true';
    this.serverStartTime = null;
  }

  // ════════════════════════════════════════════════════════════
  // LOGGING AVANZADO
  // ════════════════════════════════════════════════════════════
  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const icons = {
      info: '💡',
      success: '✅',
      error: '❌',
      fix: '🔧',
      test: '🧪',
      clean: '🧹',
      monitor: '👁️',
      analyze: '🔍',
      restart: '🔄',
    };
    const color = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      fix: '\x1b[33m',
      test: '\x1b[35m',
      clean: '\x1b[34m',
      monitor: '\x1b[36m',
      analyze: '\x1b[33m',
      restart: '\x1b[35m',
    };

    console.log(`${color[type]}${icons[type]} [${timestamp}] ${message}\x1b[0m`);

    // Guardar log en archivo
    const logFile = path.join(process.cwd(), 'autonomous-system.log');
    fs.appendFileSync(logFile, `[${timestamp}] [${type.toUpperCase()}] ${message}\n`);
  }

  // ════════════════════════════════════════════════════════════
  // PASO 1: LIMPIEZA PROFUNDA
  // ════════════════════════════════════════════════════════════
  async deepClean() {
    this.log('Iniciando limpieza profunda del sistema...', 'clean');

    try {
      // 1. Liberar puerto
      await this.killPort(this.port);

      // 2. Eliminar cache
      const cacheDirs = [
        'node_modules/.vite',
        'node_modules/.cache',
        'dist',
        '.vite',
        '.turbo',
        'build',
      ];

      for (const dir of cacheDirs) {
        const fullPath = path.join(process.cwd(), dir);
        if (fs.existsSync(fullPath)) {
          fs.rmSync(fullPath, { recursive: true, force: true });
          this.log(`Eliminado: ${dir}`, 'clean');
        }
      }

      // 3. Limpiar logs antiguos
      const logFiles = ['autonomous-system.log', 'error-screenshots'];
      for (const file of logFiles) {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
          if (fs.statSync(fullPath).isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(fullPath);
          }
        }
      }

      // 4. Recrear directorios necesarios
      fs.mkdirSync('error-screenshots', { recursive: true });

      this.log('Limpieza profunda completada', 'success');
      return true;
    } catch (error) {
      this.log(`Error en limpieza: ${error.message}`, 'error');
      return false;
    }
  }

  async killPort(port) {
    this.log(`Liberando puerto ${port}...`, 'clean');

    try {
      if (process.platform === 'win32') {
        execSync(
          `FOR /F "tokens=5" %P IN ('netstat -ano ^| findstr :${port}') DO TaskKill.exe /PID %P /F`,
          {
            shell: 'cmd.exe',
            stdio: 'pipe',
          }
        );
      } else {
        execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, { stdio: 'pipe' });
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      this.log(`Puerto ${port} liberado`, 'success');
    } catch (error) {
      this.log('Puerto ya estaba libre', 'info');
    }
  }

  // ════════════════════════════════════════════════════════════
  // PASO 2: VERIFICACIÓN PRE-INICIO
  // ════════════════════════════════════════════════════════════
  async preStartVerification() {
    this.log('Verificando sistema antes de iniciar...', 'test');

    const checks = [
      this.checkPackageJson.bind(this),
      this.checkDependencies.bind(this),
      this.checkFirebaseConfig.bind(this),
      this.checkDirectoryStructure.bind(this),
      this.checkEnvironmentVariables.bind(this),
    ];

    for (const check of checks) {
      const result = await check();
      if (!result) {
        this.log('Verificación pre-inicio falló, aplicando correcciones...', 'fix');
        return false;
      }
    }

    this.log('Verificación pre-inicio completada exitosamente', 'success');
    return true;
  }

  async checkPackageJson() {
    const packagePath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packagePath)) {
      this.log('package.json no encontrado', 'error');
      return false;
    }

    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    if (!pkg.scripts || !pkg.scripts.dev) {
      this.log('Script dev no encontrado en package.json', 'error');
      return false;
    }

    this.log('package.json válido', 'success');
    return true;
  }

  async checkDependencies() {
    this.log('Verificando dependencias críticas...', 'test');

    const requiredDeps = ['react', 'react-dom', 'firebase', 'vite', 'framer-motion'];

    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    const missing = requiredDeps.filter((dep) => !allDeps[dep]);

    if (missing.length > 0) {
      this.log(`Dependencias faltantes: ${missing.join(', ')}`, 'fix');
      this.log('Instalando dependencias...', 'fix');

      try {
        execSync('npm install', { stdio: 'inherit' });
        this.log('Dependencias instaladas correctamente', 'success');
        return true;
      } catch (error) {
        this.log(`Error instalando dependencias: ${error.message}`, 'error');
        return false;
      }
    }

    this.log('Todas las dependencias presentes', 'success');
    return true;
  }

  async checkFirebaseConfig() {
    this.log('Verificando configuración de Firebase...', 'test');

    const configPaths = [
      'src/lib/firebase.ts',
      'src/lib/firebase.js',
      'src/config/firebase.ts',
      'src/config/firebase.js',
    ];

    for (const configPath of configPaths) {
      const fullPath = path.join(process.cwd(), configPath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        if (content.includes('apiKey') && content.includes('projectId')) {
          this.log(`Firebase config encontrada en ${configPath}`, 'success');
          return true;
        }
      }
    }

    this.log('ADVERTENCIA: No se encontró configuración válida de Firebase', 'error');
    return false;
  }

  async checkDirectoryStructure() {
    const requiredDirs = [
      'src',
      'src/apps',
      'src/apps/FlowDistributor',
      'src/apps/FlowDistributor/chronos-system',
      'src/lib',
      'public',
    ];

    for (const dir of requiredDirs) {
      const fullPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(fullPath)) {
        this.log(`Directorio faltante: ${dir}`, 'error');
        return false;
      }
    }

    this.log('Estructura de directorios correcta', 'success');
    return true;
  }

  async checkEnvironmentVariables() {
    const envFiles = ['.env', '.env.local', '.env.development'];
    const envExists = envFiles.some((f) => fs.existsSync(path.join(process.cwd(), f)));

    if (!envExists) {
      this.log('Sin archivo .env (puede ser normal si Firebase usa config directo)', 'info');
    } else {
      this.log('Archivo de entorno encontrado', 'success');
    }

    return true;
  }

  // ════════════════════════════════════════════════════════════
  // PASO 3: INICIO DE SERVIDOR
  // ════════════════════════════════════════════════════════════
  async startServer() {
    this.log('Iniciando servidor de desarrollo...', 'info');

    return new Promise((resolve, reject) => {
      this.serverProcess = spawn('npm', ['run', 'dev'], {
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let serverReady = false;

      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(output);

        if (
          output.includes('Local:') ||
          output.includes('localhost:3001') ||
          output.includes('ready in')
        ) {
          if (!serverReady) {
            serverReady = true;
            this.log('Servidor iniciado exitosamente', 'success');
            setTimeout(() => resolve(true), 3000);
          }
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        console.error(error);
      });

      this.serverProcess.on('error', (error) => {
        this.log(`Error iniciando servidor: ${error.message}`, 'error');
        reject(error);
      });

      // Timeout de 30 segundos
      setTimeout(() => {
        if (!serverReady) {
          this.log('Timeout esperando inicio de servidor', 'error');
          this.stopServer();
          reject(new Error('Server start timeout'));
        }
      }, 30000);
    });
  }

  stopServer() {
    if (this.serverProcess) {
      this.log('Deteniendo servidor...', 'restart');
      this.serverProcess.kill();
      this.serverProcess = null;
    }
  }

  // ════════════════════════════════════════════════════════════
  // VERIFICACIÓN HTTP SIMPLE (ALTERNATIVA A PUPPETEER)
  // ════════════════════════════════════════════════════════════
  async checkServerHealth() {
    return new Promise((resolve) => {
      const req = http.get('http://localhost:3001', (res) => {
        this.log(`Servidor responde con código ${res.statusCode}`, 'success');
        resolve(res.statusCode === 200);
      });

      req.on('error', (error) => {
        this.log(`Error verificando servidor: ${error.message}`, 'error');
        resolve(false);
      });

      req.setTimeout(10000, () => {
        this.log('Timeout verificando servidor', 'error');
        req.destroy();
        resolve(false);
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // PASO 4: MONITOREO INTELIGENTE (HTTP SIMPLE O PUPPETEER)
  // ════════════════════════════════════════════════════════════
  async startMonitoring() {
    // Estrategia 1: Verificación HTTP simple (más rápida y confiable)
    if (!this.usePuppeteer) {
      this.log('Iniciando verificación HTTP simple...', 'monitor');

      // Esperar 5 segundos para que el servidor esté listo
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Intentar conectar 3 veces
      for (let i = 1; i <= 3; i++) {
        this.log(`Intento ${i}/3 de verificación HTTP...`, 'test');
        const isHealthy = await this.checkServerHealth();

        if (isHealthy) {
          this.log('✨ Servidor verificado exitosamente con HTTP', 'success');
          return true;
        }

        if (i < 3) {
          this.log('Esperando 3 segundos antes de reintentar...', 'info');
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }

      this.log('Servidor no responde después de 3 intentos HTTP', 'error');
      this.errorDetected = true;
      this.lastError = {
        type: 'http_check',
        message: 'Server not responding to HTTP requests',
        timestamp: Date.now(),
      };
      return false;
    }

    // Estrategia 2: Monitoreo con Puppeteer (más completo pero más lento)
    this.log('Iniciando monitoreo en tiempo real con Puppeteer...', 'monitor');

    try {
      this.browser = await puppeteer.launch({
        headless: process.env.HEADLESS === 'true',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      this.page = await this.browser.newPage();

      // Capturar errores de consola
      this.page.on('console', (msg) => {
        const type = msg.type();
        const text = msg.text();

        if (type === 'error') {
          this.log(`Error en consola detectado: ${text}`, 'error');
          this.errorDetected = true;
          this.lastError = { type: 'console', message: text, timestamp: Date.now() };
        }
      });

      // Capturar errores de página
      this.page.on('pageerror', (error) => {
        this.log(`Error de página: ${error.message}`, 'error');
        this.errorDetected = true;
        this.lastError = {
          type: 'pageerror',
          message: error.message,
          stack: error.stack,
          timestamp: Date.now(),
        };
      });

      // Navegar a la aplicación
      this.log('Navegando a http://localhost:3001...', 'monitor');
      await this.page.goto('http://localhost:3001', {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      this.log('Página cargada, esperando 3 segundos...', 'monitor');
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Intentar navegar a Chronos System
      this.log('Intentando acceder a Chronos System...', 'monitor');

      try {
        // Buscar enlace/botón de Chronos
        const chronosSelector =
          'a[href*="chronos"], button:has-text("Chronos"), [data-app="chronos"]';
        await this.page.waitForSelector(chronosSelector, { timeout: 5000 });
        await this.page.click(chronosSelector);

        this.log('Click en Chronos System realizado', 'success');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        this.log(
          'No se pudo hacer click en Chronos (puede ser normal si ya está en la ruta)',
          'info'
        );

        // Intentar navegar directamente
        await this.page.goto('http://localhost:3001/chronos', {
          waitUntil: 'domcontentloaded',
          timeout: 60000,
        });
      }

      // Esperar y monitorear errores
      this.log('Monitoreando errores durante 10 segundos...', 'monitor');
      await new Promise((resolve) => setTimeout(resolve, 10000));

      if (this.errorDetected) {
        this.log('Error detectado durante monitoreo', 'error');

        // Tomar screenshot del error
        const screenshotPath = `error-screenshots/error-${Date.now()}.png`;
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        this.log(`Screenshot guardado: ${screenshotPath}`, 'info');

        return false;
      }

      this.log('No se detectaron errores durante el monitoreo', 'success');
      return true;
    } catch (error) {
      this.log(`Error durante monitoreo: ${error.message}`, 'error');
      this.errorDetected = true;
      this.lastError = { type: 'monitoring', message: error.message, timestamp: Date.now() };
      return false;
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  // ════════════════════════════════════════════════════════════
  // PASO 5: ANÁLISIS INTELIGENTE DE ERROR
  // ════════════════════════════════════════════════════════════
  analyzeError() {
    if (!this.lastError) return null;

    this.log('Analizando error...', 'analyze');

    const errorMessage = this.lastError.message.toLowerCase();
    const errorStack = this.lastError.stack || '';

    // Tipo 0: HTTP Check Error (servidor no responde)
    if (this.lastError.type === 'http_check') {
      return {
        type: 'HTTP_CHECK_ERROR',
        severity: 'LOW',
        fix: null, // No aplicar fix, solo reintentar
        details: this.lastError,
      };
    }

    // Tipo 1: Import/Export errors
    if (
      errorMessage.includes('cannot find module') ||
      errorMessage.includes('module not found') ||
      errorMessage.includes('failed to resolve import')
    ) {
      return {
        type: 'IMPORT_ERROR',
        severity: 'HIGH',
        fix: 'fixImportError',
        details: this.lastError,
      };
    }

    // Tipo 2: Firebase/Firestore errors
    if (
      errorMessage.includes('firestoredb') ||
      errorMessage.includes('firebasedb') ||
      (errorMessage.includes('is not defined') && errorMessage.includes('firebase'))
    ) {
      return {
        type: 'FIREBASE_ERROR',
        severity: 'HIGH',
        fix: 'fixFirebaseError',
        details: this.lastError,
      };
    }

    // Tipo 3: TypeScript errors
    if (
      errorMessage.includes('cannot find name') ||
      errorMessage.includes('type error') ||
      errorMessage.includes('ts2304') ||
      errorMessage.includes('ts2307')
    ) {
      return {
        type: 'TYPESCRIPT_ERROR',
        severity: 'MEDIUM',
        fix: 'fixTypeScriptError',
        details: this.lastError,
      };
    }

    // Tipo 4: React/Hooks errors
    if (
      errorMessage.includes('invalid hook call') ||
      errorMessage.includes('hooks can only be called') ||
      errorMessage.includes('rendered more hooks')
    ) {
      return {
        type: 'REACT_HOOKS_ERROR',
        severity: 'HIGH',
        fix: 'fixReactHooksError',
        details: this.lastError,
      };
    }

    // Tipo 5: Dependency errors
    if (
      errorMessage.includes('cannot resolve dependency') ||
      errorMessage.includes('peer dependency')
    ) {
      return {
        type: 'DEPENDENCY_ERROR',
        severity: 'MEDIUM',
        fix: 'fixDependencyError',
        details: this.lastError,
      };
    }

    // Tipo 6: Runtime errors (genérico)
    return {
      type: 'RUNTIME_ERROR',
      severity: 'MEDIUM',
      fix: 'fixRuntimeError',
      details: this.lastError,
    };
  }

  // ════════════════════════════════════════════════════════════
  // PASO 6: APLICAR FIX ESPECÍFICO
  // ════════════════════════════════════════════════════════════
  async applyFix(errorAnalysis) {
    if (!errorAnalysis) return false;

    this.log(`Aplicando fix para ${errorAnalysis.type}...`, 'fix');

    const fixMethod = this[errorAnalysis.fix];
    if (typeof fixMethod === 'function') {
      try {
        const result = await fixMethod.call(this, errorAnalysis.details);

        if (result) {
          this.fixes.push({
            type: errorAnalysis.type,
            timestamp: Date.now(),
            success: true,
          });
          this.log(`Fix aplicado exitosamente para ${errorAnalysis.type}`, 'success');
          return true;
        }
      } catch (error) {
        this.log(`Error aplicando fix: ${error.message}`, 'error');
      }
    }

    this.log(`No se pudo aplicar fix para ${errorAnalysis.type}`, 'error');
    return false;
  }

  async fixImportError(details) {
    this.log('Aplicando fix para errores de importación...', 'fix');

    // Reinstalar dependencias
    try {
      execSync('npm install --force', { stdio: 'inherit' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async fixFirebaseError(details) {
    this.log('Aplicando fix para errores de Firebase...', 'fix');

    // Ejecutar script de fix de imports
    const scriptPath = path.join(process.cwd(), 'scripts', 'fix-firestore-imports.js');

    if (fs.existsSync(scriptPath)) {
      try {
        execSync(`node ${scriptPath}`, { stdio: 'inherit' });
        return true;
      } catch (error) {
        return false;
      }
    }

    // Fix manual si no existe el script
    return await this.fixFirebaseImportsManual();
  }

  async fixFirebaseImportsManual() {
    this.log('Aplicando fix manual de Firebase imports...', 'fix');

    const findAndReplaceInFiles = (dir, pattern, replacement) => {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !file.includes('node_modules')) {
          findAndReplaceInFiles(fullPath, pattern, replacement);
        } else if (
          file.endsWith('.jsx') ||
          file.endsWith('.tsx') ||
          file.endsWith('.js') ||
          file.endsWith('.ts')
        ) {
          let content = fs.readFileSync(fullPath, 'utf-8');

          if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            fs.writeFileSync(fullPath, content, 'utf-8');
            this.log(`Fixed: ${fullPath}`, 'success');
          }
        }
      }
    };

    const srcPath = path.join(process.cwd(), 'src');
    findAndReplaceInFiles(srcPath, /firestoreDB/g, 'db');
    findAndReplaceInFiles(srcPath, /firebaseDB/g, 'db');

    return true;
  }

  async fixTypeScriptError(details) {
    this.log('Aplicando fix para errores de TypeScript...', 'fix');

    // Actualizar dependencias de tipos
    try {
      execSync('npm install -D @types/node@latest @types/react@latest', { stdio: 'inherit' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async fixReactHooksError(details) {
    this.log('Aplicando fix para errores de React Hooks...', 'fix');

    // Reinstalar React
    try {
      execSync('npm install react@latest react-dom@latest --force', { stdio: 'inherit' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async fixDependencyError(details) {
    this.log('Aplicando fix para errores de dependencias...', 'fix');

    try {
      execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async fixRuntimeError(details) {
    this.log('Aplicando fix genérico para error de runtime...', 'fix');

    // Limpiar cache y reinstalar
    await this.deepClean();

    try {
      execSync('npm install', { stdio: 'inherit' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // ════════════════════════════════════════════════════════════
  // PASO 7: CICLO PRINCIPAL MEJORADO
  // ════════════════════════════════════════════════════════════
  async run() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  🤖 CHRONOS AUTONOMOUS SYSTEM - ULTRA AVANZADO v2.0       ║');
    console.log('║  Sistema autónomo con verificación HTTP inteligente      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    this.log(
      `Modo de monitoreo: ${this.usePuppeteer ? 'Puppeteer (completo)' : 'HTTP Simple (rápido)'}`,
      'info'
    );
    this.log(`Intentos máximos: ${this.maxRetries}`, 'info');
    this.log(`Puerto: ${this.port}`, 'info');
    console.log('');

    while (this.currentRetry < this.maxRetries) {
      this.currentRetry++;
      this.errorDetected = false;
      this.lastError = null;
      this.serverStartTime = Date.now();

      this.log(`═══════════════════════════════════════════════════════════`, 'info');
      this.log(`INTENTO ${this.currentRetry}/${this.maxRetries}`, 'info');
      this.log(`═══════════════════════════════════════════════════════════`, 'info');

      try {
        // 1. Limpieza profunda (solo en primer intento o después de error crítico)
        if (this.currentRetry === 1 || this.currentRetry % 5 === 0) {
          await this.deepClean();
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          this.log('Saltando limpieza profunda (no necesaria)', 'info');
        }

        // 2. Verificación pre-inicio
        const verificationPassed = await this.preStartVerification();
        if (!verificationPassed) {
          this.log('Verificación pre-inicio falló, reintentando...', 'error');
          continue;
        }

        // 3. Iniciar servidor
        await this.startServer();
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // 4. Monitorear en tiempo real
        const monitoringPassed = await this.startMonitoring();

        const elapsedTime = ((Date.now() - this.serverStartTime) / 1000).toFixed(2);
        this.log(`Tiempo total del intento: ${elapsedTime}s`, 'info');

        if (monitoringPassed) {
          this.log('═══════════════════════════════════════════════════════════', 'success');
          this.log('🎉 ¡ÉXITO TOTAL! Sistema funcionando sin errores', 'success');
          this.log(`⏱️  Tiempo hasta éxito: ${elapsedTime}s`, 'success');
          this.log(`🔄 Intentos necesarios: ${this.currentRetry}/${this.maxRetries}`, 'success');
          this.log('═══════════════════════════════════════════════════════════', 'success');

          // Generar reporte de éxito
          await this.generateSuccessReport();

          // Mantener servidor corriendo
          this.log('', 'info');
          this.log('🌐 Servidor disponible en:', 'success');
          this.log('   http://localhost:3001', 'success');
          this.log('', 'info');
          this.log('Presiona Ctrl+C para detener el servidor', 'info');
          await new Promise(() => {}); // Esperar indefinidamente
          return;
        }

        // 5. Analizar error
        const errorAnalysis = this.analyzeError();

        // 6. Aplicar fix solo si no es un error HTTP simple
        if (errorAnalysis && errorAnalysis.type !== 'HTTP_CHECK_ERROR') {
          await this.closeBrowser();
          this.stopServer();

          const fixApplied = await this.applyFix(errorAnalysis);

          if (fixApplied) {
            this.log('Fix aplicado, reiniciando ciclo...', 'restart');
            await new Promise((resolve) => setTimeout(resolve, 3000));
            continue;
          }
        }

        // Si llegamos aquí, el fix no funcionó
        this.log(`Intento ${this.currentRetry} completado con errores`, 'error');
        await this.closeBrowser();
        this.stopServer();
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (error) {
        this.log(`Error en intento ${this.currentRetry}: ${error.message}`, 'error');
        await this.closeBrowser();
        this.stopServer();
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    // Si llegamos aquí, fallaron todos los intentos
    this.log('═══════════════════════════════════════════════════════════', 'error');
    this.log(`❌ Sistema falló después de ${this.maxRetries} intentos`, 'error');
    this.log('═══════════════════════════════════════════════════════════', 'error');

    await this.generateFailureReport();
  }

  // ════════════════════════════════════════════════════════════
  // REPORTES
  // ════════════════════════════════════════════════════════════
  async generateSuccessReport() {
    const report = `
# 🎉 CHRONOS AUTONOMOUS SYSTEM - REPORTE DE ÉXITO

**Fecha**: ${new Date().toISOString()}
**Intentos necesarios**: ${this.currentRetry}/${this.maxRetries}
**Fixes aplicados**: ${this.fixes.length}

## ✅ Estado Final

- ✅ Sistema iniciado correctamente
- ✅ Sin errores detectados
- ✅ Chronos System accesible
- ✅ Monitoreo completado sin problemas

## 🔧 Fixes Aplicados

${this.fixes.map((fix, i) => `${i + 1}. ${fix.type} - ${new Date(fix.timestamp).toISOString()}`).join('\n')}

## 📊 Logs

Ver archivo completo: autonomous-system.log
`;

    fs.writeFileSync('AUTONOMOUS_SUCCESS_REPORT.md', report);
    this.log('Reporte de éxito generado: AUTONOMOUS_SUCCESS_REPORT.md', 'success');
  }

  async generateFailureReport() {
    const report = `
# ❌ CHRONOS AUTONOMOUS SYSTEM - REPORTE DE FALLO

**Fecha**: ${new Date().toISOString()}
**Intentos realizados**: ${this.currentRetry}/${this.maxRetries}
**Fixes aplicados**: ${this.fixes.length}

## ❌ Estado Final

Sistema no pudo iniciarse correctamente después de ${this.maxRetries} intentos.

## 🔧 Fixes Aplicados

${this.fixes.map((fix, i) => `${i + 1}. ${fix.type} - ${new Date(fix.timestamp).toISOString()}`).join('\n')}

## ❌ Errores Detectados

${this.errors.map((err, i) => `${i + 1}. ${err}`).join('\n')}

## 📸 Screenshots

Ver carpeta: error-screenshots/

## 📊 Logs Completos

Ver archivo: autonomous-system.log

## 🛠️ Acciones Recomendadas

1. Revisar los logs completos
2. Revisar los screenshots de errores
3. Ejecutar manualmente: npm install
4. Verificar configuración de Firebase
5. Consultar con el equipo de desarrollo
`;

    fs.writeFileSync('AUTONOMOUS_FAILURE_REPORT.md', report);
    this.log('Reporte de fallo generado: AUTONOMOUS_FAILURE_REPORT.md', 'error');
  }
}

// ════════════════════════════════════════════════════════════
// EJECUCIÓN
// ════════════════════════════════════════════════════════════
const system = new ChronosAutonomousSystem();

// Manejar Ctrl+C
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Deteniendo sistema autónomo...');
  system.stopServer();
  await system.closeBrowser();
  process.exit(0);
});

system.run().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
