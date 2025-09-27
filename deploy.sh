#!/bin/bash

# UniCore Protocol Deployment Script

echo "🚀 Starting UniCore Protocol Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 UniCore Protocol is ready!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set up your environment variables in .env.local"
    echo "2. Deploy your smart contracts"
    echo "3. Update contract addresses in src/lib/config.ts"
    echo "4. Run 'npm run dev' to start the development server"
    echo ""
    echo "🌐 Your app will be available at: http://localhost:3000"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
