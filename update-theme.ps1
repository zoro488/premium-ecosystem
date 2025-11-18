#!/usr/bin/env pwsh

# Script para reemplazar colores rosa/morado por tema negro ultra premium

Write-Host "🎨 Actualizando tema a Ultra Premium Black..." -ForegroundColor Cyan

$replacements = @{
    # Gradientes rosa/morado → Negro con acentos plateados
    'from-purple-500 to-pink-500' = 'from-zinc-800 via-zinc-700 to-zinc-800'
    'from-pink-500 to-rose-500' = 'from-zinc-800 via-zinc-700 to-zinc-800'
    'from-purple-600 to-pink-600' = 'from-zinc-800 via-zinc-700 to-zinc-800'
    'from-purple-400 to-pink-400' = 'from-zinc-300 via-zinc-100 to-zinc-300'
    'from-purple-500 via-pink-500 to-rose-500' = 'from-zinc-800 via-zinc-700 to-zinc-900'

    # Backgrounds rosa/morado → Negro
    'bg-purple-500' = 'bg-zinc-800'
    'bg-pink-500' = 'bg-zinc-800'
    'bg-purple-600' = 'bg-zinc-900'
    'bg-pink-600' = 'bg-zinc-900'
    'bg-purple-400' = 'bg-zinc-700'
    'bg-pink-400' = 'bg-zinc-700'

    # Texto rosa/morado → Blanco/Gris claro
    'text-purple-400' = 'text-zinc-200'
    'text-pink-400' = 'text-zinc-200'
    'text-purple-500' = 'text-white'
    'text-pink-500' = 'text-white'

    # Bordes rosa/morado → Gris oscuro
    'border-purple-500' = 'border-zinc-700'
    'border-pink-500' = 'border-zinc-700'
    'border-purple-400' = 'border-zinc-600'
    'border-pink-400' = 'border-zinc-600'

    # Efectos y opacidades
    'purple-500/20' = 'zinc-800/20'
    'pink-500/20' = 'zinc-800/20'
    'purple-500/30' = 'zinc-700/30'
    'pink-500/30' = 'zinc-700/30'
    'purple-500/10' = 'zinc-900/10'
    'pink-500/10' = 'zinc-900/10'

    # Shadows
    'shadow-purple-500' = 'shadow-zinc-800'
    'shadow-pink-500' = 'shadow-zinc-800'

    # Hover states
    'hover:border-purple-500' = 'hover:border-zinc-600'
    'hover:border-pink-500' = 'hover:border-zinc-600'
    'hover:bg-purple-500' = 'hover:bg-zinc-800'
    'hover:bg-pink-500' = 'hover:bg-zinc-800'

    # Focus states
    'focus:border-purple-500' = 'focus:border-zinc-600'
    'focus:border-pink-500' = 'focus:border-zinc-600'
    'focus:ring-purple-500' = 'focus:ring-zinc-700'
    'focus:ring-pink-500' = 'focus:ring-zinc-700'
}

# Archivos a actualizar
$files = @(
    'src\components\premium\*.tsx',
    'src\components\premium\*.jsx',
    'src\apps\FlowDistributor\chronos-system\components\**\*.tsx',
    'src\utils\*.jsx',
    'src\App.jsx'
)

$totalReplacements = 0

foreach ($pattern in $files) {
    $matchingFiles = Get-ChildItem -Path $pattern -Recurse -ErrorAction SilentlyContinue

    foreach ($file in $matchingFiles) {
        Write-Host "  📝 Procesando: $($file.Name)" -ForegroundColor Yellow

        $content = Get-Content $file.FullName -Raw
        $originalContent = $content

        foreach ($old in $replacements.Keys) {
            $new = $replacements[$old]
            if ($content -match [regex]::Escape($old)) {
                $content = $content -replace [regex]::Escape($old), $new
                $totalReplacements++
            }
        }

        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "    ✅ Actualizado" -ForegroundColor Green
        }
    }
}

Write-Host "`n✨ Tema actualizado exitosamente!" -ForegroundColor Green
Write-Host "📊 Total de reemplazos: $totalReplacements" -ForegroundColor Cyan
