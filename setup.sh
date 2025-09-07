#!/bin/bash

echo "🚀 Coalition Website Development Setup"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm --version) detected"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..
echo "✅ Backend dependencies installed"

# Copy environment files if they don't exist
if [ ! -f "backend/.env.development" ]; then
    echo "⚠️  Creating default backend/.env.development"
    echo "Please update the database credentials as needed."
fi

if [ ! -f "backend/.env.production" ]; then
    echo "⚠️  Creating default backend/.env.production"
    echo "Please update the production configuration as needed."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Ensure MySQL is installed and running locally"
echo "2. Create a database named 'coalition'"
echo "3. Update database credentials in backend/.env.development if needed"
echo "4. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "🔧 Available commands:"
echo "  npm run dev          - Start full development environment"
echo "  npm run start:dev    - Start frontend only (development)"
echo "  npm run backend:dev  - Start backend only (development)"
echo "  npm run build:prod   - Build for production"
echo ""
echo "📖 See DEVELOPMENT.md for detailed documentation"
