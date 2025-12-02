#!/bin/bash

set -e

echo "🚀 B3 OpenNext Template - Setup Script"
echo "======================================="
echo ""

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        echo "   Visit: $2"
        exit 1
    fi
    echo "✅ $1 is installed"
}

echo "📋 Checking prerequisites..."
check_command "bun" "https://bun.sh"
check_command "node" "https://nodejs.org"
check_command "wrangler" "https://developers.cloudflare.com/workers/wrangler/install-and-update/"

echo ""
echo "📦 Installing dependencies..."
bun install

echo ""
echo "🔑 Setting up environment..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "⚠️  Please update .env.local with your values"

    SECRET=$(openssl rand -base64 32)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|your-secret-key-change-this-in-production|$SECRET|" .env.local
    else
        sed -i "s|your-secret-key-change-this-in-production|$SECRET|" .env.local
    fi
    echo "✅ Generated BETTER_AUTH_SECRET"
else
    echo "⚠️  .env.local already exists, skipping..."
fi

echo ""
echo "☁️  Cloudflare setup required:"
echo ""
echo "Run these commands and update your wrangler configs:"
echo ""
echo "  1. Create D1 databases:"
echo "     wrangler d1 create b3-db-dev"
echo "     wrangler d1 create b3-db-prod"
echo ""
echo "  2. Create R2 buckets:"
echo "     wrangler r2 bucket create b3-storage-dev"
echo "     wrangler r2 bucket create b3-storage-prod"
echo ""
echo "  3. Create KV namespaces:"
echo "     wrangler kv namespace create CACHE_KV"
echo "     wrangler kv namespace create CACHE_KV --env production"
echo ""
echo "  4. Update wrangler.jsonc and wrangler.production.jsonc with IDs"
echo ""

read -p "Have you completed the Cloudflare setup? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⚠️  Please complete Cloudflare setup and run this script again"
    exit 1
fi

echo ""
echo "🗄️  Setting up database..."
bun run db:generate

echo ""
echo "🌱 Seeding database..."
bun run db:seed

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 Start development server:"
echo "   bun run dev"
echo ""
echo "📖 Read the docs:"
echo "   - QUICKSTART.md"
echo "   - README.md"
echo "   - docs/SETUP.md"
echo ""
echo "Happy coding! 🎨"
