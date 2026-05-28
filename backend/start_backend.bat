@echo off
title Grain Vision Backend
echo ===================================================
echo   Grain Vision Backend - FastAPI Server Setup
echo ===================================================
echo.
echo Installing requirements...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo.
    echo WARNING: pip install failed. Checking if python is in path...
    python --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ERROR: Python is not installed or not in PATH! Please install Python.
        pause
        exit /b
    )
)
echo.
echo Starting FastAPI application server...
echo Access API documentation at: http://localhost:8000/docs
echo.
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
