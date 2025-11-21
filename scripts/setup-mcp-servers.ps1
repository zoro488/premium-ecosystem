# Setup MCP Servers for Premium Ecosystem
# PowerShell script for Windows

param(
    [switch]$Force
)

Write-Host "🚀 Setting up MCP Servers for GitHub Copilot..." -ForegroundColor Cyan

# Check if running in GitHub environment
if ($env:CODESPACES -or $env:GITHUB_ACTIONS) {
    Write-Host "✅ Running in GitHub environment" -ForegroundColor Green
} else {
    Write-Host "⚠️  Not in GitHub environment - MCP servers require GitHub organization settings" -ForegroundColor Yellow
    Write-Host "Please configure MCP servers at: https://github.com/settings/copilot/features" -ForegroundColor Yellow
    if (-not $Force) {
        exit 0
    }
}

# Create MCP server configuration directory
$configPath = "$env:USERPROFILE\.config\copilot\mcp"
if (-not (Test-Path $configPath)) {
    New-Item -ItemType Directory -Force -Path $configPath | Out-Null
}

# Define MCP servers configuration
$mcpConfig = @{
    servers = @(
        @{
            name = "firebase-mcp"
            description = "Firebase integration for Copilot"
            enabled = $false
            note = "Configure with your Firebase project ID"
        },
        @{
            name = "workflow-mcp"
            description = "FlowDistributor workflow assistant"
            enabled = $false
            note = "Custom MCP server for workflow management"
        }
    )
}

$configFile = Join-Path $configPath "servers.json"
$mcpConfig | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile -Encoding UTF8

Write-Host "✅ MCP server configuration created at $configFile" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to GitHub organization settings"
Write-Host "2. Navigate to Copilot > Features > MCP Servers"
Write-Host "3. Enable MCP servers for your organization"
Write-Host "4. Configure server endpoints and authentication"
Write-Host ""
Write-Host "🔗 Documentation: https://docs.github.com/en/copilot/using-github-copilot/using-mcp-servers" -ForegroundColor Blue
