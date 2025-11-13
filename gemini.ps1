# ====================================
# GEMINI CLI - WRAPPER POWERSHELL
# ====================================
# Wrapper para usar gemini-cli.js desde PowerShell
# Uso: .\gemini.ps1 ask "tu pregunta"

param(
  [Parameter(Position = 0, Mandatory = $false)]
  [string]$Command,

  [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
  [string[]]$Args
)

$scriptPath = Join-Path $PSScriptRoot "gemini-cli.js"

if (-not (Test-Path $scriptPath)) {
  Write-Host "❌ Error: gemini-cli.js no encontrado" -ForegroundColor Red
  exit 1
}

# Ejecutar el CLI de Node
if ($Command) {
  node $scriptPath $Command @Args
}
else {
  node $scriptPath help
}
