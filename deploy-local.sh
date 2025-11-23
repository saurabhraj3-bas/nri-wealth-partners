#!/bin/bash

# ===================================
# NRI Wealth Partners - Local Deployment Script
# ===================================

echo "🚀 Starting local deployment for NRI Wealth Partners..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found!"
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo ""
    echo "✅ Created .env.local"
    echo "⚠️  IMPORTANT: Edit .env.local and add your actual values before continuing!"
    echo ""
    echo "Minimum required for testing:"
    echo "  - GMAIL_USER (your Gmail address)"
    echo "  - GMAIL_APP_PASSWORD (16-digit app password)"
    echo "  - CONTACT_EMAIL (where to receive notifications)"
    echo ""
    read -p "Have you updated .env.local? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Please update .env.local and run this script again."
        exit 1
    fi
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🎉 Starting development server..."
echo ""
echo "📍 Local URL: http://localhost:3000"
echo "🌐 Network URL: Check terminal output below"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the dev server
npm run dev
