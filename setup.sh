#!/bin/bash

# Artify Agent Setup Script
# This script helps you get the AI-Agent × Gelato automation system running quickly

set -e

echo "🎨 Artify Agent Setup"
echo "===================="
echo

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version is $NODE_VERSION. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm $(npm -v) found"

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "✅ Supabase CLI found"

# Install dependencies
echo
echo "📦 Installing dependencies..."
npm install

# Set up environment file
echo
echo "🔧 Setting up environment configuration..."

if [ ! -f ".env.local" ]; then
    if [ -f ".env" ]; then
        echo "📄 Copying .env to .env.local..."
        cp .env .env.local
    elif [ -f ".env.local.example" ]; then
        echo "📄 Copying .env.local.example to .env.local..."
        cp .env.local.example .env.local
        echo "⚠️  Please update .env.local with your actual API keys before proceeding."
    else
        echo "❌ No environment template found. Please create .env.local manually."
        exit 1
    fi
else
    echo "✅ .env.local already exists"
fi

# Initialize Supabase (if needed)
echo
echo "🗄️  Setting up Supabase..."

if [ ! -f "supabase/config.toml" ]; then
    echo "📄 Initializing Supabase project..."
    supabase init
fi

echo "✅ Supabase project configured"

# Start Supabase locally
echo
echo "🚀 Starting local Supabase stack..."
supabase start

# Apply database migrations
echo
echo "📊 Setting up database schema..."
supabase db push

# Deploy Edge Functions
echo
echo "⚡ Deploying Edge Functions..."
supabase functions deploy orchestrator

echo
echo "🎉 Setup complete!"
echo
echo "Next steps:"
echo "1. Update .env.local with your API keys (if not done already)"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to use the application"
echo
echo "📖 For more information, see the README.md file"
echo
echo "🎯 Demo Mode is enabled by default - safe for testing!" 