# 🛠️ Sistema de Auto-Corrección Inteligente

## 📋 Descripción General

El Sistema de Auto-Corrección Inteligente es una herramienta automatizada que monitorea, detecta y corrige automáticamente fallos en los tests del ecosistema premium.

## ✨ Características Principales

### 🔄 Ejecución Automática
- ⏰ Se ejecuta automáticamente cada 4 horas
- 🎯 Puede ejecutarse manualmente desde GitHub Actions
- 🚀 Se activa en cada push a la rama `main`

### 🔍 Detección Inteligente de Errores
El sistema detecta y clasifica 4 tipos de errores:

1. **🔌 Errores de Conexión** (`connection`)
   - ECONNREFUSED
   - ETIMEDOUT
   - ENOTFOUND

2. **📝 Errores de Tipos** (`types`)
   - TypeError
   - ReferenceError
   - SyntaxError

3. **⏱️ Errores de Timeout** (`timeout`)
   - Timeouts en tests
   - Timeouts en operaciones asíncronas

4. **❓ Errores Desconocidos** (`unknown`)
   - Cualquier otro tipo de error no clasificado

### 🛠️ Correcciones Automáticas

#### Para Errores de Conexión
```bash
# Reinicia servicios
pkill -f firebase
pkill -f node
firebase emulators:start --only firestore
```

#### Para Errores de Tipos
```bash
# Actualiza dependencias de tipos
npm install -D @types/node@latest @types/react@latest
npm install --force
```

#### Para Errores de Timeout
```bash
# Aumenta timeouts en vitest.config.js
testTimeout: 30000 (30 segundos)
```

#### Para Errores Desconocidos
```bash
# Limpieza completa
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 🔁 Sistema de Reintentos
- **Intentos**: 5 máximo
- **Estrategia**: Matrix strategy en paralelo
- **Timeout**: 30 minutos por job

### 📊 Resultados

#### ✅ En Caso de Éxito
- Se genera un reporte: `AUTO_FIX_REPORT.md`
- Se crea automáticamente un Pull Request con:
  - Título descriptivo
  - Resumen de la corrección aplicada
  - Número de intentos necesarios
  - Tipo de error detectado
  - Link al reporte completo

#### ❌ En Caso de Fallo
- Después de 5 intentos fallidos, se crea automáticamente un Issue con:
  - Label: `bug`, `auto-fix-failed`, `critical`
  - Descripción del problema
  - Acciones intentadas
  - Link a los logs del workflow

## 🚀 Uso

### Scripts Disponibles

```bash
# Diagnosticar problemas en tests
npm run diagnose

# Corregir problemas de conexión
npm run fix:connection

# Actualizar tipos
npm run fix:types

# Limpiar cache y reinstalar
npm run fix:cache

# Ejecutar todas las correcciones
npm run fix:all
```

### Ejecución Manual

#### Desde GitHub Actions:
1. Ve a **Actions** en GitHub
2. Selecciona **🛠️ Auto-Corrección Inteligente**
3. Click en **Run workflow**
4. Selecciona la rama
5. Click en **Run workflow**

#### Desde la línea de comandos:
```bash
# Usando GitHub CLI
gh workflow run "auto-fix-tests.yml"
```

## 📁 Archivos del Sistema

### Workflow Principal
**Ubicación**: `.github/workflows/auto-fix-tests.yml`

Contiene toda la lógica de:
- Detección de errores
- Aplicación de correcciones
- Creación de PRs e Issues
- Sistema de reintentos

### Script de Diagnóstico
**Ubicación**: `scripts/diagnose-tests.cjs`

Script Node.js que:
- Ejecuta los tests
- Captura y analiza el output
- Genera un reporte JSON
- Proporciona sugerencias

**Output**: `test-diagnostics.json`

Ejemplo de output:
```json
{
  "timestamp": "2025-11-13T21:08:38.256Z",
  "errors": ["connection"],
  "suggestions": [
    "Reiniciar servicios (Firebase Emulator, etc.)"
  ],
  "status": "failure"
}
```

## 🔐 Permisos Requeridos

El workflow necesita los siguientes permisos:
- `contents: write` - Para hacer commits
- `pull-requests: write` - Para crear PRs
- `issues: write` - Para crear issues

## ⚙️ Configuración

### Modificar Frecuencia de Ejecución

Edita el cron en `.github/workflows/auto-fix-tests.yml`:

```yaml
schedule:
  - cron: '0 */4 * * *'  # Cada 4 horas
```

Ejemplos:
- Cada hora: `'0 * * * *'`
- Cada 6 horas: `'0 */6 * * *'`
- Cada día a las 2 AM: `'0 2 * * *'`

### Ajustar Timeouts

Modifica el timeout en el workflow:

```yaml
timeout-minutes: 30  # Ajusta según necesidad
```

### Cambiar Número de Reintentos

Modifica la matriz en el workflow:

```yaml
strategy:
  matrix:
    retry: [1, 2, 3, 4, 5]  # Ajusta el número de intentos
```

## 📈 Monitoreo

### Ver Histórico de Ejecuciones
1. Ve a **Actions** en GitHub
2. Selecciona **🛠️ Auto-Corrección Inteligente**
3. Revisa el histórico de runs

### Revisar PRs Creados
- Busca PRs con título: `🛠️ Auto-corrección aplicada (intento X/5)`

### Revisar Issues Creados
- Busca issues con labels: `bug`, `auto-fix-failed`, `critical`

## 🎯 Criterios de Éxito

El sistema cumple con todos los objetivos:
- ✅ Ejecuta tests automáticamente cada 4 horas
- ✅ Detecta 4 tipos de error (conexión, tipos, timeout, desconocido)
- ✅ Aplica corrección específica según el error
- ✅ Reintenta hasta 5 veces
- ✅ Crea PR si corrección exitosa
- ✅ Crea issue si falla después de 5 intentos

## 🔧 Solución de Problemas

### El workflow no se ejecuta
- Verifica que el archivo esté en `.github/workflows/`
- Revisa los permisos del repositorio
- Verifica que el cron esté correctamente configurado

### Las correcciones no funcionan
- Revisa los logs del workflow
- Verifica que las dependencias estén instaladas
- Asegúrate de que los scripts tengan permisos de ejecución

### No se crean PRs ni Issues
- Verifica que `GITHUB_TOKEN` tenga los permisos necesarios
- Revisa que la acción `peter-evans/create-pull-request` esté actualizada
- Verifica que `gh` CLI esté disponible en el runner

## 📚 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cron Syntax](https://crontab.guru/)
- [GitHub CLI](https://cli.github.com/)

## 🤝 Contribuciones

Para mejorar el sistema:
1. Identifica nuevos patrones de error
2. Añade nuevas correcciones específicas
3. Mejora la detección de errores
4. Optimiza los tiempos de ejecución

## 📝 Licencia

Este sistema es parte del Premium Ecosystem y sigue la misma licencia del proyecto principal.

---

🤖 **Sistema de Auto-Corrección Inteligente v1.0**
