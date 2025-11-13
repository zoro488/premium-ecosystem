# 🔧 Solución: Archivos No Visibles en VS Code

## 🚨 Problema Identificado
Los archivos de FlowDistributor existen pero no aparecen en el explorador de VS Code.

## ✅ Soluciones

### 1️⃣ Verificar Filtros de VS Code

#### Opción A: Via Settings UI
1. Presiona `Ctrl + ,` para abrir Settings
2. Busca "Files: Exclude"
3. Verifica que no haya patrones excluyendo tus archivos
4. Busca "Search: Exclude"
5. Verifica los patrones de exclusión

#### Opción B: Via settings.json
```json
// .vscode/settings.json
{
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/dist": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  }
}
```

### 2️⃣ Refrescar Explorador de Archivos

```bash
# En PowerShell
# Refrescar workspace
code --reuse-window .

# O presiona F5 en VS Code
```

### 3️⃣ Verificar .gitignore
```bash
# Ver archivos ignorados
git status --ignored

# Si aparecen archivos importantes, editarlos en .gitignore
```

### 4️⃣ Extensiones que Pueden Ocultar Archivos

#### Deshabilitar temporalmente
1. `Ctrl + Shift + X` → Extensiones
2. Busca extensiones de "File Manager" o "File Utils"
3. Deshabilitar temporalmente

#### Extensiones comunes que filtran:
- **Project Manager**
- **File Utils**
- **Explorer Exclude**
- **Hide Files**

### 5️⃣ Comando Manual para Ver Archivos

```powershell
# Ver todos los archivos de FlowDistributor
Get-ChildItem -Recurse -Path ".\src\apps\FlowDistributor" | Select-Object FullName

# Contar líneas del archivo principal
(Get-Content ".\src\apps\FlowDistributor\FlowDistributor.jsx").Length
```

### 6️⃣ Abrir Archivo Directamente

```bash
# Abrir en VS Code
code "src/apps/FlowDistributor/FlowDistributor.jsx"
```

### 7️⃣ Verificar Workspace Settings

```json
// .vscode/settings.json
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/*/**": true,
    "**/.hg/store/**": true
  }
}
```

## 🎯 Comando de Diagnóstico Completo

```powershell
# Crear script de diagnóstico
@"
# 🔍 Diagnóstico de Archivos FlowDistributor

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📁 VERIFICACIÓN DE ARCHIVOS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Verificar existencia
Write-Host "`n1️⃣ Verificando estructura FlowDistributor..." -ForegroundColor Green
$fdPath = ".\src\apps\FlowDistributor"
if (Test-Path $fdPath) {
    Write-Host "✅ Directorio existe" -ForegroundColor Green

    # Listar archivos
    Write-Host "`n📂 Archivos encontrados:" -ForegroundColor Cyan
    Get-ChildItem -Path $fdPath -Recurse | Select-Object FullName, Length | Format-Table

    # Contar líneas del archivo principal
    $mainFile = "$fdPath\FlowDistributor.jsx"
    if (Test-Path $mainFile) {
        $lines = (Get-Content $mainFile).Length
        Write-Host "`n📊 FlowDistributor.jsx: $lines líneas" -ForegroundColor Green
    } else {
        Write-Host "❌ FlowDistributor.jsx NO encontrado" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Directorio NO existe" -ForegroundColor Red
}

# Verificar .gitignore
Write-Host "`n2️⃣ Verificando .gitignore..." -ForegroundColor Green
if (Test-Path ".gitignore") {
    Write-Host "Patrones que pueden estar ocultando archivos:" -ForegroundColor Yellow
    Select-String -Path ".gitignore" -Pattern "src|apps|FlowDistributor" | Select-Object Line
}

# Verificar VS Code settings
Write-Host "`n3️⃣ Verificando VS Code settings..." -ForegroundColor Green
if (Test-Path ".vscode\settings.json") {
    Write-Host "✅ Settings encontrado" -ForegroundColor Green
    Get-Content ".vscode\settings.json"
} else {
    Write-Host "⚠️  No hay settings.json personalizado" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ DIAGNÓSTICO COMPLETADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
"@ | Out-File -FilePath "diagnostico-archivos.ps1" -Encoding UTF8

# Ejecutar diagnóstico
.\diagnostico-archivos.ps1
```

## 🚀 Solución Rápida (Ejecutar Ahora)

```powershell
# 1. Refrescar VS Code
code --reuse-window .

# 2. Ver archivos directamente
explorer "src\apps\FlowDistributor"

# 3. Abrir archivo principal
code "src\apps\FlowDistributor\FlowDistributor.jsx"

# 4. Verificar estado
npm run lint
```

## 📝 Si Aún No Aparecen

### Último Recurso: Reiniciar Workspace
1. `Ctrl + Shift + P`
2. Escribir: "Developer: Reload Window"
3. Enter

### O Completamente Fresco
```powershell
# Cerrar VS Code completamente
taskkill /F /IM Code.exe

# Abrir nuevamente
code .
```

---

## 🎯 Resultado Esperado

Después de aplicar estas soluciones, deberías ver:

```
src/
└── apps/
    └── FlowDistributor/
        ├── FlowDistributor.jsx (9,878 líneas) ✅
        ├── FlowDistributor_2_0_Complete.jsx ✅
        ├── components/ ✅
        ├── hooks/ ✅
        ├── utils/ ✅
        ├── constants/ ✅
        └── context/ ✅
```

---

**Estado**: ✅ Soluciones Documentadas
**Fecha**: 22 de Octubre de 2025
