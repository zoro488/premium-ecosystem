/**
 * 🧪 TEST SUITE - Premiere Pro Automation
 * Tests para automatización de videos
 */
import { beforeEach, describe, expect, it } from 'vitest';

import PremiereProAutomation from '../services/adobe/PremiereProAutomation';

describe('PremiereProAutomation', () => {
  let premiere;

  beforeEach(() => {
    premiere = new PremiereProAutomation();
  });

  describe('generatePromoVideo', () => {
    it('debería generar un video promocional completo', async () => {
      const result = await premiere.generatePromoVideo({
        title: 'Test Promo',
        duration: 30,
        style: 'modern-corporate',
      });

      expect(result).toHaveProperty('script');
      expect(result).toHaveProperty('metadata');
      expect(result.metadata.duration).toBe(30);
      expect(result.script).toContain('Adobe Premiere Pro Script');
    });

    it('debería incluir voiceover cuando se especifica', async () => {
      const result = await premiere.generatePromoVideo({
        title: 'Test',
        duration: 20,
        voiceover: { voice: 'professional-male', language: 'es-MX' },
      });

      expect(result.metadata.hasVoiceover).toBe(true);
      expect(result.script).toContain('voiceClip');
    });
  });

  describe('generateVideoScript', () => {
    it('debería generar un guion con escenas estructuradas', async () => {
      const script = await premiere.generateVideoScript({
        title: 'Test Video',
        duration: 60,
        style: 'modern',
        sceneCount: 4,
      });

      expect(script.scenes).toHaveLength(4);
      expect(script.totalDuration).toBe(60);
      script.scenes.forEach((scene) => {
        expect(scene).toHaveProperty('id');
        expect(scene).toHaveProperty('duration');
        expect(scene).toHaveProperty('visual');
        expect(scene).toHaveProperty('narration');
      });
    });
  });

  describe('generateTutorialVideo', () => {
    it('debería generar un video tutorial paso a paso', async () => {
      const steps = [
        { title: 'Paso 1', description: 'Descripción 1' },
        { title: 'Paso 2', description: 'Descripción 2' },
        { title: 'Paso 3', description: 'Descripción 3' },
      ];

      const result = await premiere.generateTutorialVideo({
        topic: 'Cómo usar la app',
        steps,
        duration: 90,
      });

      expect(result.metadata.steps).toBe(3);
      expect(result.metadata.duration).toBe(90);
      expect(result.script).toContain('Tutorial');
    });
  });

  describe('generateProductDemo', () => {
    it('debería generar un demo de producto', async () => {
      const features = [
        { name: 'Feature 1', description: 'Amazing feature' },
        { name: 'Feature 2', description: 'Another great one' },
      ];

      const result = await premiere.generateProductDemo({
        productName: 'FlowDistributor',
        features,
        duration: 60,
      });

      expect(result.metadata.productName).toBe('FlowDistributor');
      expect(result.metadata.features).toBe(2);
      expect(result.script).toContain('FlowDistributor');
    });
  });

  describe('generateEffectsCode', () => {
    it('debería generar código para efectos de video', () => {
      const scene = {
        id: 1,
        effects: ['zoom-in', 'pan', 'blur'],
      };

      const code = premiere.generateEffectsCode(scene);

      expect(code).toContain('Zoom In');
      expect(code).toContain('Pan');
      expect(code).toContain('Gaussian Blur');
    });
  });

  describe('generateTransitionsCode', () => {
    it('debería generar código para transiciones', () => {
      const scenes = [
        { id: 1, transition: 'crossfade' },
        { id: 2, transition: 'slide' },
        { id: 3, transition: null },
      ];

      const code = premiere.generateTransitionsCode(scenes);

      expect(code).toContain('Cross Dissolve');
      expect(code).toContain('Transición entre escena');
    });
  });
});
