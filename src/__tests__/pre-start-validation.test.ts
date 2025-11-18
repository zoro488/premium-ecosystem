import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, it } from 'vitest';

describe('🔥 Pre-Start Validation - Chronos System', () => {

  it('✅ package.json válido', () => {
    const packagePath = path.join(process.cwd(), 'package.json');
    expect(fs.existsSync(packagePath)).toBe(true);

    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    expect(pkg.scripts).toBeDefined();
    expect(pkg.scripts.dev).toBeDefined();
  });

  it('✅ Dependencias críticas instaladas', () => {
    const requiredDeps = ['react', 'react-dom', 'firebase', 'vite', 'zod'];

    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    for (const dep of requiredDeps) {
      expect(allDeps).toHaveProperty(dep);
    }
  });

  it('✅ Firebase config existe', () => {
    const configPaths = [
      'src/config/firebase.js',
      'src/lib/firebase.ts',
      'src/lib/firebase.js',
      'src/config/firebase.ts'
    ];

    const configExists = configPaths.some(p => fs.existsSync(p));
    expect(configExists).toBe(true);
  });

  it('✅ Estructura de directorios principal', () => {
    const requiredDirs = [
      'src',
      'src/components',
      'src/apps',
      'public'
    ];

    for (const dir of requiredDirs) {
      expect(fs.existsSync(dir)).toBe(true);
    }
  });

  it('✅ Archivo index.html existe', () => {
    expect(fs.existsSync('index.html')).toBe(true);
  });

  it('✅ Archivo vite.config existe', () => {
    const viteConfigs = [
      'vite.config.ts',
      'vite.config.js'
    ];

    const configExists = viteConfigs.some(p => fs.existsSync(p));
    expect(configExists).toBe(true);
  });

  it('✅ TypeScript config existe', () => {
    expect(fs.existsSync('tsconfig.json')).toBe(true);
  });

  it('✅ Variables de entorno configuradas', () => {
    const envFiles = ['.env', '.env.local', '.env.development'];
    const envExists = envFiles.some(f => fs.existsSync(f));

    // No obligatorio, pero si existe debe tener VITE_FIREBASE_
    if (envExists) {
      const envFile = envFiles.find(f => fs.existsSync(f));
      if (envFile) {
        const content = fs.readFileSync(envFile, 'utf-8');
        expect(content).toContain('VITE_FIREBASE_');
      }
    }
  });
});
