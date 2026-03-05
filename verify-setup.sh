#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "Verifying Killer Agents Setup"
echo "========================================="
echo ""

# Check Node.js
echo -n "Checking Node.js version... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi

# Check Yarn
echo -n "Checking Yarn... "
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn -v)
    echo -e "${GREEN}✓${NC} $YARN_VERSION"
else
    echo -e "${YELLOW}⚠ Yarn not found, using npm${NC}"
fi

# Check .env file
echo -n "Checking .env file... "
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} Found"

    # Check required keys
    echo "  Checking required API keys..."
    if grep -q "GEMINI_API_KEY=" .env && ! grep -q "GEMINI_API_KEY=your_gemini_key_here" .env; then
        echo -e "    ${GREEN}✓${NC} GEMINI_API_KEY set"
    else
        echo -e "    ${YELLOW}⚠${NC} GEMINI_API_KEY not set or using placeholder"
    fi

    if grep -q "SERP_API_KEY=" .env && ! grep -q "SERP_API_KEY=your_serpapi_key_here" .env; then
        echo -e "    ${GREEN}✓${NC} SERP_API_KEY set"
    else
        echo -e "    ${YELLOW}⚠${NC} SERP_API_KEY not set or using placeholder"
    fi

    if grep -q 'DATABASE_URL="file:./dev.db"' .env; then
        echo -e "    ${GREEN}✓${NC} DATABASE_URL configured correctly"
    else
        echo -e "    ${RED}✗${NC} DATABASE_URL not configured correctly"
        echo -e "    ${YELLOW}Expected: DATABASE_URL=\"file:./dev.db\"${NC}"
    fi
else
    echo -e "${RED}✗ Not found${NC}"
    echo -e "  ${YELLOW}Copy .env.example to .env and add your API keys${NC}"
    exit 1
fi

# Check node_modules
echo -n "Checking dependencies... "
if [ -d node_modules ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${YELLOW}⚠ Not installed${NC}"
    echo "  Run 'yarn install' or 'npm install'"
    exit 1
fi

# Check Prisma client
echo -n "Checking Prisma client... "
if [ -d node_modules/.prisma ]; then
    echo -e "${GREEN}✓${NC} Generated"
else
    echo -e "${YELLOW}⚠ Not generated${NC}"
    echo "  Run 'npx prisma generate'"
fi

# Check database
echo -n "Checking database... "
if [ -f prisma/dev.db ]; then
    DB_SIZE=$(ls -lh prisma/dev.db | awk '{print $5}')
    INFLUENCER_COUNT=$(echo "SELECT COUNT(*) FROM Influencer;" | sqlite3 prisma/dev.db 2>/dev/null || echo "0")

    if [ "$INFLUENCER_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓${NC} Found with $INFLUENCER_COUNT influencers ($DB_SIZE)"
    else
        echo -e "${YELLOW}⚠ Database exists but appears empty${NC}"
        echo "  Run 'npx prisma db push && npx prisma db seed'"
    fi
else
    echo -e "${YELLOW}⚠ Not found${NC}"
    echo "  Run 'npx prisma db push && npx prisma db seed'"
fi

echo ""
echo "========================================="
echo -e "${GREEN}Setup verification complete!${NC}"
echo "========================================="
echo ""
echo "To start the development server:"
echo "  yarn dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
