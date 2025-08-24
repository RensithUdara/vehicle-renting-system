@echo off
echo ===================================
echo Vehicle Renting System - Frontend Setup
echo ===================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo Installing frontend dependencies...
npm install

echo Setting up environment file...
if not exist ".env" (
    copy ".env.example" ".env"
    echo Environment file created.
) else (
    echo Environment file already exists.
)

echo Frontend setup completed!
echo.
echo To start the development server, run:
echo npm run dev
echo.
echo Frontend will be available at: http://localhost:5173
echo Make sure the backend is running at: http://localhost:8000
pause
