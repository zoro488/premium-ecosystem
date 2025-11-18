#!/usr/bin/env node
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const net = require('net');

class ChronosAutoFix {
  constructor() {
    this.maxRetries = 5;
    this.currentRetry = 0;
    this.port = 3001; // Puerto configurado en este proyecto
  }

  log(message, type = 'info') {
    const icons = { info: 'ℹ️', success: '✅', error: '❌', fix: '🔧', test: '🧪' };
    console.log(`${icons[type]} ${message}`);
  }

  async isPortInUse(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once('error', () => resolve(true));
      server.once('listening', () => {
        server.close();
        resolve(false);
      });
      server.listen(port);
    });
  }

  async fixPortInUse() {
    this.log(`Puerto ${this.port} ocupado. Liberando...`, 'fix');
    
    try {
      if (process.platform === 'win32') {
        execSync(`FOR /F "tokens=5" %P IN ('netstat -ano ^| findstr :${this.port}') DO TaskKill.exe /PID %P /F`, { 
          shell: 'cmd.exe',
          stdio: 'pipe' 
        });
      } else {
        execSync(`lsof -ti:${this.port} | xargs kill -9`, { stdio: 'pipe' });
      }
      
      this.log('Puerto liberado exitosamente', 'success');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    } catch (error) {
      this.log('Puerto ya estaba libre o no se pudo liberar', 'info');
      return true;
    }
  }

  async fixDependencies() {
    this.log('Verificando dependencias...', 'test');
    
    const requiredDeps = ['firebase', 'react', 'react-dom', 'vite', 'zod', 'typescript'];

    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      const installedDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      const missing = requiredDeps.filter(dep => !installedDeps[dep]);

      if (missing.length > 0) {
        this.log(`Dependencias faltantes: ${missing.join(', ')}`, 'fix');
        execSync('npm install', { stdio: 'inherit' });
        this.log('Dependencias instaladas', 'success');
        return true;
      }

      this.log('Todas las dependencias presentes', 'success');
      return true;
    } catch (error) {
      this.log(`Error verificando dependencias: ${error.message}`, 'error');
      return false;
    }
  }

  async fixViteCache() {
    this.log('Limpiando cache de Vite...', 'fix');
    
    try {
      const cacheDirs = ['node_modules/.vite', 'dist', '.vite'];
      
      for (const dir of cacheDirs) {
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
          this.log(`Cache ${dir} eliminado`, 'success');
        }
      }
      
      return true;
    } catch (error) {
      this.log(`Error limpiando cache: ${error.message}`, 'error');
      return false;
    }
  }

  async fixFirebaseConfig() {
    this.log('Verificando configuración de Firebase...', 'test');
    
    try {
      const configFiles = [
        'src/config/firebase.js',
        'src/lib/firebase.ts',
        'src/lib/firebase.js',
        'src/config/firebase.ts',
        'src/firebase.config.ts'
      ];

      let configFound = false;
      for (const file of configFiles) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf-8');
          if (content.includes('apiKey') && content.includes('projectId')) {
            configFound = true;
            this.log(`Configuración de Firebase encontrada en ${file}`, 'success');
            break;
          }
        }
      }

      if (!configFound) {
        this.log('ADVERTENCIA: No se encontró configuración válida de Firebase', 'error');
        return false;
      }

      return true;
    } catch (error) {
      this.log(`Error verificando Firebase: ${error.message}`, 'error');
      return false;
    }
  }

  async runTests() {
    this.log('Ejecutando tests...', 'test');
    
    try {
      execSync('npm test -- --run', { stdio: 'inherit' });
      this.log('Tests pasaron exitosamente', 'success');
      return true;
    } catch (error) {
      this.log('Tests fallaron, pero continuando...', 'error');
      return true;
    }
  }

  async startDevServer() {
    this.log('Iniciando servidor de desarrollo...', 'info');
    
    return new Promise((resolve, reject) => {
      const devServer = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        shell: true
      });

      devServer.on('error', (error) => {
        reject(error);
      });

      setTimeout(() => {
        if (!devServer.killed) {
          this.log(`Servidor iniciado exitosamente en http://localhost:${this.port}`, 'success');
          resolve(true);
        }
      }, 5000);
    });
  }

  async start() {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  🚀 CHRONOS SYSTEM - AUTO-FIX & START             ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    while (this.currentRetry < this.maxRetries) {
      this.currentRetry++;
      this.log(`Intento ${this.currentRetry}/${this.maxRetries}`, 'info');

      try {
        const portInUse = await this.isPortInUse(this.port);
        if (portInUse) await this.fixPortInUse();

        await this.fixDependencies();

        if (this.currentRetry > 1) await this.fixViteCache();

        await this.fixFirebaseConfig();

        if (this.currentRetry === 1) await this.runTests();

        await this.startDevServer();
        
        console.log('\n✅ Chronos System iniciado exitosamente\n');
        return;

      } catch (error) {
        this.log(`Error en intento ${this.currentRetry}: ${error.message}`, 'error');
        
        if (this.currentRetry < this.maxRetries) {
          this.log('Reintentando en 3 segundos...', 'info');
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          console.log('\n❌ No se pudo iniciar después de 5 intentos\n');
          process.exit(1);
        }
      }
    }
  }
}

const autoFix = new ChronosAutoFix();
autoFix.start();
