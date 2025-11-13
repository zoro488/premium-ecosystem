/**
 * 🧪 TEST SUITE - AI Design Automation Engine
 * Tests para generación automática de componentes
 */
import { beforeEach, describe, expect, it } from 'vitest';

import AIDesignAutomationEngine from '../services/adobe/AIDesignAutomationEngine';

describe('AIDesignAutomationEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new AIDesignAutomationEngine();
  });

  describe('generateComponent', () => {
    it('debería generar un componente React completo', async () => {
      const result = await engine.generateComponent({
        name: 'TestButton',
        description: 'A premium button component',
        designStyle: 'glassmorphism-futuristic',
      });

      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('test');
      expect(result).toHaveProperty('story');
      expect(result).toHaveProperty('docs');
      expect(result.code).toContain('TestButton');
      expect(result.code).toContain('export default');
    });

    it('debería incluir animaciones cuando se especifica', async () => {
      const result = await engine.generateComponent({
        name: 'AnimatedCard',
        description: 'Card with animations',
        designStyle: 'modern',
        includeAnimations: true,
      });

      expect(result.code).toContain('motion.');
      expect(result.code).toContain('animate');
    });

    it('debería generar tests válidos', async () => {
      const result = await engine.generateComponent({
        name: 'TestComponent',
        description: 'Test component',
      });

      expect(result.test).toContain('describe');
      expect(result.test).toContain('it');
      expect(result.test).toContain('expect');
    });
  });

  describe('generateCompletePage', () => {
    it('debería generar una página completa con múltiples componentes', async () => {
      const result = await engine.generateCompletePage({
        name: 'Dashboard',
        description: 'Analytics dashboard',
        sections: [
          { type: 'header', title: 'Dashboard' },
          { type: 'stats', metrics: ['users', 'revenue'] },
          { type: 'charts', charts: ['line', 'bar'] },
        ],
      });

      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('components');
      expect(result.components.length).toBeGreaterThan(0);
    });
  });

  describe('generateVariations', () => {
    it('debería generar múltiples variaciones de un componente', async () => {
      const result = await engine.generateVariations({
        baseComponent: 'Button',
        variants: ['primary', 'secondary', 'danger'],
      });

      expect(result.variants).toHaveLength(3);
      expect(result.variants[0]).toHaveProperty('name');
      expect(result.variants[0]).toHaveProperty('code');
    });
  });
});
