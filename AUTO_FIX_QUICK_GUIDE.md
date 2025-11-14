# 🛠️ Auto-Corrección Rápida - Guía de Uso

## Inicio Rápido

### Ver estado del sistema
```bash
npm run diagnose
```

### Aplicar correcciones manuales

```bash
# Problemas de conexión (Firebase, servicios)
npm run fix:connection

# Problemas de tipos TypeScript
npm run fix:types

# Limpiar cache completo
npm run fix:cache

# Todas las correcciones
npm run fix:all
```

## Workflow Automático

### Cuándo se ejecuta
- ⏰ **Cada 4 horas** automáticamente
- 🔘 **Manual** desde GitHub Actions UI
- 📤 **Push** a la rama `main`

### Qué hace
1. Ejecuta todos los tests
2. Si fallan, detecta el tipo de error
3. Aplica corrección específica
4. Re-ejecuta tests
5. Si pasan → Crea PR ✅
6. Si fallan 5 veces → Crea Issue ❌

## Tipos de Error

| Emoji | Tipo | Patrones | Corrección |
|-------|------|----------|------------|
| 🔌 | Conexión | ECONNREFUSED, ETIMEDOUT | Reiniciar servicios |
| 📝 | Tipos | TypeError, ReferenceError | Actualizar @types |
| ⏱️ | Timeout | timeout | Aumentar timeouts |
| ❓ | Desconocido | Otros | Limpiar cache |

## Ejecutar manualmente

### Desde GitHub
1. Ir a **Actions** → **🛠️ Auto-Corrección Inteligente**
2. Click en **Run workflow**
3. Seleccionar rama → **Run workflow**

### Desde línea de comandos
```bash
# Ejecutar workflow manualmente con gh CLI
gh workflow run "auto-fix-tests.yml"
```

## Ver resultados

### PRs creados
Buscar PRs con título: `🛠️ Auto-corrección aplicada (intento X/5)`

### Issues creados
Buscar issues con labels: `bug`, `auto-fix-failed`, `critical`

### Logs del workflow
```bash
# Ver últimas ejecuciones
gh run list --workflow=auto-fix-tests.yml --limit 5

# Ver logs de una ejecución
gh run view [RUN_ID] --log
```

## Archivos generados

```
test-diagnostics.json  # Diagnóstico de errores (temporal)
test-output.log        # Output de tests (temporal)
AUTO_FIX_REPORT.md    # Reporte de corrección (en PR)
```

## Solución de problemas

### Tests siguen fallando
```bash
# 1. Ver diagnóstico
npm run diagnose
cat test-diagnostics.json

# 2. Aplicar corrección manual
npm run fix:all

# 3. Ejecutar tests
npm test
```

### Workflow no se ejecuta
- Verificar permisos en Settings → Actions
- Verificar que el cron schedule está activo
- Verificar límites de GitHub Actions

### No se crea PR/Issue
- Verificar permisos de write
- Verificar GITHUB_TOKEN
- Ver logs del workflow

## Comandos útiles

```bash
# Ver workflow file
cat .github/workflows/auto-fix-tests.yml

# Ver script de diagnóstico
cat scripts/diagnose-tests.js

# Ver documentación completa
cat AUTO_FIX_SYSTEM_DOCS.md

# Ejecutar tests localmente
npm test
```

## Enlaces

- 📖 **Documentación completa**: [AUTO_FIX_SYSTEM_DOCS.md](./AUTO_FIX_SYSTEM_DOCS.md)
- 🔧 **Workflow file**: [.github/workflows/auto-fix-tests.yml](.github/workflows/auto-fix-tests.yml)
- 🔍 **Script diagnóstico**: [scripts/diagnose-tests.js](scripts/diagnose-tests.js)

---

💡 **Tip**: Ejecuta `npm run diagnose` antes de hacer push para detectar problemas localmente.
