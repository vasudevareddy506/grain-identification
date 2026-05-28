@echo off
title Grain Vision Frontend
echo ===================================================
echo   Grain Vision Frontend - Expo Mobile App Setup
echo ===================================================
echo.
echo Installing node modules (this may take a minute)...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed! Please ensure Node.js is installed.
    pause
    exit /b
)
echo.
echo Starting Expo web preview server...
call npm run web
pause
