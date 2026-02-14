#!/bin/bash

# Deployment script for portfolio
# Automates the deployment process to Heroku

set -e  # Exit on error

echo "🚀 Starting deployment process..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
HEROKU_APP="manas-behera-dev"
BRANCH="main"

# Check if git is clean
if [[ -n $(git status -s) ]]; then
    echo "${YELLOW}⚠️  You have uncommitted changes${NC}"
    echo ""
    git status -s
    echo ""
    read -p "Do you want to commit these changes? (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo "${GREEN}✓ Changes committed${NC}"
    else
        echo "${YELLOW}⚠️  Proceeding with uncommitted changes...${NC}"
    fi
    echo ""
fi

# Run build
echo "${CYAN}🏗️  Running build...${NC}"
if [ -f "scripts/build.sh" ]; then
    ./scripts/build.sh
else
    echo "${YELLOW}⚠️  Build script not found, skipping...${NC}"
fi
echo ""

# Run tests
echo "${CYAN}🧪 Running tests...${NC}"
# Check if server is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    npm test || {
        echo "${RED}✗ Tests failed!${NC}"
        read -p "Deploy anyway? (y/N) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "${RED}Deployment cancelled${NC}"
            exit 1
        fi
    }
else
    echo "${YELLOW}⚠️  Server not running, skipping tests${NC}"
fi
echo ""

# Check if on correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    echo "${YELLOW}⚠️  You are on branch '$CURRENT_BRANCH', expected '$BRANCH'${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "${RED}Deployment cancelled${NC}"
        exit 1
    fi
fi

# Push to Heroku
echo "${CYAN}📤 Deploying to Heroku...${NC}"
echo ""

if git remote | grep -q heroku; then
    echo "Pushing to Heroku..."
    git push heroku $BRANCH || {
        echo "${RED}✗ Heroku deployment failed${NC}"
        exit 1
    }
else
    echo "${RED}✗ Heroku remote not found${NC}"
    echo "Add it with: heroku git:remote -a $HEROKU_APP"
    exit 1
fi

echo ""
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}✓ Deployment completed successfully!${NC}"
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Your portfolio is live at:"
echo "${CYAN}https://$HEROKU_APP-5a0040c069c1.herokuapp.com/${NC}"
echo ""
echo "Useful commands:"
echo "  heroku logs --tail -a $HEROKU_APP    # View logs"
echo "  heroku open -a $HEROKU_APP           # Open in browser"
echo "  heroku ps -a $HEROKU_APP             # Check status"
echo ""

exit 0

