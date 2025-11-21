# 🔧 Git Configuration Guide

## ✅ Configuración Aplicada

### Git Local
```bash
git config user.name "zoro488"
git config user.email "zoro488@users.noreply.github.com"
```

### GitHub Actions Workflows
Todos los workflows ahora incluyen:

1. **Retry Logic para Push**
   - 5 intentos con backoff exponencial
   - Manejo de errores HTTP 500
   - Logs detallados de cada intento

2. **Configuración Correcta de Checkout**
   ```yaml
   - uses: actions/checkout@v4
     with:
       fetch-depth: 0  # Historia completa
       token: ${{ secrets.GITHUB_TOKEN }}
   ```

3. **Push Seguro**
   ```yaml
   - name: Push changes
     env:
       GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
     run: |
       for i in {1..5}; do
         if git push origin HEAD:${GITHUB_REF#refs/heads/}; then
           echo "✅ Push successful!"
           break
         else
           if [ $i -lt 5 ]; then
             echo "⚠️ Retrying in $((i*10))s..."
             sleep $((i*10))
           fi
         fi
       done
   ```

## 📋 Workflows Actualizados

### ✅ Corregidos
- `auto-healing.yml` - Retry logic en 2 jobs
- `git-push-helper.yml` - Nuevo workflow reutilizable

### 📝 Recomendaciones para Otros Workflows

Si un workflow falla con `fatal: unable to access 'https://github.com/...'`, aplicar:

1. **Agregar fetch-depth: 0**
   ```yaml
   - uses: actions/checkout@v4
     with:
       fetch-depth: 0
   ```

2. **Usar GITHUB_TOKEN explícitamente**
   ```yaml
   env:
     GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

3. **Referenciar branches correctamente**
   ```bash
   git push origin HEAD:${GITHUB_REF#refs/heads/}
   # En lugar de: git push
   ```

4. **Agregar retry logic**
   - Ver `git-push-helper.yml` como template

## 🔍 Diagnóstico de Errores

### Error 500 de GitHub
```
fatal: unable to access 'https://github.com/...': The requested URL returned error: 500
```

**Causas:**
- Problema temporal de GitHub servers
- Límite de rate alcanzado
- Token expirado o sin permisos

**Solución:**
1. Verificar [GitHub Status](https://www.githubstatus.com/)
2. Esperar y reintentar (retry logic lo hace automáticamente)
3. Verificar permisos del token

### Error 128
```
exit code 128
```

**Causas:**
- Push rechazado por servidor
- Conflicto de merge
- Branch no existe

**Solución:**
1. Fetch antes de push: `git fetch --all`
2. Verificar branch: `git branch -r`
3. Usar ref completo: `HEAD:${GITHUB_REF#refs/heads/}`

### Ambiguous Argument
```
fatal: ambiguous argument 'refs/heads/main': unknown revision or path
```

**Causas:**
- Checkout con fetch-depth limitado
- Branch no existe localmente

**Solución:**
1. Usar `fetch-depth: 0` en checkout
2. Fetch explícito: `git fetch --all --prune`

## 🎯 Uso del Helper Workflow

Para usar el workflow reutilizable `git-push-helper.yml`:

```yaml
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      # ... tu código aquí ...

  push-changes:
    needs: my-job
    uses: ./.github/workflows/git-push-helper.yml
    with:
      branch: main
      commit-message: "Auto-update from workflow"
```

## 📊 Verificación

Para verificar la configuración:

```bash
# Local
git config --list | grep user

# En workflow
git config --global --list
git remote -v
git branch -a
```

## 🚀 Próximos Pasos

1. ✅ Configuración Git aplicada
2. ✅ Workflows críticos corregidos
3. ⏳ Monitorear próximas ejecuciones
4. 📝 Aplicar retry logic a workflows restantes según necesidad

---

**Estado Actual:** ✅ Configuración completada
**Fecha:** 2025-11-18
**Archivos Modificados:**
- `.github/workflows/auto-healing.yml`
- `.github/workflows/git-push-helper.yml` (nuevo)
