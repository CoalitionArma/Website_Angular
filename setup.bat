@echo off
echo 🚀 Coalition Website Development Setup
echo ======================================

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% detected

:: Install frontend dependencies
echo 📦 Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

:: Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Backend dependencies installed

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Ensure MySQL is installed and running locally
echo 2. Create a database named 'coalition'
echo 3. Update database credentials in backend/.env.development if needed
echo 4. Run 'npm run dev' to start both frontend and backend
echo.
echo 🔧 Available commands:
echo   npm run dev          - Start full development environment
echo   npm run start:dev    - Start frontend only (development)
echo   npm run backend:dev  - Start backend only (development)
echo   npm run build:prod   - Build for production
echo.
echo 📖 See DEVELOPMENT.md for detailed documentation
pause
