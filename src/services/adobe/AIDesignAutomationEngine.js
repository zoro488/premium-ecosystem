/**
 * 🤖 AI DESIGN AUTOMATION ENGINE
 * Motor ultra-avanzado de generación automática de UI/UX
 *
 * Revoluciona el diseño completo con IA:
 * - Genera componentes React desde descripción
 * - Crea design systems completos
 * - Optimiza UX con análisis predictivo
 * - Auto-anima interfaces
 * - Exporta código production-ready
 *
 * @version 6.0.0 HYBRID (Ollama + Adobe)
 */
import axios from 'axios';

import { ollamaService } from '../ai/OllamaService.js';
import { adobeService } from './AdobeCreativeCloudService.js';

class AIDesignAutomationEngine {
  constructor() {
    // Servicios de IA
    this.adobe = adobeService; // Assets visuales premium
    this.ollama = ollamaService; // Generación de código (local/gratis)

    // API Keys (compatible con Vite y Node CLI) - BACKUP
    const env = typeof import.meta?.env !== 'undefined' ? import.meta.env : process.env;
    this.ANTHROPIC_KEY = env.VITE_ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
    this.OPENAI_KEY = env.VITE_OPENAI_API_KEY || env.OPENAI_API_KEY;

    // Configuración del motor
    this.config = {
      quality: 'supreme', // low, medium, high, supreme
      creativityLevel: 0.9, // 0-1
      targetFramework: 'react',
      styleLibrary: 'tailwind',
      animationLibrary: 'framer-motion',
      useOllama: true, // Usar Ollama por defecto
    };

    // Cache de generaciones
    this.generatedComponents = new Map();
    this.designHistory = [];
  }

  // ============================================
  // 🎨 GENERACIÓN AUTOMÁTICA DE COMPONENTES
  // ============================================

  /**
   * Genera un componente React completo desde descripción
   * @param {Object} spec - Especificación del componente
   * @returns {Promise<Object>} Código del componente + assets
   */
  async generateComponent({
    name,
    description,
    type = 'functional', // functional, class, page, layout
    features = [],
    designStyle = 'glassmorphism-futuristic',
    includeAnimations = true,
    includeTests = true,
  }) {
    // 1. Claude genera la estructura
    const componentStructure = await this.generateComponentStructure({
      name,
      description,
      type,
      features,
    });

    // 2. GPT-4 genera el código React
    const componentCode = await this.generateComponentCode(componentStructure);

    // 3. Firefly genera assets visuales
    const assets = await this.generateComponentAssets({
      name,
      description,
      designStyle,
    });

    // 4. Genera animaciones si está habilitado
    const animations = includeAnimations
      ? await this.generateComponentAnimations(name, componentStructure)
      : null;

    // 5. Genera tests si está habilitado
    const tests = includeTests ? await this.generateComponentTests(name, componentCode) : null;

    // 6. Empaqueta todo
    const component = {
      name,
      code: componentCode,
      styles: await this.generateComponentStyles(name, designStyle),
      animations,
      assets,
      tests,
      documentation: await this.generateComponentDocs(name, description, componentCode),
      storybook: await this.generateStorybookStory(name, componentCode),
    };

    // Cache
    this.generatedComponents.set(name, component);

    return component;
  }

  /**
   * Genera estructura del componente con Ollama (o Claude como fallback)
   */
  async generateComponentStructure({ name, description, type, features }) {
    // Intentar con Ollama primero
    if (this.config.useOllama) {
      const structure = await this.ollama.generateComponentStructure(name, description, type);

      if (structure) {
        return structure;
      }
    }

    // Fallback a Claude si Ollama falla
    const prompt = `Eres un arquitecto senior de React. Genera la estructura JSON completa para este componente:

Nombre: ${name}
Tipo: ${type}
Descripción: ${description}
Features: ${features.join(', ')}

Genera un JSON con esta estructura:
{
  "props": [
    { "name": "propName", "type": "string", "required": true, "default": null, "description": "..." }
  ],
  "state": [
    { "name": "stateName", "type": "boolean", "initial": false, "description": "..." }
  ],
  "hooks": ["useState", "useEffect", "useMemo"],
  "dependencies": ["react", "framer-motion"],
  "children": [
    { "name": "Header", "type": "div", "props": {} },
    { "name": "Content", "type": "div", "props": {} }
  ],
  "events": [
    { "name": "onClick", "handler": "handleClick", "description": "..." }
  ],
  "animations": [
    { "trigger": "mount", "type": "fadeIn", "duration": 300 }
  ]
}

Solo responde con el JSON, sin explicaciones.`;

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-opus-20240229',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            'x-api-key': this.ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );

      const jsonText = response.data.content[0].text;
      return JSON.parse(jsonText.match(/\{[\s\S]*\}/)[0]);
    } catch (_error) {
      return this.getDefaultStructure(name, type);
    }
  }

  /**
   * Genera código React con Ollama (o GPT-4 como fallback)
   */
  async generateComponentCode(structure) {
    // Intentar con Ollama primero
    if (this.config.useOllama) {
      const result = await this.ollama.generateReactCode(
        structure.description || 'Componente React premium',
        structure
      );

      if (result.success && result.text) {
        // Limpia markdown si viene con ```
        const code = result.text.replace(/```[a-z]*\n/g, '').replace(/```$/g, '');
        return code;
      }
    }

    // Fallback a GPT-4 o código por defecto
    const prompt = `Genera un componente React PREMIUM con esta estructura:

${JSON.stringify(structure, null, 2)}

Requisitos:
- TypeScript con tipos estrictos
- Framer Motion para animaciones
- TailwindCSS para estilos
- Hooks modernos (useState, useEffect, useMemo, useCallback)
- Comentarios JSDoc
- Manejo de errores
- Accesibilidad completa (ARIA)
- Performance optimizado (React.memo si necesario)
- Diseño glassmorphism futurista
- Microinteracciones premium

Genera SOLO el código del componente, sin explicaciones.`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content:
                'Eres un desarrollador React senior especializado en componentes premium con animaciones fluidas.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.OPENAI_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let code = response.data.choices[0].message.content;

      // Limpia markdown si viene con ```
      code = code.replace(/```[a-z]*\n/g, '').replace(/```$/g, '');

      return code;
    } catch (_error) {
      return this.generateFallbackCode(structure);
    }
  }

  /**
   * Genera assets visuales con Firefly
   */
  async generateComponentAssets({ name, description, designStyle }) {
    const prompts = {
      icon: `modern icon for ${name}, ${designStyle}, vector style, transparent background, high quality, 512x512`,
      background: `${designStyle} background for ${name} component, premium quality, abstract, 1920x1080`,
      illustration: `UI illustration for ${name}, ${description}, ${designStyle}, modern, clean`,
    };

    const assets = {};

    for (const [key, prompt] of Object.entries(prompts)) {
      try {
        const result = await this.adobe.generateImage({
          prompt,
          style: key === 'icon' ? 'graphic' : 'art',
          size: key === 'icon' ? { width: 512, height: 512 } : { width: 1920, height: 1080 },
          variations: 2,
        });

        assets[key] = result.images[0].url;
      } catch (_error) {
        assets[key] = null;
      }
    }

    return assets;
  }

  /**
   * Genera animaciones Framer Motion
   */
  async generateComponentAnimations(_name, structure) {
    const animations = {
      mount: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 30 },
      },
      hover: {
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        transition: { duration: 0.2 },
      },
      tap: {
        scale: 0.98,
        transition: { duration: 0.1 },
      },
    };

    // Agrega animaciones específicas basadas en el tipo de componente
    if (structure.animations) {
      structure.animations.forEach((anim) => {
        animations[anim.trigger] = this.convertToFramerMotion(anim);
      });
    }

    return animations;
  }

  convertToFramerMotion(animation) {
    const typeMap = {
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      },
      slideUp: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
      },
      scaleIn: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
      },
      rotate: {
        initial: { rotate: 0 },
        animate: { rotate: 360 },
      },
    };

    return {
      ...typeMap[animation.type],
      transition: { duration: animation.duration / 1000 },
    };
  }

  /**
   * Genera estilos TailwindCSS
   */
  async generateComponentStyles(_name, designStyle) {
    const stylePresets = {
      'glassmorphism-futuristic': {
        base: 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl',
        hover: 'hover:bg-white/20 hover:border-white/30',
        active: 'active:scale-95',
        transition: 'transition-all duration-300',
        glow: 'shadow-[0_0_30px_rgba(102,126,234,0.3)]',
      },
      'neon-cyberpunk': {
        base: 'bg-gray-900 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]',
        hover: 'hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]',
        active: 'active:border-cyan-500',
        transition: 'transition-all duration-200',
        glow: 'shadow-[0_0_40px_rgba(6,182,212,0.8)]',
      },
      'minimal-premium': {
        base: 'bg-white border border-gray-200 shadow-lg',
        hover: 'hover:shadow-xl hover:border-gray-300',
        active: 'active:shadow-md',
        transition: 'transition-shadow duration-200',
        glow: '',
      },
    };

    const preset = stylePresets[designStyle] || stylePresets['glassmorphism-futuristic'];

    return {
      container: `${preset.base} ${preset.transition} rounded-2xl p-6`,
      containerHover: preset.hover,
      containerActive: preset.active,
      containerGlow: preset.glow,
      header:
        'text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
      content: 'text-gray-700 dark:text-gray-300',
      button: `${preset.base} ${preset.transition} px-6 py-3 rounded-xl font-semibold ${preset.hover}`,
      input:
        'bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500',
    };
  }

  /**
   * Genera tests con Ollama (o GPT-4 como fallback)
   */
  async generateComponentTests(name, code) {
    // Intentar con Ollama primero
    if (this.config.useOllama) {
      const result = await this.ollama.generateTests(code);

      if (result.success && result.text) {
        // Limpia markdown si viene con ```
        const tests = result.text.replace(/```[a-z]*\n/g, '').replace(/```$/g, '');
        return tests;
      }
    }

    // Fallback
    const prompt = `Genera tests completos con Vitest + React Testing Library para este componente:

${code}

Incluye tests para:
- Renderizado correcto
- Props requeridas
- Estados y interacciones
- Eventos
- Accesibilidad
- Casos edge

Solo responde con el código de tests.`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en testing de React con Vitest.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.OPENAI_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let tests = response.data.choices[0].message.content;
      tests = tests.replace(/```[a-z]*\n/g, '').replace(/```$/g, '');

      return tests;
    } catch (_error) {
      return this.generateDefaultTests(name);
    }
  }

  /**
   * Genera documentación automática
   */
  async generateComponentDocs(name, description, code) {
    // Extrae props del código
    const propsMatch = code.match(/interface\s+\w+Props\s*{([^}]+)}/s);
    const props = propsMatch ? propsMatch[1].trim() : 'No props defined';

    return `# ${name}

## Descripción
${description}

## Props
\`\`\`typescript
${props}
\`\`\`

## Uso
\`\`\`jsx
import { ${name} } from '@/components/${name}'

<${name}
  // Props aquí
/>
\`\`\`

## Features
- ✨ Animaciones fluidas con Framer Motion
- 🎨 Diseño glassmorphism premium
- ♿ Accesibilidad completa
- 📱 Responsive design
- 🚀 Performance optimizado

## Ejemplos
Ver Storybook para ejemplos interactivos.
`;
  }

  /**
   * Genera Storybook story
   */
  async generateStorybookStory(name, _code) {
    return `import React from 'react'
import { ${name} } from './${name}'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ${name}>

export const Default: Story = {
  args: {
    // Default props
  },
}

export const WithCustomProps: Story = {
  args: {
    // Custom props
  },
}

export const Interactive: Story = {
  args: {
    // Interactive props
  },
  play: async ({ canvasElement }) => {
    // Interaction tests
  },
}
`;
  }

  // ============================================
  // 🏗️ GENERACIÓN DE PÁGINAS COMPLETAS
  // ============================================

  /**
   * Genera una página completa con múltiples componentes
   */
  async generateCompletePage({ pageName, description, sections = [], layout = 'default' }) {
    const components = [];

    // Genera cada sección como componente
    for (const section of sections) {
      const component = await this.generateComponent({
        name: `${pageName}${section.name}`,
        description: section.description,
        type: 'functional',
        features: section.features || [],
        designStyle: section.style || 'glassmorphism-futuristic',
      });

      components.push(component);
    }

    // Genera el layout de la página
    const pageCode = await this.generatePageLayout({
      pageName,
      components,
      layout,
    });

    // Genera assets de la página
    const pageAssets = await this.adobe.generateImage({
      prompt: `complete webpage design for ${pageName}, ${description}, modern, premium, glassmorphism style`,
      style: 'art',
      size: { width: 1920, height: 1080 },
      variations: 3,
    });

    return {
      pageName,
      code: pageCode,
      components,
      assets: pageAssets.images,
      routes: this.generateRoutes(pageName),
    };
  }

  async generatePageLayout({ pageName, components, layout }) {
    const componentImports = components
      .map((c) => `import { ${c.name} } from '@/components/${c.name}'`)
      .join('\n');

    const componentRenders = components.map((c) => `      <${c.name} />`).join('\n');

    return `import React from 'react'
import { motion } from 'framer-motion'
${componentImports}

/**
 * ${pageName} Page
 * Generated by AI Design Automation Engine
 */
const ${pageName}Page = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
    >
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ${pageName}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 space-y-12">
${componentRenders}
      </main>

      {/* Footer */}
      <footer className="backdrop-blur-xl bg-white/5 border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-white/60">
          <p>© 2025 FlowDistributor Supreme. AI-Powered.</p>
        </div>
      </footer>
    </motion.div>
  )
}

export default ${pageName}Page
`;
  }

  generateRoutes(pageName) {
    const routePath = `/${pageName.toLowerCase()}`;

    return {
      path: routePath,
      component: `${pageName}Page`,
      import: `const ${pageName}Page = lazy(() => import('@/pages/${pageName}Page'))`,
      route: `<Route path="${routePath}" element={<${pageName}Page />} />`,
    };
  }

  // ============================================
  // 🎨 OPTIMIZACIÓN Y ANÁLISIS
  // ============================================

  /**
   * Analiza y optimiza un componente existente
   */
  async optimizeComponent(code) {
    const prompt = `Analiza este componente React y proporciona optimizaciones:

${code}

Analiza:
1. Performance (memoization, lazy loading, virtual scrolling)
2. Accesibilidad (ARIA, keyboard nav, screen readers)
3. Bundle size (tree shaking, dynamic imports)
4. Code quality (hooks rules, best practices)
5. UX (loading states, error handling, feedback)

Proporciona el código optimizado completo.`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en optimización de React y performance.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 4000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.OPENAI_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let optimized = response.data.choices[0].message.content;
      optimized = optimized.replace(/```[a-z]*\n/g, '').replace(/```$/g, '');

      return optimized;
    } catch (_error) {
      return code;
    }
  }

  /**
   * Genera variaciones de diseño con IA
   */
  async generateDesignVariations(componentName, count = 5) {
    const component = this.generatedComponents.get(componentName);

    if (!component) {
      throw new Error(`Componente ${componentName} no encontrado`);
    }

    const variations = [];

    const styles = [
      'glassmorphism-futuristic',
      'neon-cyberpunk',
      'minimal-premium',
      'neumorphism',
      'brutalist-modern',
    ];

    for (let i = 0; i < count; i++) {
      const style = styles[i % styles.length];

      const variation = await this.generateComponent({
        name: `${componentName}Variant${i + 1}`,
        description: `Variation ${i + 1} of ${componentName}`,
        type: 'functional',
        features: [],
        designStyle: style,
        includeAnimations: true,
        includeTests: false,
      });

      variations.push(variation);
    }

    return variations;
  }

  // ============================================
  // 🚀 EXPORTACIÓN Y DEPLOYMENT
  // ============================================

  /**
   * Exporta todos los componentes generados
   */
  async exportAllComponents(_format = 'zip') {
    const components = Array.from(this.generatedComponents.values());

    const exports = {
      components: components.map((c) => ({
        name: c.name,
        code: c.code,
        tests: c.tests,
        docs: c.documentation,
        storybook: c.storybook,
      })),
      designSystem: await this.adobe.generateDesignSystem('GeneratedProject'),
      readme: this.generateProjectReadme(components),
    };

    return exports;
  }

  generateProjectReadme(components) {
    return `# AI-Generated Components

Este proyecto fue generado automáticamente por AI Design Automation Engine.

## Componentes Generados

${components.map((c) => `- **${c.name}**: ${c.documentation.split('\n')[3]}`).join('\n')}

## Instalación

\`\`\`bash
npm install
npm run dev
\`\`\`

## Testing

\`\`\`bash
npm run test
\`\`\`

## Storybook

\`\`\`bash
npm run storybook
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

---

*Generado con ❤️ por AI Design Automation Engine*
`;
  }

  // ============================================
  // 🛠️ UTILIDADES
  // ============================================

  getDefaultStructure(_name, _type) {
    return {
      props: [],
      state: [],
      hooks: ['useState'],
      dependencies: ['react'],
      children: [],
      events: [],
      animations: [],
    };
  }

  generateFallbackCode(structure) {
    return `import React from 'react'

const ${structure.name || 'Component'} = () => {
  return (
    <div className="p-6 backdrop-blur-xl bg-white/10 rounded-2xl">
      <h2 className="text-2xl font-bold">Component Placeholder</h2>
      <p>Este componente fue generado como fallback.</p>
    </div>
  )
}

export default ${structure.name || 'Component'}
`;
  }

  generateDefaultTests(name) {
    return `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ${name} } from './${name}'

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
`;
  }

  // ============================================
  // 📊 ESTADÍSTICAS
  // ============================================

  getGenerationStats() {
    return {
      totalComponents: this.generatedComponents.size,
      history: this.designHistory.length,
      config: this.config,
    };
  }
}

// Singleton instance
const aiDesignEngine = new AIDesignAutomationEngine();

export default AIDesignAutomationEngine;
export { aiDesignEngine };

/**
 * 🎯 EJEMPLO DE USO
 *
 * // Generar componente individual
 * const component = await aiDesignEngine.generateComponent({
 *   name: 'QuantumDashboard',
 *   description: 'Dashboard holográfico 3D con datos en tiempo real',
 *   features: ['real-time-data', '3d-visualization', 'ai-predictions'],
 *   designStyle: 'glassmorphism-futuristic',
 *   includeAnimations: true,
 *   includeTests: true
 * })
 *
 * // Generar página completa
 * const page = await aiDesignEngine.generateCompletePage({
 *   pageName: 'AnalyticsDashboard',
 *   description: 'Dashboard de analíticas premium',
 *   sections: [
 *     { name: 'Header', description: 'Header con navegación', features: [] },
 *     { name: 'KPIs', description: 'Tarjetas de KPIs animadas', features: [] },
 *     { name: 'Charts', description: 'Gráficas interactivas', features: [] }
 *   ]
 * })
 *
 * // Optimizar componente existente
 * const optimized = await aiDesignEngine.optimizeComponent(myComponentCode)
 *
 * // Generar variaciones
 * const variations = await aiDesignEngine.generateDesignVariations('MyComponent', 5)
 *
 * // Exportar todo
 * const exports = await aiDesignEngine.exportAllComponents('zip')
 */
