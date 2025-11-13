# 🛠️ Guía del Sistema de Auto-Corrección de Tests

## 📋 Descripción General

El Sistema de Auto-Corrección de Tests es un workflow automatizado que:
- ✅ Ejecuta tests automáticamente
- ✅ Detecta el tipo de error si fallan
- ✅ Aplica corrección específica según el tipo
- ✅ Re-ejecuta hasta 5 veces
- ✅ Crea PR solo si tests pasan al 100%
- ✅ Crea issue si falla después de 5 intentos

## 🚀 Activación del Workflow

El workflow se activa automáticamente en las siguientes situaciones:

1. **Push a ramas principales**: `main` o `develop`
2. **Schedule**: Cada 4 horas (cron: `0 */4 * * *`)
3. **Manual**: Mediante workflow_dispatch en GitHub Actions

## 🔍 Tipos de Errores Detectados

### 1. Error de Conexión
**Síntoma**: `ECONNREFUSED` en los logs de test

**Corrección Automática**:
- Reinicia servicios
- Espera 5 segundos para estabilización

### 2. Error de Tipos (TypeError)
**Síntoma**: `TypeError` en los logs de test

**Corrección Automática**:
- Fuerza reinstalación de dependencias (`npm install --force`)
- Actualiza tipos de Node.js (`npm install -D @types/node@latest`)

### 3. Error Desconocido
**Síntoma**: Cualquier otro error

**Acción**:
- Marca para revisión manual
- Crea issue después del 5to intento fallido

## 📊 Script de Diagnóstico

### Uso Manual

```bash
# Ejecutar diagnóstico de tests
npm run diagnose

# Ejecutar diagnóstico y tests
npm run fix:auto
```

### Resultado

El script genera un archivo `diagnostic-result.json` con la siguiente estructura:

```json
{
  "success": true | false,
  "type": "connection" | "type" | "unknown",
  "fix": "restart-emulator" | "update-deps" | "manual"
}
```

## 🔄 Flujo de Trabajo

```
┌─────────────────────┐
│  Trigger Workflow   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Install Dependencies│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Run Tests (1/5)   │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
 [PASS]      [FAIL]
     │           │
     │           ▼
     │   ┌─────────────┐
     │   │ Analyze Error│
     │   └──────┬──────┘
     │          │
     │          ▼
     │   ┌─────────────┐
     │   │ Apply Fix   │
     │   └──────┬──────┘
     │          │
     │          ▼
     │   ┌─────────────┐
     │   │  Retry (2/5)│
     │   └──────┬──────┘
     │          │
     │     [If retry < 5]
     │          │
     ▼          ▼
┌─────────────────────┐
│    Create PR        │
└─────────────────────┘

     [If retry == 5 && FAIL]
           │
           ▼
┌─────────────────────┐
│   Create Issue      │
└─────────────────────┘
```

## 📝 Estructura de Archivos

```
.github/workflows/
  └── auto-fix-tests.yml        # Workflow principal

scripts/
  └── diagnose-tests.js          # Script de diagnóstico

package.json                     # Scripts npm agregados
  - diagnose                     # Ejecuta diagnóstico
  - fix:auto                     # Diagnóstico + tests
```

## 🔒 Seguridad

El workflow incluye permisos explícitos de GitHub Actions:

```yaml
permissions:
  contents: write        # Para checkout y commits
  pull-requests: write   # Para crear PRs
  issues: write          # Para crear issues
```

## 📋 Pull Request Automático

Cuando los tests pasan exitosamente después de una corrección, se crea automáticamente un PR con:

- **Título**: `🛠️ Auto-corrección aplicada (Intento X)`
- **Contenido**:
  - Tipo de error detectado
  - Corrección aplicada
  - Número de intento
  - ID del workflow run

## 🚨 Issue Automático

Si todos los 5 intentos fallan, se crea un issue con:

- **Etiquetas**: `bug`, `tests`, `high-priority`
- **Contenido**:
  - ID del workflow run
  - Tipo de error
  - Fecha
  - Enlace a los logs completos

## 🧪 Testing Local

Para probar el sistema localmente:

```bash
# 1. Ejecutar diagnóstico
npm run diagnose

# 2. Ver resultado
cat diagnostic-result.json

# 3. Ejecutar tests manualmente
npm run test:run
```

## 📊 Monitoreo

Para monitorear el workflow:

1. Ve a **Actions** en GitHub
2. Busca el workflow "🛠️ Auto-Corrección de Tests"
3. Revisa los runs recientes
4. Verifica PRs e issues creados

## ⚙️ Configuración Avanzada

### Cambiar frecuencia del schedule

Edita el cron en `auto-fix-tests.yml`:

```yaml
schedule:
  - cron: '0 */4 * * *'  # Cada 4 horas (actual)
  # - cron: '0 0 * * *'  # Diario a medianoche
  # - cron: '0 */2 * * *' # Cada 2 horas
```

### Agregar nuevos tipos de error

Edita `scripts/diagnose-tests.js`:

```javascript
// Agregar nueva detección
if (output.includes('NuevoError')) {
  return { success: false, type: 'nuevo', fix: 'nueva-correccion' };
}
```

Luego agrega el paso de corrección en `auto-fix-tests.yml`:

```yaml
- name: Auto-corregir nuevo error
  if: steps.analyze.outputs.error_type == 'nuevo'
  run: |
    echo "🔧 Aplicando nueva corrección..."
    # Comandos de corrección
```

## 📚 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Matrix Strategy](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
- [peter-evans/create-pull-request](https://github.com/peter-evans/create-pull-request)

## 🤝 Contribución

Para mejorar el sistema:

1. Identifica el tipo de error que quieres agregar
2. Actualiza `diagnose-tests.js` con la detección
3. Agrega el paso de corrección en `auto-fix-tests.yml`
4. Prueba localmente con `npm run diagnose`
5. Crea un PR con tus cambios

---

**Versión**: 1.0.0  
**Última actualización**: 2025-11-13  
**Mantenedor**: Premium Ecosystem Team
