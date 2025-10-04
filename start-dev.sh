#!/bin/bash

echo "🚀 Starting SkillSync MVP Development Environment..."
echo "=================================================="

# Check if node_modules exist in all packages
echo "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

# Build the moca-integration package first
echo "Building Moca integration package..."
cd packages/moca-integration
npm run build
cd ../..

echo "Starting development servers..."
npm run dev