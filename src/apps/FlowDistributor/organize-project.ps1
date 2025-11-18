# Script para organizar y copiar solo los archivos relevantes del proyecto FlowDistributor
# Excluye archivos de documentación markdown y archivos de prueba/demo innecesarios

$sourceDir = Get-Location
$targetDir = Join-Path $sourceDir "FlowDistributor-Clean"

# Limpiar directorio destino si existe
if (Test-Path $targetDir) {
  Write-Host "🗑️ Limpiando directorio anterior..." -ForegroundColor Yellow
  Remove-Item -Path $targetDir -Recurse -Force
}

# Crear estructura de directorios básica
$directories = @(
  "src",
  "src\config",
  "src\services",
  "components",
  "services",
  "utils",
  "styles",
  "hooks",
  "stores",
  "types",
  "constants",
  "shared",
  "data",
  "analysis",
  "public"
)

foreach ($dir in $directories) {
  $fullPath = Join-Path $targetDir $dir
  New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
}

# Archivos de configuración esenciales
$essentialFiles = @(
  "package.json",
  "vite.config.ts",
  "tsconfig.json",
  "tsconfig.node.json",
  "tailwind.config.js",
  ".eslintrc.cjs",
  ".prettierrc.js",
  ".gitignore",
  ".env.example"
)

# Copiar archivos de configuración
foreach ($file in $essentialFiles) {
  $sourcePath = Join-Path $sourceDir $file
  if (Test-Path $sourcePath) {
    Copy-Item -Path $sourcePath -Destination (Join-Path $targetDir $file) -Force
    Write-Host "✓ Copiado: $file" -ForegroundColor Green
  }
}

# Copiar archivo principal de la aplicación
$mainFiles = @(
  "FlowDistributor.jsx",
  "index.html"
)

foreach ($file in $mainFiles) {
  $sourcePath = Join-Path $sourceDir $file
  if (Test-Path $sourcePath) {
    Copy-Item -Path $sourcePath -Destination (Join-Path $targetDir $file) -Force
    Write-Host "✓ Copiado: $file" -ForegroundColor Green
  }
}

# Copiar src (TypeScript/Firebase)
$srcPath = Join-Path $sourceDir "src"
if (Test-Path $srcPath) {
  Get-ChildItem -Path $srcPath -Recurse -Include "*.ts", "*.tsx", "*.css" | ForEach-Object {
    $relativePath = $_.FullName.Substring($sourceDir.Path.Length + 1)
    $destPath = Join-Path $targetDir $relativePath
    $destDir = Split-Path -Parent $destPath

    if (-not (Test-Path $destDir)) {
      New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }

    Copy-Item -Path $_.FullName -Destination $destPath -Force
    Write-Host "✓ Copiado: $relativePath" -ForegroundColor Cyan
  }
}

# Función para copiar directorios con filtros, evitando duplicación
function Copy-ProjectDirectory {
  param(
    [string]$dirName,
    [string[]]$extensions = @("*.jsx", "*.js", "*.tsx", "*.ts", "*.css"),
    [string]$targetSubDir = ""
  )

  $sourcePath = Join-Path $sourceDir $dirName
  if (Test-Path $sourcePath) {
    Get-ChildItem -Path $sourcePath -Recurse -Include $extensions | ForEach-Object {
      # Calcular ruta relativa desde el directorio fuente específico
      $relativePath = $_.FullName.Substring($sourcePath.Length + 1)

      # Determinar ruta destino
      if ($targetSubDir) {
        $destPath = Join-Path $targetDir (Join-Path $targetSubDir $relativePath)
      }
      else {
        $destPath = Join-Path $targetDir (Join-Path $dirName $relativePath)
      }

      $destDir = Split-Path -Parent $destPath

      if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
      }

      Copy-Item -Path $_.FullName -Destination $destPath -Force

      # Mostrar ruta más limpia
      $displayPath = if ($targetSubDir) {
        Join-Path $targetSubDir $relativePath
      }
      else {
        Join-Path $dirName $relativePath
      }
      Write-Host "✓ Copiado: $displayPath" -ForegroundColor Cyan
    }
  }
}

# Copiar directorios de código principales (no FlowDistributor completo)
$codeDirs = @(
  "components",
  "services",
  "utils",
  "styles",
  "hooks",
  "stores",
  "types",
  "constants",
  "shared"
)

foreach ($dir in $codeDirs) {
  Write-Host "`n📂 Procesando: $dir" -ForegroundColor Yellow
  Copy-ProjectDirectory -dirName $dir
}

# Copiar directorios adicionales importantes
$additionalDirs = @("data", "analysis", "core", "design-system")
foreach ($dir in $additionalDirs) {
  if (Test-Path (Join-Path $sourceDir $dir)) {
    Write-Host "`n📂 Procesando: $dir" -ForegroundColor Yellow
    Copy-ProjectDirectory -dirName $dir
  }
}

# Copiar animaciones CSS importantes
$animationFiles = @(
  "animations.css",
  "cinematicAnimations.css"
)

foreach ($file in $animationFiles) {
  $sourcePath = Join-Path $sourceDir $file
  if (Test-Path $sourcePath) {
    Copy-Item -Path $sourcePath -Destination (Join-Path $targetDir $file) -Force
    Write-Host "✓ Copiado: $file" -ForegroundColor Green
  }
}

# Crear archivo README en la carpeta limpia
$readmeContent = @"
# FlowDistributor - Clean Version

Esta carpeta contiene solo los archivos esenciales y en uso del proyecto FlowDistributor.

## Estructura del Proyecto

- **/src** - Código fuente principal (TypeScript/Firebase)
- **/components** - Componentes React reutilizables
- **/services** - Servicios y lógica de negocio
- **/utils** - Utilidades y helpers
- **/styles** - Estilos CSS y animaciones
- **/hooks** - Custom React hooks
- **/stores** - Gestión de estado (Zustand)
- **/types** - Definiciones TypeScript
- **/constants** - Constantes de la aplicación
- **/shared** - Componentes compartidos
- **/data** - Datos y configuraciones
- **/analysis** - Análisis y reportes

## Archivos Excluidos

Se han excluido:
- Archivos de documentación Markdown (*.md)
- Archivos de análisis y demo
- Archivos duplicados o en desuso
- Imágenes y GIFs de documentación
- Módulos de Node (node_modules)

## Instalación

``````bash
npm install
``````

## Desarrollo

``````bash
npm run dev
``````

## Build

``````bash
npm run build
``````

Generado: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

Set-Content -Path (Join-Path $targetDir "README.md") -Value $readmeContent -Encoding UTF8

Write-Host "`n✅ Proyecto limpio creado exitosamente en: FlowDistributor-Clean" -ForegroundColor Green
Write-Host "📊 Archivos copiados. Verifica el contenido antes de usar." -ForegroundColor Yellow
