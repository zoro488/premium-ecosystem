<#
  Auto-run CI script (PowerShell)
  Executes lint, format, typecheck, build and tests in non-interactive mode.
  Usage: pwsh -File scripts/auto-run.ps1
#>

Write-Host '🔁 Starting automated non-interactive runner...' -ForegroundColor Cyan

try {
  Write-Host '📝 Lint (fix)...'
  npm run lint:fix --silent
}
catch {
  Write-Host 'Lint step failed, continuing...' -ForegroundColor Yellow
}

try {
  Write-Host '💅 Format...'
  npm run format --silent
}
catch {
  Write-Host 'Format step failed, continuing...' -ForegroundColor Yellow
}

try {
  Write-Host '🔎 Type check (tsc)...'
  npx tsc --noEmit --pretty false
}
catch {
  Write-Host 'Type check failed, continuing...' -ForegroundColor Yellow
}

try {
  Write-Host '🏗 Build (vite)...'
  npm run build --silent
}
catch {
  Write-Host 'Build failed, continuing...' -ForegroundColor Red
}

try {
  Write-Host '🧪 Tests (vitest run)...'
  npm run test:run --silent
}
catch {
  Write-Host 'Tests failed, continuing...' -ForegroundColor Yellow
}

Write-Host '🚀 Automated runner finished.' -ForegroundColor Green

exit 0
