#!/bin/bash

# Deployment script for portfolio
# Pushes to GitHub (primary) and optionally deploys to Heroku

set -e  # Exit on error

echo "🚀 Starting deployment process..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# GitHub Configuration (Primary)
GITHUB_REPO="https://github.com/manaskumarbehera/my-salesforce-portfolio"
BRANCH="main"

# Heroku Configuration (Optional - Separate Deployment)
HEROKU_APP_NAME="manaskumarbehera"
HEROKU_URL="https://${HEROKU_APP_NAME}-5a0040c069c1.herokuapp.com/"

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

# Push to GitHub (primary repository)
echo "${CYAN}📤 Pushing to GitHub...${NC}"
echo ""

git push origin $BRANCH || {
    echo "${RED}✗ GitHub push failed${NC}"
    exit 1
}
echo "${GREEN}✓ Code pushed to GitHub${NC}"
echo ""

# Optionally push to Heroku
echo "${CYAN}📤 Deploying to Heroku...${NC}"
echo ""

if git remote | grep -q heroku; then
    read -p "Do you want to deploy to Heroku as well? (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Pushing to Heroku..."
        git push heroku $BRANCH || {
            echo "${RED}✗ Heroku deployment failed${NC}"
            exit 1
        }
        echo "${GREEN}✓ Deployed to Heroku${NC}"
    else
        echo "${YELLOW}⚠️  Skipping Heroku deployment${NC}"
    fi
else
    echo "${YELLOW}⚠️  Heroku remote not found, skipping...${NC}"
fi

echo ""
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}✓ Deployment completed successfully!${NC}"
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Your code is pushed to GitHub:"
echo "${CYAN}${GITHUB_REPO}${NC}"
echo ""
echo "Heroku (if deployed):"
echo "${CYAN}${HEROKU_URL}${NC}"
echo ""
echo "Useful commands:"
echo "  git push origin main                        # Push to GitHub"
echo "  git push heroku main                        # Deploy to Heroku"
echo "  heroku logs --tail -a $HEROKU_APP_NAME      # View Heroku logs"
echo "  heroku open -a $HEROKU_APP_NAME             # Open Heroku in browser"
echo ""

exit 0

