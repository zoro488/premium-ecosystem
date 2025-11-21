/**
 * 🧪 INTEGRATION TESTS - Adobe Automation CLI
 * Tests de integración end-to-end para CLI
 */
import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const execAsync = promisify(exec);
const testOutputDir = path.join(process.cwd(), 'test-output');

describe('Adobe Automation CLI - Integration Tests', () => {
  beforeAll(async () => {
    // Crear directorio de salida para tests
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  afterAll(async () => {
    // Limpiar archivos de test
    await fs.rm(testOutputDir, { recursive: true, force: true });
  });

  describe('generate-component command', () => {
    it('debería generar componente desde CLI', async () => {
      const { stdout } = await execAsync(
        `node src/cli/adobe-automation.js generate-component -n TestButton -d "A test button" -o ${testOutputDir}`
      );

      expect(stdout).toContain('Generando componente');
      expect(stdout).toContain('TestButton');

      // Verificar que se crearon los archivos
      const files = await fs.readdir(testOutputDir);
      expect(files).toContain('TestButton.jsx');
      expect(files).toContain('TestButton.test.jsx');
    }, 30000);
  });

  describe('export-animation command', () => {
    it('debería exportar animación a Lottie', async () => {
      // Primero crear archivo de animación de prueba
      const animationFile = path.join(testOutputDir, 'test-animation.json');
      await fs.writeFile(
        animationFile,
        JSON.stringify({
          animate: { scale: [1, 1.5], opacity: [0, 1] },
          transition: { duration: 1 },
        })
      );

      const { stdout } = await execAsync(
        `node src/cli/adobe-automation.js export-animation -i ${animationFile} -n TestAnim -o ${testOutputDir}`
      );

      expect(stdout).toContain('Exportando animación');

      const files = await fs.readdir(testOutputDir);
      expect(files.some((f) => f.endsWith('_lottie.json'))).toBe(true);
    }, 30000);
  });

  describe('generate-design-system command', () => {
    it('debería generar sistema de diseño', async () => {
      const colors = JSON.stringify({ primary: '#3B82F6', secondary: '#10B981' });

      const { stdout } = await execAsync(
        `node src/cli/adobe-automation.js generate-design-system -n TestSystem -c '${colors}' -f css -o ${testOutputDir}`
      );

      expect(stdout).toContain('Generando sistema de diseño');

      const files = await fs.readdir(testOutputDir);
      expect(files.some((f) => f.endsWith('.css'))).toBe(true);
    }, 30000);
  });

  describe('batch command', () => {
    it('debería procesar múltiples componentes', async () => {
      // Crear archivo de batch
      const batchFile = path.join(testOutputDir, 'batch.json');
      await fs.writeFile(
        batchFile,
        JSON.stringify([
          { name: 'Component1', description: 'First component' },
          { name: 'Component2', description: 'Second component' },
        ])
      );

      const { stdout } = await execAsync(
        `node src/cli/adobe-automation.js batch -i ${batchFile} -o ${testOutputDir}`
      );

      expect(stdout).toContain('Procesando');
      expect(stdout).toContain('Component1');
      expect(stdout).toContain('Component2');

      const files = await fs.readdir(testOutputDir);
      expect(files).toContain('Component1.jsx');
      expect(files).toContain('Component2.jsx');
    }, 60000);
  });

  describe('analyze-design command', () => {
    it('debería analizar un diseño y retornar scores', async () => {
      const { stdout } = await execAsync(
        `node src/cli/adobe-automation.js analyze-design -i https://example.com/design.jpg -o ${path.join(testOutputDir, 'analysis.json')}`
      );

      expect(stdout).toContain('Analizando diseño');

      const analysisFile = await fs.readFile(path.join(testOutputDir, 'analysis.json'), 'utf-8');
      const analysis = JSON.parse(analysisFile);

      expect(analysis).toHaveProperty('usability');
      expect(analysis).toHaveProperty('aesthetics');
      expect(analysis).toHaveProperty('accessibility');
    }, 30000);
  });
});
