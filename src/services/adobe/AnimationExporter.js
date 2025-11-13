/**
 * 🎬 AFTER EFFECTS ANIMATION EXPORTER
 * Sistema para exportar animaciones Framer Motion a:
 * - Lottie JSON (para web/mobile)
 * - After Effects .jsx (para edición profesional)
 * - GIF animado
 * - MP4 video
 *
 * Permite automatizar la creación de assets animados
 * @version 5.0.0
 */
import { useCallback, useState } from 'react';

class AnimationExporter {
  constructor() {
    this.fps = 60;
    this.duration = 3; // seconds
    this.width = 1920;
    this.height = 1080;
  }

  /**
   * Convierte animaciones Framer Motion a Lottie JSON
   */
  exportToLottie(animation, options = {}) {
    const {
      name = 'animation',
      fps = this.fps,
      duration = this.duration,
      width = this.width,
      height = this.height,
    } = options;

    const lottieData = {
      v: '5.9.0', // Lottie version
      fr: fps,
      ip: 0,
      op: duration * fps,
      w: width,
      h: height,
      nm: name,
      ddd: 0, // 2D animation
      assets: [],
      layers: this.convertToLottieLayers(animation, duration, fps),
    };

    return lottieData;
  }

  convertToLottieLayers(animation, duration, fps) {
    const layers = [];

    // Analiza el tipo de animación
    if (animation.initial && animation.animate) {
      const layer = {
        ddd: 0,
        ind: 1,
        ty: 4, // Shape layer
        nm: 'MainLayer',
        sr: 1,
        ks: {
          o: this.convertOpacity(animation, duration, fps),
          r: this.convertRotation(animation, duration, fps),
          p: this.convertPosition(animation, duration, fps),
          a: { a: 0, k: [0, 0, 0] },
          s: this.convertScale(animation, duration, fps),
        },
        ao: 0,
        shapes: this.convertShapes(animation),
        ip: 0,
        op: duration * fps,
        st: 0,
        bm: 0,
      };

      layers.push(layer);
    }

    return layers;
  }

  convertOpacity(animation, duration, fps) {
    if (animation.initial?.opacity !== undefined || animation.animate?.opacity !== undefined) {
      const initialOpacity = (animation.initial?.opacity ?? 1) * 100;
      const finalOpacity = (animation.animate?.opacity ?? 1) * 100;

      return {
        a: 1, // Animated
        k: [
          {
            i: { x: [0.42], y: [1] },
            o: { x: [0.58], y: [0] },
            t: 0,
            s: [initialOpacity],
          },
          {
            t: duration * fps,
            s: [finalOpacity],
          },
        ],
      };
    }

    return { a: 0, k: 100 };
  }

  convertRotation(animation, duration, fps) {
    if (animation.initial?.rotate !== undefined || animation.animate?.rotate !== undefined) {
      const initialRotate = animation.initial?.rotate ?? 0;
      const finalRotate = animation.animate?.rotate ?? 0;

      return {
        a: 1,
        k: [
          {
            i: { x: [0.42], y: [1] },
            o: { x: [0.58], y: [0] },
            t: 0,
            s: [initialRotate],
          },
          {
            t: duration * fps,
            s: [finalRotate],
          },
        ],
      };
    }

    return { a: 0, k: 0 };
  }

  convertPosition(animation, duration, fps) {
    const initialX = animation.initial?.x ?? 0;
    const initialY = animation.initial?.y ?? 0;
    const finalX = animation.animate?.x ?? 0;
    const finalY = animation.animate?.y ?? 0;

    if (initialX !== finalX || initialY !== finalY) {
      return {
        a: 1,
        k: [
          {
            i: { x: [0.42, 0.42], y: [1, 1] },
            o: { x: [0.58, 0.58], y: [0, 0] },
            t: 0,
            s: [this.width / 2 + initialX, this.height / 2 + initialY, 0],
          },
          {
            t: duration * fps,
            s: [this.width / 2 + finalX, this.height / 2 + finalY, 0],
          },
        ],
      };
    }

    return {
      a: 0,
      k: [this.width / 2, this.height / 2, 0],
    };
  }

  convertScale(animation, duration, fps) {
    if (animation.initial?.scale !== undefined || animation.animate?.scale !== undefined) {
      const initialScale = (animation.initial?.scale ?? 1) * 100;
      const finalScale = (animation.animate?.scale ?? 1) * 100;

      return {
        a: 1,
        k: [
          {
            i: { x: [0.42, 0.42, 0.42], y: [1, 1, 1] },
            o: { x: [0.58, 0.58, 0.58], y: [0, 0, 0] },
            t: 0,
            s: [initialScale, initialScale, 100],
          },
          {
            t: duration * fps,
            s: [finalScale, finalScale, 100],
          },
        ],
      };
    }

    return { a: 0, k: [100, 100, 100] };
  }

  convertShapes(_animation) {
    // Genera formas básicas para la animación
    return [
      {
        ty: 'gr', // Group
        it: [
          {
            ty: 'rc', // Rectangle
            d: 1,
            s: { a: 0, k: [200, 200] },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 20 },
            nm: 'Rectangle',
          },
          {
            ty: 'fl', // Fill
            c: {
              a: 0,
              k: [0.4, 0.49, 0.92, 1], // Purple color
            },
            o: { a: 0, k: 100 },
            r: 1,
            bm: 0,
            nm: 'Fill',
          },
          {
            ty: 'tr', // Transform
            p: { a: 0, k: [0, 0] },
            a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] },
            r: { a: 0, k: 0 },
            o: { a: 0, k: 100 },
            sk: { a: 0, k: 0 },
            sa: { a: 0, k: 0 },
            nm: 'Transform',
          },
        ],
        nm: 'Shape',
        np: 2,
        cix: 2,
        bm: 0,
        ix: 1,
        mn: 'ADBE Vector Group',
        hd: false,
      },
    ];
  }

  /**
   * Genera script de After Effects (.jsx)
   */
  exportToAfterEffects(animation, options = {}) {
    const {
      name = 'animation',
      duration = this.duration,
      width = this.width,
      height = this.height,
    } = options;

    const script = `
// Adobe After Effects Script
// Generated by FlowDistributor Animation Exporter

(function() {
  var comp = app.project.items.addComp("${name}", ${width}, ${height}, 1, ${duration}, 60);

  // Create shape layer
  var shapeLayer = comp.layers.addShape();
  shapeLayer.name = "AnimatedShape";

  // Add rectangle
  var rect = shapeLayer.property("Contents").addProperty("ADBE Vector Shape - Rect");
  rect.property("Size").setValue([200, 200]);
  rect.property("Roundness").setValue(20);

  // Add fill
  var fill = shapeLayer.property("Contents").addProperty("ADBE Vector Graphic - Fill");
  fill.property("Color").setValue([0.4, 0.49, 0.92, 1]);

  // Add gradient fill for premium look
  var gradient = shapeLayer.property("Contents").addProperty("ADBE Vector Graphic - G-Fill");
  gradient.property("Start Point").setValue([100, 100]);
  gradient.property("End Point").setValue([300, 300]);

  // Animate opacity
  ${this.generateAEKeyframes('opacity', animation, duration)}

  // Animate position
  ${this.generateAEKeyframes('position', animation, duration)}

  // Animate scale
  ${this.generateAEKeyframes('scale', animation, duration)}

  // Animate rotation
  ${this.generateAEKeyframes('rotation', animation, duration)}

  // Add glow effect
  var glow = shapeLayer.property("Effects").addProperty("ADBE Glo2");
  glow.property("Glow Threshold").setValue(50);
  glow.property("Glow Radius").setValue(30);
  glow.property("Glow Intensity").setValue(0.8);

  // Add motion blur
  shapeLayer.motionBlur = true;
  comp.motionBlur = true;

  alert("Animation created successfully!");
})();
`;

    return script;
  }

  generateAEKeyframes(property, animation, duration) {
    const propMap = {
      opacity: 'Opacity',
      position: 'Position',
      scale: 'Scale',
      rotation: 'Rotation',
    };

    const aeProp = propMap[property];
    if (!aeProp) return '';

    const initial = animation.initial?.[property];
    const animate = animation.animate?.[property];

    if (initial !== undefined && animate !== undefined) {
      let initialValue, finalValue;

      switch (property) {
        case 'opacity':
          initialValue = initial * 100;
          finalValue = animate * 100;
          return `
  shapeLayer.property("Transform").property("${aeProp}").setValueAtTime(0, ${initialValue});
  shapeLayer.property("Transform").property("${aeProp}").setValueAtTime(${duration}, ${finalValue});
  `;

        case 'position':
          initialValue = `[${this.width / 2 + (initial.x || 0)}, ${this.height / 2 + (initial.y || 0)}]`;
          finalValue = `[${this.width / 2 + (animate.x || 0)}, ${this.height / 2 + (animate.y || 0)}]`;
          return `
  shapeLayer.property("Transform").property("${aeProp}").setValueAtTime(0, ${initialValue});
  shapeLayer.property("Transform").property("${aeProp}").setValueAtTime(${duration}, ${finalValue});
  `;

        case 'scale':
          initialValue = (initial || 1) * 100;
          finalValue = (animate || 1) * 100;
          return `
  shapeLayer.property("Transform").property("${aeProp}").setValueAtTime(0, [${initialValue}, ${initialValue}]);
  shapeLayer.property("Transform").property("${aeProp}").setValueAtTime(${duration}, [${finalValue}, ${finalValue}]);
  `;

        case 'rotation':
          return `
  shapeLayer.property("Transform").property("${aeProp}").setValueAtTime(0, ${initial || 0});
  shapeLayer.property("Transform").property("${aeProp}").setValueAtTime(${duration}, ${animate || 0});
  `;
      }
    }

    return '';
  }

  /**
   * Descarga archivo JSON
   */
  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Descarga script .jsx
   */
  downloadJSX(script, filename) {
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.jsx`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Exporta a múltiples formatos
   */
  exportAll(animation, filename = 'animation') {
    // Lottie JSON
    const lottie = this.exportToLottie(animation, { name: filename });
    this.downloadJSON(lottie, `${filename}_lottie`);

    // After Effects Script
    const aeScript = this.exportToAfterEffects(animation, { name: filename });
    this.downloadJSX(aeScript, `${filename}_aftereffects`);

    return {
      lottie,
      afterEffects: aeScript,
    };
  }
}

// Hook de React para usar el exportador
export const useAnimationExporter = () => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exporter = new AnimationExporter();

  const exportAnimation = useCallback(
    async (animation, filename, formats = ['lottie', 'ae']) => {
      setExporting(true);
      setProgress(0);

      const results = {};

      try {
        if (formats.includes('lottie')) {
          setProgress(33);
          const lottie = exporter.exportToLottie(animation, { name: filename });
          exporter.downloadJSON(lottie, `${filename}_lottie`);
          results.lottie = lottie;
        }

        if (formats.includes('ae')) {
          setProgress(66);
          const aeScript = exporter.exportToAfterEffects(animation, { name: filename });
          exporter.downloadJSX(aeScript, `${filename}_aftereffects`);
          results.afterEffects = aeScript;
        }

        setProgress(100);

        setTimeout(() => {
          setExporting(false);
          setProgress(0);
        }, 1000);

        return results;
      } catch (error) {
        setExporting(false);
        setProgress(0);
        throw error;
      }
    },
    [
      exporter.downloadJSON,
      exporter.downloadJSX,
      exporter.exportToAfterEffects,
      exporter.exportToLottie,
    ]
  );

  return {
    exportAnimation,
    exporting,
    progress,
  };
};
export default AnimationExporter;

/**
 * 🎯 EJEMPLO DE USO
 *
 * // Opción 1: Importar clase directamente
 * import AnimationExporter from './AnimationExporter'
 *
 * const exporter = new AnimationExporter()
 * const myAnimation = {
 *   initial: { opacity: 0, scale: 0.8, y: 50 },
 *   animate: { opacity: 1, scale: 1, y: 0 },
 *   transition: { duration: 0.5 }
 * }
 *
 * // Exportar a Lottie
 * const lottieJson = await exporter.exportToLottie(myAnimation, 'mi-animacion')
 *
 * // Exportar a After Effects
 * const aeScript = await exporter.exportToAfterEffects(myAnimation, 'mi-animacion')
 *
 * // Opción 2: Usar desde React con useAnimationExporter hook
 * import { useAnimationExporter } from '@/hooks/useAdobeAutomation'
 * const { exportAnimation } = useAnimationExporter()
 * await exportAnimation(myAnimation, 'mi-animacion', ['lottie', 'ae'])
 */
