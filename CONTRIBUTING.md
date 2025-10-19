# Guía de Contribución - Premium Ecosystem

¡Gracias por tu interés en contribuir a Premium Ecosystem! Este documento te guiará a través del proceso.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Commits y Pull Requests](#commits-y-pull-requests)
- [Testing](#testing)
- [Reportar Bugs](#reportar-bugs)

## 🤝 Código de Conducta

Este proyecto adopta un código de conducta de colaboración respetuosa y profesional. Se espera que todos los contribuyentes:

- Sean respetuosos y constructivos en sus comentarios
- Acepten críticas constructivas de manera profesional
- Se enfoquen en lo mejor para la comunidad
- Muestren empatía hacia otros miembros de la comunidad

## 🚀 Cómo Contribuir

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
git clone https://github.com/tu-usuario/premium-ecosystem.git
cd premium-ecosystem
```

### 2. Configurar el Entorno

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 3. Crear una Rama

```bash
# Crear rama desde main
git checkout -b feature/mi-nueva-funcionalidad
# o
git checkout -b fix/arreglar-bug
```

### Convención de Nombres de Ramas

- `feature/` - Para nuevas funcionalidades
- `fix/` - Para arreglos de bugs
- `refactor/` - Para refactorización de código
- `docs/` - Para cambios en documentación
- `test/` - Para agregar o mejorar tests
- `chore/` - Para tareas de mantenimiento

## 🔄 Proceso de Desarrollo

### Workflow Recomendado

1. **Asignar o Crear un Issue**
   - Antes de empezar, crea o asígnate un issue
   - Discute cambios grandes antes de implementar

2. **Desarrollar Localmente**
   - Escribe código siguiendo nuestros estándares
   - Escribe tests para tu código
   - Asegúrate de que todo funcione

3. **Commit tus Cambios**
   - Usa commits semánticos (ver abajo)
   - Commits pequeños y atómicos
   - Mensajes claros y descriptivos

4. **Push y Crear PR**
   - Push a tu fork
   - Crea Pull Request usando el template
   - Llena toda la información requerida

5. **Code Review**
   - Responde a comentarios
   - Realiza cambios solicitados
   - Espera aprobación

6. **Merge**
   - El maintainer hará merge cuando esté aprobado
   - La rama se eliminará automáticamente

## 📝 Estándares de Código

### JavaScript/React

```javascript
// ✅ BIEN - Componente funcional con hooks
import { useState, useEffect } from 'react';

const MyComponent = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(userId).then(setData);
  }, [userId]);

  return <div>{data?.name}</div>;
};

// ❌ MAL - Mezcla de estilos
function myComponent(props) {
  var data = null;
  // código imperativo...
}
```

### Principios

- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It
- **Single Responsibility**: Un componente, una responsabilidad
- **Composition over Inheritance**: Preferir composición

### ESLint

```bash
# Ejecutar linter
npm run lint

# Fix automático
npm run lint -- --fix
```

### Prettier

El código se formatea automáticamente con Prettier al guardar. Configuración en `.prettierrc`.

### Estructura de Archivos

```
src/
├── apps/
│   └── AppName/
│       ├── AppName.jsx       # Componente principal
│       ├── components/       # Componentes específicos
│       └── utils/            # Utilidades específicas
├── components/
│   ├── shared/               # Componentes compartidos
│   └── ui/                   # Componentes UI base
├── hooks/                    # Custom hooks
├── services/                 # Servicios y APIs
├── utils/                    # Utilidades globales
└── config/                   # Configuraciones
```

## 💬 Commits y Pull Requests

### Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(scope): mensaje corto

[mensaje detallado opcional]

[footer opcional]
```

#### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Arreglo de bug
- `docs`: Cambios en documentación
- `style`: Formateo, punto y coma faltantes, etc.
- `refactor`: Refactorización de código
- `test`: Agregar o corregir tests
- `chore`: Mantenimiento, dependencias, etc.
- `perf`: Mejoras de performance
- `ci`: Cambios en CI/CD

#### Ejemplos

```bash
feat(apollo): agregar detección de objetos con IA
fix(flow): corregir cálculo de inventario
docs(readme): actualizar instrucciones de instalación
refactor(synapse): simplificar lógica de chat
test(shadow): agregar tests para gestión de wallets
chore(deps): actualizar dependencias
```

### Pull Request Guidelines

1. **Título Descriptivo**
   - Usa Conventional Commits
   - Sé específico

2. **Descripción Completa**
   - Usa el template proporcionado
   - Explica el "por qué", no solo el "qué"
   - Agrega screenshots si es visual

3. **Tamaño Manejable**
   - PRs pequeños se revisan más rápido
   - Divide funcionalidades grandes

4. **Tests**
   - Agrega tests para nuevo código
   - Asegura que tests existentes pasen

5. **Documentación**
   - Actualiza docs si es necesario
   - Comenta código complejo

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Ejecutar tests
npm run test

# Modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

```javascript
// Ejemplo de test
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './utils';

describe('calculateTotal', () => {
  it('should sum all values', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });
});
```

### E2E Tests (Playwright)

```bash
# Ejecutar E2E
npm run test:e2e

# Modo UI
npm run test:e2e:ui

# Ver reporte
npm run test:e2e:report
```

```javascript
// Ejemplo de E2E test
import { test, expect } from '@playwright/test';

test('navigation to FlowDistributor works', async ({ page }) => {
  await page.goto('/');
  await page.click('text=FlowDistributor');
  await expect(page).toHaveURL('/flow');
});
```

### Cobertura Mínima

- Unit tests: 80% de cobertura
- E2E tests: Flujos principales cubiertos

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifica que no sea un issue duplicado
2. Asegúrate de estar en la última versión
3. Reproduce el bug de manera consistente

### Información a Incluir

- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs. actual
- Screenshots o videos (si aplica)
- Entorno (OS, browser, versión Node)
- Logs de error

### Usar el Template

Usa el [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.yml) al crear el issue.

## 💡 Sugerir Mejoras

### Feature Requests

- Describe el problema que resuelve
- Explica tu solución propuesta
- Considera alternativas
- Agrega mockups si es posible

Usa el [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.yml).

## 📚 Recursos Adicionales

- [Documentación del Proyecto](README.md)
- [Guía de APIs](API_SETUP_GUIDE.md)
- [Security Policy](SECURITY.md)
- [GitHub Discussions](https://github.com/yourusername/premium-ecosystem/discussions)

## ❓ Preguntas

Si tienes preguntas:

1. Revisa la documentación
2. Busca en issues cerrados
3. Pregunta en [Discussions](https://github.com/yourusername/premium-ecosystem/discussions)
4. Contacta a los maintainers

## 🎉 Reconocimiento

Todos los contribuyentes serán agregados al README. ¡Gracias por tu contribución!

---

**Happy Coding!** 🚀
