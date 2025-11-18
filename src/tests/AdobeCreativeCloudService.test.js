/**
 * 🧪 TEST SUITE - Adobe Creative Cloud Service
 * Tests comprehensivos para servicios de Adobe
 */
import { beforeEach, describe, expect, it } from 'vitest';

import AdobeCreativeCloudService from '../services/adobe/AdobeCreativeCloudService';

describe('AdobeCreativeCloudService', () => {
  let service;

  beforeEach(() => {
    service = new AdobeCreativeCloudService();
  });

  describe('generateImage', () => {
    it('debería generar una imagen con Firefly', async () => {
      const config = {
        prompt: 'futuristic button design',
        style: 'glassmorphism',
        size: '1024x1024',
      };

      const result = await service.generateImage(config);

      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('prompt');
      expect(result.prompt).toBe(config.prompt);
    });

    it('debería fallar con prompt inválido', async () => {
      await expect(service.generateImage({ prompt: '', style: 'modern' })).rejects.toThrow();
    });
  });

  describe('generativeExpand', () => {
    it('debería expandir una imagen correctamente', async () => {
      const result = await service.generativeExpand({
        imageUrl: 'https://example.com/image.jpg',
        expandDirection: 'all',
        aspectRatio: '16:9',
      });

      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('original');
    });
  });

  describe('generateDesignSystem', () => {
    it('debería generar un sistema de diseño completo', async () => {
      const result = await service.generateDesignSystem({
        name: 'TestSystem',
        primaryColor: '#3B82F6',
        style: 'modern',
      });

      expect(result).toHaveProperty('colors');
      expect(result).toHaveProperty('typography');
      expect(result).toHaveProperty('spacing');
      expect(result.colors).toHaveProperty('primary');
    });
  });

  describe('analyzeDesignWithAI', () => {
    it('debería analizar un diseño y retornar scores', async () => {
      const result = await service.analyzeDesignWithAI({
        imageUrl: 'https://example.com/design.jpg',
      });

      expect(result).toHaveProperty('usability');
      expect(result).toHaveProperty('aesthetics');
      expect(result).toHaveProperty('accessibility');
      expect(result.usability.score).toBeGreaterThanOrEqual(0);
      expect(result.usability.score).toBeLessThanOrEqual(10);
    });
  });
});
