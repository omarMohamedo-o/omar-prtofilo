#!/bin/bash

# 🚀 MORA Portfolio - Performance Optimization Setup
# This script automates the entire optimization process

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 MORA Portfolio - Performance Optimization Setup       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Install Dependencies
echo -e "${BLUE}📦 Step 1: Installing Dependencies...${NC}"
cd frontend
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}\n"

# Step 2: Run Image Optimization
echo -e "${BLUE}🖼️  Step 2: Optimizing Images...${NC}"
npm run optimize:images
echo -e "${GREEN}✅ Images optimized${NC}\n"

# Step 3: Build for Production
echo -e "${BLUE}🔨 Step 3: Building for Production...${NC}"
npm run build
echo -e "${GREEN}✅ Build complete${NC}\n"

# Step 4: Check results
echo -e "${BLUE}📊 Step 4: Checking Results...${NC}"
echo ""
echo -e "${YELLOW}Optimized Images:${NC}"
if [ -d "public/images-optimized" ]; then
    du -sh public/images-optimized
    echo "File count: $(find public/images-optimized -type f | wc -l)"
else
    echo "⚠️  images-optimized directory not found!"
fi
echo ""

echo -e "${YELLOW}Build Output Size:${NC}"
du -sh dist/ 2>/dev/null || echo "dist/ not found"
echo ""

echo -e "${YELLOW}Main Bundle:${NC}"
ls -lh dist/assets/*.js 2>/dev/null | tail -3 || echo "No bundles found"
echo ""

# Step 5: Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  ✅ Optimization Complete!                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "1. Review /frontend/public/images-optimized/"
echo "2. Check /frontend/dist/ for production build"
echo "3. Deploy: docker-compose up --build"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "See OPTIMIZATION_GUIDE.md for detailed information"
echo ""
