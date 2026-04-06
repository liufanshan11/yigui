@echo off
echo ========================================
echo     智汇衣橱 - 一键启动
echo ========================================
echo.

cd /d "%~dp0smart-wardrobe\backend"

echo [1/2] 正在启动后端服务...
start "智汇衣橱-后端" cmd /k "cd /d %~dp0smart-wardrobe\backend && python main.py"

timeout /t 3 /nobreak >nul

cd /d "%~dp0smart-wardrobe"

echo [2/2] 正在启动前端服务...
start "智汇衣橱-前端" cmd /k "cd /d %~dp0smart-wardrobe && npm run dev"

echo.
echo ========================================
echo 启动完成！
echo.
echo 后端地址: http://localhost:8000
echo 前端地址: http://localhost:5173
echo.
echo 请在浏览器中打开 http://localhost:5173
echo ========================================
echo.
pause
