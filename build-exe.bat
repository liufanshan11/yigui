@echo off
setlocal
cd /d "%~dp0"

echo [1/6] Build frontend assets
call npm run build
if errorlevel 1 goto :error

if not exist ".venv-pack\Scripts\python.exe" (
  echo [2/6] Create packaging virtualenv
  python -m venv .venv-pack
  if errorlevel 1 goto :error
) else (
  echo [2/6] Reuse packaging virtualenv
)

set "VPY=.venv-pack\Scripts\python.exe"

echo [3/6] Install packaging dependencies
call "%VPY%" -m pip install --upgrade pip
if errorlevel 1 goto :error
call "%VPY%" -m pip install -r backend\requirements.txt pyinstaller
if errorlevel 1 goto :error

echo [4/6] Clean old EXE lock
taskkill /F /IM SmartWardrobe.exe >nul 2>&1
if exist "release\SmartWardrobe.exe" del /F /Q "release\SmartWardrobe.exe"

echo [5/6] Build EXE
call "%VPY%" -m PyInstaller --noconfirm --clean --onefile --name SmartWardrobe --distpath release --workpath build\pyinstaller --add-data "%CD%\dist;dist" --add-data "%CD%\public;public" backend\main.py
if errorlevel 1 goto :error

if not exist "release\SmartWardrobe.exe" (
  echo Missing release\SmartWardrobe.exe
  exit /b 1
)

echo [6/6] Done
echo EXE: release\SmartWardrobe.exe
exit /b 0

:error
echo Build failed. See logs above.
exit /b 1
