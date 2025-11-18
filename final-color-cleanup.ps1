# 🔥 ELIMINACION FINAL PURPLE/PINK
param([int]$MaxFiles = 1000)

Write-Host "🎯 Eliminando purple/pink/violet..." -ForegroundColor Yellow

$patterns = @(
    @('from-purple-\d+', 'from-zinc-800'),
    @('to-purple-\d+', 'to-zinc-800'),
    @('via-purple-\d+', 'via-zinc-800'),
    @('bg-purple-\d+', 'bg-zinc-800'),
    @('text-purple-\d+', 'text-zinc-200'),
    @('border-purple-\d+', 'border-zinc-700'),
    @('ring-purple-\d+', 'ring-zinc-700'),
    @('hover:text-purple-\d+', 'hover:text-zinc-100'),
    @('focus:border-purple-\d+', 'focus:border-zinc-600'),
    @('hover:shadow.*purple', 'hover:shadow-zinc-900/50'),

    @('from-pink-\d+', 'from-zinc-700'),
    @('to-pink-\d+', 'to-zinc-800'),
    @('via-pink-\d+', 'via-zinc-700'),
    @('bg-pink-\d+', 'bg-zinc-700'),
    @('text-pink-\d+', 'text-zinc-200'),

    @('from-red-\d+', 'from-zinc-700'),
    @('to-red-\d+', 'to-zinc-800'),
    @('animate-pulse.*red-', 'animate-pulse bg-zinc-700')
)

$files = Get-ChildItem -Path "src" -Recurse -Include "*.jsx","*.tsx" | Select-Object -First $MaxFiles
$count = 0

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $modified = $false

        foreach ($pattern in $patterns) {
            if ($content -match $pattern[0]) {
                $content = $content -replace $pattern[0], $pattern[1]
                $modified = $true
            }
        }

        if ($modified) {
            $content | Set-Content $file.FullName -NoNewline -Encoding UTF8
            $count++
            Write-Host "  ✅ $($file.Name)" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ⚠️ Error en $($file.Name): $_" -ForegroundColor Yellow
    }
}

Write-Host "`n✨ $count archivos actualizados" -ForegroundColor Cyan
