/**
 * 🧪 TEST SUITE - Animation Exporter
 * Tests para exportación de animaciones
 */
import { describe, expect, it } from 'vitest';

import AnimationExporter from '../services/adobe/AnimationExporter';

describe('AnimationExporter', () => {
  const exporter = new AnimationExporter();

  describe('exportToLottie', () => {
    it('debería exportar animación de Framer Motion a Lottie', () => {
      const animation = {
        animate: {
          scale: [1, 1.2, 1],
          opacity: [0, 1],
          rotate: [0, 360],
        },
        transition: {
          duration: 2,
          ease: 'easeInOut',
        },
      };

      const result = exporter.exportToLottie(animation, 'TestAnimation');

      expect(result).toHaveProperty('v'); // Lottie version
      expect(result).toHaveProperty('fr'); // Frame rate
      expect(result).toHaveProperty('layers');
      expect(result.layers).toBeInstanceOf(Array);
    });

    it('debería manejar animaciones complejas con keyframes', () => {
      const animation = {
        animate: {
          x: [0, 100, 50, 100],
          y: [0, -50, -100, 0],
        },
        transition: {
          duration: 3,
          times: [0, 0.3, 0.6, 1],
        },
      };

      const result = exporter.exportToLottie(animation);
      expect(result.layers[0].ks.p.k).toBeInstanceOf(Array);
      expect(result.layers[0].ks.p.k.length).toBe(4);
    });
  });

  describe('exportToAfterEffects', () => {
    it('debería generar script .jsx válido para After Effects', () => {
      const animation = {
        animate: {
          scale: 1.5,
          rotate: 180,
        },
        transition: {
          duration: 1,
        },
      };

      const script = exporter.exportToAfterEffects(animation, 'TestLayer');

      expect(script).toContain('app.project');
      expect(script).toContain('scale');
      expect(script).toContain('rotation');
      expect(script).toContain('setValueAtTime');
    });
  });

  describe('convertFramerMotionToLottie', () => {
    it('debería convertir propiedades de Framer Motion', () => {
      const framerProps = {
        x: 100,
        y: 50,
        scale: 1.2,
        opacity: 0.8,
        rotate: 45,
      };

      const lottieProps = exporter.convertFramerMotionToLottie(framerProps);

      expect(lottieProps).toHaveProperty('p'); // position
      expect(lottieProps).toHaveProperty('s'); // scale
      expect(lottieProps).toHaveProperty('o'); // opacity
      expect(lottieProps).toHaveProperty('r'); // rotation
    });
  });
});
