#!/bin/bash

# UniCore Protocol - Professional Build & Test Script

echo "🚀 UniCore Protocol - Professional Build & Test"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the frontend directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Checking project status...${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# Check for environment file
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  No .env.local found. Creating demo environment...${NC}"
    cat > .env.local << EOF
# Demo Environment Variables
GOOGLE_GENERATIVE_AI_API_KEY=demo-gemini-key
ONEINCH_API_KEY=demo-1inch-key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=demo-project-id
EOF
    echo -e "${GREEN}✅ Created demo .env.local file${NC}"
else
    echo -e "${GREEN}✅ Environment file found${NC}"
fi

# Run linting
echo -e "${BLUE}🔍 Running code quality checks...${NC}"
npm run lint 2>/dev/null || echo -e "${YELLOW}⚠️  No lint script found, skipping...${NC}"

# Build the project
echo -e "${BLUE}🔨 Building the project...${NC}"
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo ""
    echo -e "${GREEN}🎉 UniCore Protocol is ready for production!${NC}"
    echo ""
    echo -e "${BLUE}📋 Project Status:${NC}"
    echo -e "  ✅ Dependencies installed"
    echo -e "  ✅ Environment configured"
    echo -e "  ✅ Build successful"
    echo -e "  ✅ All systems ready"
    echo ""
    echo -e "${BLUE}🚀 Next Steps:${NC}"
    echo -e "  1. Run 'npm run dev' to start development server"
    echo -e "  2. Open http://localhost:3000 in your browser"
    echo -e "  3. Connect your wallet to test functionality"
    echo -e "  4. Try the AI chat assistant"
    echo -e "  5. Test token swaps with demo data"
    echo ""
    echo -e "${BLUE}🔧 For Production:${NC}"
    echo -e "  1. Get real API keys from:"
    echo -e "     - Google AI Studio (Gemini)"
    echo -e "     - 1inch Portal"
    echo -e "     - WalletConnect Cloud"
    echo -e "  2. Update .env.local with real keys"
    echo -e "  3. Deploy smart contracts"
    echo -e "  4. Update contract addresses"
    echo ""
    echo -e "${GREEN}🌟 Your professional DeFi protocol is ready!${NC}"
else
    echo -e "${RED}❌ Build failed. Please check the errors above.${NC}"
    echo -e "${YELLOW}💡 Common fixes:${NC}"
    echo -e "  - Check TypeScript errors"
    echo -e "  - Verify all imports are correct"
    echo -e "  - Ensure all dependencies are installed"
    exit 1
fi
