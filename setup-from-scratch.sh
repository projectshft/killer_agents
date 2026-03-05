#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================="
echo "Killer Agents - Fresh Setup"
echo "========================================="
echo ""

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    echo "Please install Node.js 20.x or higher from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"

# Step 2: Install dependencies
echo ""
echo -e "${BLUE}Step 2: Installing dependencies...${NC}"
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 3: Check .env file
echo ""
echo -e "${BLUE}Step 3: Checking environment configuration...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠ .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit .env and add your API keys:${NC}"
    echo "  - GEMINI_API_KEY: Get from https://aistudio.google.com/app/apikey"
    echo "  - SERP_API_KEY: Get from https://serpapi.com/manage-api-key"
    echo ""
    echo "After adding your keys, run this script again."
    exit 0
fi

# Check if API keys are set
if grep -q "your_gemini_key_here" .env || grep -q "your_serpapi_key_here" .env; then
    echo -e "${YELLOW}⚠ Please update your API keys in .env:${NC}"
    echo "  - GEMINI_API_KEY: Get from https://aistudio.google.com/app/apikey"
    echo "  - SERP_API_KEY: Get from https://serpapi.com/manage-api-key"
    exit 0
fi
echo -e "${GREEN}✓ Environment configured${NC}"

# Step 4: Generate Prisma client
echo ""
echo -e "${BLUE}Step 4: Generating Prisma client...${NC}"
npx prisma generate

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to generate Prisma client${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Prisma client generated${NC}"

# Step 5: Setup database
echo ""
echo -e "${BLUE}Step 5: Setting up database...${NC}"

# Check if database already exists and has data
if [ -f prisma/dev.db ]; then
    INFLUENCER_COUNT=$(echo "SELECT COUNT(*) FROM Influencer;" | sqlite3 prisma/dev.db 2>/dev/null || echo "0")
    if [ "$INFLUENCER_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}⚠ Database already exists with $INFLUENCER_COUNT influencers${NC}"
        read -p "Do you want to reset and reseed the database? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Skipping database setup"
            echo -e "${GREEN}✓ Using existing database${NC}"
        else
            echo "Resetting database..."
            npx prisma db push --force-reset
            echo "Seeding database (this may take a minute)..."
            npx prisma db seed
            echo -e "${GREEN}✓ Database reset and seeded${NC}"
        fi
    else
        echo "Creating database schema..."
        npx prisma db push
        echo "Seeding database with 1000 influencers (this may take a minute)..."
        npx prisma db seed
        echo -e "${GREEN}✓ Database created and seeded${NC}"
    fi
else
    echo "Creating database schema..."
    npx prisma db push
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to create database${NC}"
        exit 1
    fi

    echo "Seeding database with 1000 influencers (this may take a minute)..."
    npx prisma db seed
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to seed database${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Database created and seeded${NC}"
fi

# Final summary
echo ""
echo "========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "========================================="
echo ""
echo "To start the development server:"
echo -e "  ${BLUE}yarn dev${NC}"
echo ""
echo "Then open ${BLUE}http://localhost:3000${NC} in your browser"
echo ""
echo "To verify your setup anytime:"
echo -e "  ${BLUE}./verify-setup.sh${NC}"
echo ""
