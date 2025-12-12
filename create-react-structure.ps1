# ============================================
# Create React Project Structure
# ============================================

Write-Host "Creating React project structure..." -ForegroundColor Cyan
Write-Host ""

# Create directory structure
$directories = @(
    "src/components/ui",
    "src/components/layout",
    "src/pages",
    "src/hooks",
    "src/lib",
    "src/store",
    "src/types",
    "src/api",
    "src/utils",
    "src/styles",
    "public/fonts"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "  ✓ Created $dir" -ForegroundColor Green
}

Write-Host ""
Write-Host "Directory structure created successfully!" -ForegroundColor Green
