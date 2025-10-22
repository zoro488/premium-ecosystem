#!/usr/bin/env pwsh
# GitHub Copilot CLI - Herramientas Avanzadas
# Utilidades para maximizar el uso de Copilot

# Colores para output
$colors = @{
    Info      = "Cyan"
    Success   = "Green"
    Warning   = "Yellow"
    Error     = "Red"
    Highlight = "Magenta"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Type = "Info")
    Write-Host $Message -ForegroundColor $colors[$Type]
}

# Función: Sugerencia de comando
function Get-CopilotSuggestion {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Query
    )
    
    Write-ColorOutput "🤖 Consultando a Copilot..." "Info"
    gh copilot suggest -t shell "$Query"
}

# Función: Explicar comando
function Get-CopilotExplanation {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Command
    )
    
    Write-ColorOutput "📖 Explicando comando..." "Info"
    gh copilot explain "$Command"
}

# Función: Revisar código
function Invoke-CopilotReview {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-ColorOutput "❌ Archivo no encontrado: $FilePath" "Error"
        return
    }
    
    Write-ColorOutput "🔍 Revisando código con Copilot..." "Info"
    
    $content = Get-Content $FilePath -Raw
    $review = gh copilot suggest -t git "review code: $content"
    
    Write-ColorOutput "`n📝 Resultado de la revisión:" "Success"
    Write-Host $review
}

# Función: Generar tests
function New-CopilotTests {
    param(
        [Parameter(Mandatory = $true)]
        [string]$SourceFile
    )
    
    if (-not (Test-Path $SourceFile)) {
        Write-ColorOutput "❌ Archivo no encontrado: $SourceFile" "Error"
        return
    }
    
    Write-ColorOutput "🧪 Generando tests con Copilot..." "Info"
    
    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($SourceFile)
    $extension = [System.IO.Path]::GetExtension($SourceFile)
    $testFile = "$fileName.test$extension"
    
    $suggestion = gh copilot suggest "create unit tests for file $SourceFile"
    
    Write-ColorOutput "✅ Test generado en: $testFile" "Success"
    Write-Host $suggestion
}

# Función: Optimizar código
function Optimize-CodeWithCopilot {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-ColorOutput "❌ Archivo no encontrado: $FilePath" "Error"
        return
    }
    
    Write-ColorOutput "⚡ Optimizando código con Copilot..." "Info"
    
    $content = Get-Content $FilePath -Raw
    $suggestion = gh copilot suggest "optimize this code for performance and readability: $content"
    
    Write-ColorOutput "`n💡 Sugerencias de optimización:" "Success"
    Write-Host $suggestion
}

# Función: Documentar código
function Add-CopilotDocumentation {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-ColorOutput "❌ Archivo no encontrado: $FilePath" "Error"
        return
    }
    
    Write-ColorOutput "📚 Generando documentación con Copilot..." "Info"
    
    $content = Get-Content $FilePath -Raw
    $docs = gh copilot suggest "add comprehensive JSDoc/TypeDoc comments to: $content"
    
    Write-ColorOutput "`n📝 Documentación generada:" "Success"
    Write-Host $docs
}

# Función: Detectar vulnerabilidades
function Find-SecurityIssues {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-ColorOutput "❌ Archivo no encontrado: $FilePath" "Error"
        return
    }
    
    Write-ColorOutput "🔒 Analizando seguridad con Copilot..." "Info"
    
    $content = Get-Content $FilePath -Raw
    $security = gh copilot suggest "find security vulnerabilities and suggest fixes for: $content"
    
    Write-ColorOutput "`n🛡️ Análisis de seguridad:" "Success"
    Write-Host $security
}

# Función: Refactorizar código
function Invoke-CopilotRefactor {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath,
        [string]$Pattern = ""
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-ColorOutput "❌ Archivo no encontrado: $FilePath" "Error"
        return
    }
    
    Write-ColorOutput "🔄 Refactorizando código con Copilot..." "Info"
    
    $content = Get-Content $FilePath -Raw
    $prompt = if ($Pattern) {
        "refactor this code following $Pattern pattern: $content"
    }
    else {
        "refactor this code following best practices: $content"
    }
    
    $refactored = gh copilot suggest $prompt
    
    Write-ColorOutput "`n✨ Código refactorizado:" "Success"
    Write-Host $refactored
}

# Función: Generar commit message
function New-CopilotCommitMessage {
    Write-ColorOutput "💬 Generando commit message con Copilot..." "Info"
    
    $diff = git diff --cached
    if (-not $diff) {
        Write-ColorOutput "⚠️  No hay cambios en staging" "Warning"
        return
    }
    
    $message = gh copilot suggest -t git "generate conventional commit message for these changes: $diff"
    
    Write-ColorOutput "`n📝 Mensaje sugerido:" "Success"
    Write-Host $message
}

# Función: Análisis completo de proyecto
function Invoke-CopilotProjectAnalysis {
    Write-ColorOutput "📊 Analizando proyecto completo..." "Info"
    
    $analysis = @{
        Files      = (Get-ChildItem -Recurse -File | Measure-Object).Count
        JSFiles    = (Get-ChildItem -Recurse -Include *.js, *.jsx | Measure-Object).Count
        Components = (Get-ChildItem -Recurse -Path "src/components" -Include *.jsx | Measure-Object).Count
        Tests      = (Get-ChildItem -Recurse -Include *.test.js, *.test.jsx | Measure-Object).Count
        LOC        = 0
    }
    
    Get-ChildItem -Recurse -Include *.js, *.jsx | ForEach-Object {
        $analysis.LOC += (Get-Content $_.FullName | Measure-Object -Line).Lines
    }
    
    Write-ColorOutput "`n📈 Estadísticas del Proyecto:" "Highlight"
    Write-Host "  Total de archivos: $($analysis.Files)"
    Write-Host "  Archivos JS/JSX: $($analysis.JSFiles)"
    Write-Host "  Componentes: $($analysis.Components)"
    Write-Host "  Tests: $($analysis.Tests)"
    Write-Host "  Líneas de código: $($analysis.LOC)"
    
    $suggestion = gh copilot suggest "analyze project structure and suggest improvements for a React project with $($analysis.JSFiles) files and $($analysis.Components) components"
    
    Write-ColorOutput "`n💡 Sugerencias de mejora:" "Success"
    Write-Host $suggestion
}

# Exportar funciones
Export-ModuleMember -Function @(
    'Get-CopilotSuggestion',
    'Get-CopilotExplanation',
    'Invoke-CopilotReview',
    'New-CopilotTests',
    'Optimize-CodeWithCopilot',
    'Add-CopilotDocumentation',
    'Find-SecurityIssues',
    'Invoke-CopilotRefactor',
    'New-CopilotCommitMessage',
    'Invoke-CopilotProjectAnalysis'
)

# Alias amigables
Set-Alias -Name ghcs -Value Get-CopilotSuggestion
Set-Alias -Name ghce -Value Get-CopilotExplanation
Set-Alias -Name ghcr -Value Invoke-CopilotReview
Set-Alias -Name ghct -Value New-CopilotTests
Set-Alias -Name ghco -Value Optimize-CodeWithCopilot
Set-Alias -Name ghcd -Value Add-CopilotDocumentation
Set-Alias -Name ghcv -Value Find-SecurityIssues
Set-Alias -Name ghcf -Value Invoke-CopilotRefactor
Set-Alias -Name ghcm -Value New-CopilotCommitMessage
Set-Alias -Name ghca -Value Invoke-CopilotProjectAnalysis

Write-ColorOutput "✅ Copilot CLI Tools cargado" "Success"
Write-ColorOutput "💡 Usa 'ghcs', 'ghce', 'ghcr', etc. para acceso rápido" "Info"
