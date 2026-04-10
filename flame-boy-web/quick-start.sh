#!/bin/bash
# Quick Start Guide for FlameBoy Web
# Run this script to get up and running quickly

echo "🎮 FlameBoy Web - Quick Start"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the flame-boy-web directory"
  exit 1
fi

echo "✅ Found package.json"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Download ROMs
echo "🎮 Downloading open source ROMs..."
npm run download-roms
echo ""

# Ask if user wants to start dev server
read -p "🚀 Start development server? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "🎮 Starting development server..."
  echo "Open http://localhost:3000 in your browser"
  echo ""
  npm run dev
fi
