#!/bin/bash

echo "==================================="
echo "Vehicle Renting System - Frontend Setup"
echo "==================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm."
    exit 1
fi

echo "Installing frontend dependencies..."
npm install

echo "Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Environment file created."
else
    echo "Environment file already exists."
fi

echo "Frontend setup completed!"
echo
echo "To start the development server, run:"
echo "npm run dev"
echo
echo "Frontend will be available at: http://localhost:5173"
echo "Make sure the backend is running at: http://localhost:8000"
