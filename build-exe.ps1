$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "[1/6] Build frontend assets"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }

$venvPath = Join-Path $PSScriptRoot ".venv-pack"
$venvPython = Join-Path $venvPath "Scripts\\python.exe"

if (-not (Test-Path $venvPython)) {
  Write-Host "[2/6] Create packaging virtualenv"
  python -m venv .venv-pack
  if ($LASTEXITCODE -ne 0) { throw "Virtualenv creation failed" }
} else {
  Write-Host "[2/6] Reuse packaging virtualenv"
}

Write-Host "[3/6] Install packaging dependencies"
& "$venvPython" -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) { throw "pip upgrade failed" }
& "$venvPython" -m pip install -r backend/requirements.txt pyinstaller
if ($LASTEXITCODE -ne 0) { throw "Dependency install failed" }

Write-Host "[4/6] Clean old EXE lock"
try {
  Get-Process SmartWardrobe -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
} catch {}
if (Test-Path "release/SmartWardrobe.exe") {
  Remove-Item "release/SmartWardrobe.exe" -Force
}

Write-Host "[5/6] Build EXE"
& "$venvPython" -m PyInstaller `
  --noconfirm `
  --clean `
  --onefile `
  --name "SmartWardrobe" `
  --distpath "release" `
  --workpath "build/pyinstaller" `
  --add-data "$PSScriptRoot\\dist;dist" `
  --add-data "$PSScriptRoot\\public;public" `
  backend/main.py
if ($LASTEXITCODE -ne 0) { throw "PyInstaller build failed" }

if (-not (Test-Path "release/SmartWardrobe.exe")) {
  throw "Missing release/SmartWardrobe.exe"
}

Write-Host "[6/6] Done"
Write-Host "EXE: release/SmartWardrobe.exe"
