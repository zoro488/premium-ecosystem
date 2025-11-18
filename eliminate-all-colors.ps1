# 🎨 ELIMINACION TOTAL DE COLORES NO NEGROS
# Script para convertir TODO a escala de zinc/black

Write-Host "🎯 ELIMINANDO TODOS LOS COLORES NO NEGROS..." -ForegroundColor Cyan

$replacements = @(
    # BLUE variants
    @{ From = 'bg-blue-50'; To = 'bg-zinc-900' },
    @{ From = 'bg-blue-100'; To = 'bg-zinc-800' },
    @{ From = 'bg-blue-200'; To = 'bg-zinc-700' },
    @{ From = 'bg-blue-300'; To = 'bg-zinc-600' },
    @{ From = 'bg-blue-400'; To = 'bg-zinc-500' },
    @{ From = 'bg-blue-500'; To = 'bg-zinc-600' },
    @{ From = 'bg-blue-600'; To = 'bg-zinc-700' },
    @{ From = 'bg-blue-700'; To = 'bg-zinc-800' },
    @{ From = 'bg-blue-800'; To = 'bg-zinc-900' },
    @{ From = 'bg-blue-900'; To = 'bg-black' },

    @{ From = 'text-blue-50'; To = 'text-zinc-200' },
    @{ From = 'text-blue-100'; To = 'text-zinc-300' },
    @{ From = 'text-blue-200'; To = 'text-zinc-400' },
    @{ From = 'text-blue-300'; To = 'text-zinc-300' },
    @{ From = 'text-blue-400'; To = 'text-zinc-200' },
    @{ From = 'text-blue-500'; To = 'text-zinc-100' },
    @{ From = 'text-blue-600'; To = 'text-white' },
    @{ From = 'text-blue-700'; To = 'text-white' },
    @{ From = 'text-blue-800'; To = 'text-white' },
    @{ From = 'text-blue-900'; To = 'text-white' },

    @{ From = 'border-blue-50'; To = 'border-zinc-800' },
    @{ From = 'border-blue-100'; To = 'border-zinc-700' },
    @{ From = 'border-blue-200'; To = 'border-zinc-600' },
    @{ From = 'border-blue-300'; To = 'border-zinc-500' },
    @{ From = 'border-blue-400'; To = 'border-zinc-400' },
    @{ From = 'border-blue-500'; To = 'border-zinc-500' },
    @{ From = 'border-blue-600'; To = 'border-zinc-600' },
    @{ From = 'border-blue-700'; To = 'border-zinc-700' },
    @{ From = 'border-blue-800'; To = 'border-zinc-800' },
    @{ From = 'border-blue-900'; To = 'border-zinc-900' },

    @{ From = 'from-blue-400'; To = 'from-zinc-700' },
    @{ From = 'from-blue-500'; To = 'from-zinc-800' },
    @{ From = 'from-blue-600'; To = 'from-zinc-900' },
    @{ From = 'to-blue-500'; To = 'to-zinc-800' },
    @{ From = 'to-blue-600'; To = 'to-zinc-900' },
    @{ From = 'via-blue-500'; To = 'via-zinc-800' },

    # CYAN variants
    @{ From = 'bg-cyan-50'; To = 'bg-zinc-900' },
    @{ From = 'bg-cyan-400'; To = 'bg-zinc-600' },
    @{ From = 'bg-cyan-500'; To = 'bg-zinc-700' },
    @{ From = 'bg-cyan-600'; To = 'bg-zinc-800' },
    @{ From = 'text-cyan-400'; To = 'text-zinc-200' },
    @{ From = 'text-cyan-500'; To = 'text-zinc-100' },
    @{ From = 'border-cyan-500'; To = 'border-zinc-500' },
    @{ From = 'from-cyan-500'; To = 'from-zinc-800' },
    @{ From = 'to-cyan-600'; To = 'to-zinc-900' },

    # INDIGO variants
    @{ From = 'bg-indigo-50'; To = 'bg-zinc-900' },
    @{ From = 'bg-indigo-500'; To = 'bg-zinc-700' },
    @{ From = 'bg-indigo-600'; To = 'bg-zinc-800' },
    @{ From = 'text-indigo-400'; To = 'text-zinc-200' },
    @{ From = 'text-indigo-500'; To = 'text-zinc-100' },
    @{ From = 'border-indigo-500'; To = 'border-zinc-500' },

    # SKY variants
    @{ From = 'bg-sky-50'; To = 'bg-zinc-900' },
    @{ From = 'bg-sky-500'; To = 'bg-zinc-700' },
    @{ From = 'text-sky-400'; To = 'text-zinc-200' },
    @{ From = 'border-sky-500'; To = 'border-zinc-500' },

    # GREEN variants
    @{ From = 'bg-green-50'; To = 'bg-zinc-900' },
    @{ From = 'bg-green-100'; To = 'bg-zinc-800' },
    @{ From = 'bg-green-500'; To = 'bg-zinc-600' },
    @{ From = 'bg-green-600'; To = 'bg-zinc-700' },
    @{ From = 'text-green-400'; To = 'text-zinc-200' },
    @{ From = 'text-green-500'; To = 'text-zinc-100' },
    @{ From = 'text-green-600'; To = 'text-white' },
    @{ From = 'border-green-500'; To = 'border-zinc-500' },

    # EMERALD variants
    @{ From = 'bg-emerald-50'; To = 'bg-zinc-900' },
    @{ From = 'bg-emerald-500'; To = 'bg-zinc-700' },
    @{ From = 'text-emerald-400'; To = 'text-zinc-200' },
    @{ From = 'border-emerald-500'; To = 'border-zinc-500' },

    # TEAL variants
    @{ From = 'bg-teal-50'; To = 'bg-zinc-900' },
    @{ From = 'bg-teal-500'; To = 'bg-zinc-700' },
    @{ From = 'text-teal-400'; To = 'text-zinc-200' },
    @{ From = 'border-teal-500'; To = 'border-zinc-500' },

    # RED variants
    @{ From = 'bg-red-50'; To = 'bg-zinc-900' },
    @{ From = 'bg-red-100'; To = 'bg-zinc-800' },
    @{ From = 'bg-red-500'; To = 'bg-zinc-600' },
    @{ From = 'bg-red-600'; To = 'bg-zinc-700' },
    @{ From = 'text-red-400'; To = 'text-zinc-200' },
    @{ From = 'text-red-500'; To = 'text-zinc-100' },
    @{ From = 'text-red-600'; To = 'text-white' },
    @{ From = 'border-red-500'; To = 'border-zinc-500' },

    # ORANGE variants
    @{ From = 'bg-orange-50'; To = 'bg-zinc-900' },
    @{ From = 'bg-orange-500'; To = 'bg-zinc-700' },
    @{ From = 'text-orange-400'; To = 'text-zinc-200' },
    @{ From = 'border-orange-500'; To = 'border-zinc-500' },

    # AMBER variants
    @{ From = 'bg-amber-50'; To = 'bg-zinc-900' },
    @{ From = 'bg-amber-500'; To = 'bg-zinc-700' },
    @{ From = 'text-amber-400'; To = 'text-zinc-200' },
    @{ From = 'border-amber-500'; To = 'border-zinc-500' },

    # YELLOW variants
    @{ From = 'bg-yellow-50'; To = 'bg-zinc-900' },
    @{ From = 'bg-yellow-500'; To = 'bg-zinc-700' },
    @{ From = 'text-yellow-400'; To = 'text-zinc-200' },
    @{ From = 'border-yellow-500'; To = 'border-zinc-500' },

    # VIOLET/FUCHSIA/ROSE - already should be done but double check
    @{ From = 'bg-violet-500'; To = 'bg-zinc-700' },
    @{ From = 'bg-fuchsia-500'; To = 'bg-zinc-700' },
    @{ From = 'bg-rose-500'; To = 'bg-zinc-700' },
    @{ From = 'text-violet-400'; To = 'text-zinc-200' },
    @{ From = 'text-fuchsia-400'; To = 'text-zinc-200' },
    @{ From = 'text-rose-400'; To = 'text-zinc-200' }
)

$files = Get-ChildItem -Path "src" -Recurse -Include "*.jsx","*.tsx","*.js","*.ts"
$totalReplacements = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }

    $modified = $false
    $originalContent = $content

    foreach ($replacement in $replacements) {
        if ($content -match [regex]::Escape($replacement.From)) {
            $content = $content -replace [regex]::Escape($replacement.From), $replacement.To
            $modified = $true
        }
    }

    if ($modified) {
        $content | Set-Content $file.FullName -NoNewline -Encoding UTF8
        $changes = ($originalContent.Split("`n").Count - $content.Split("`n").Count)
        $totalReplacements++
        Write-Host "  ✅ $($file.Name) - Actualizado" -ForegroundColor Green
    }
}

Write-Host "`n✨ COMPLETADO: $totalReplacements archivos actualizados" -ForegroundColor Green
Write-Host "🎯 TODO convertido a escala ZINC/BLACK" -ForegroundColor Cyan
