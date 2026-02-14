#!/bin/bash

# Quick Start Script for Portfolio Setup
# This script helps you customize and deploy your portfolio quickly

echo "========================================="
echo "Salesforce Developer Portfolio Setup"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install Git first.${NC}"
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Git, Node.js, and npm are installed${NC}"
echo ""

# Get user information
echo "Let's customize your portfolio!"
echo ""

read -p "Enter your full name: " USER_NAME
read -p "Enter your email: " USER_EMAIL
read -p "Enter your GitHub username: " GITHUB_USER
read -p "Enter your LinkedIn profile (username only): " LINKEDIN_USER
read -p "Enter your Trailblazer ID (optional): " TRAILBLAZER_ID

echo ""
echo "Updating files with your information..."

# Update GitHub username in main.js
sed -i.bak "s/const GITHUB_USERNAME = 'yourusername'/const GITHUB_USERNAME = '$GITHUB_USER'/g" js/main.js
rm js/main.js.bak 2>/dev/null

echo -e "${GREEN}✓ Updated GitHub username${NC}"

# Initialize git if not already done
if [ ! -d .git ]; then
    echo ""
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial portfolio setup"
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo -e "${YELLOW}Git repository already exists${NC}"
fi

echo ""
echo "========================================="
echo "Next Steps:"
echo "========================================="
echo ""
echo "1. Manually update your personal information in index.html:"
echo "   - Name, title, bio"
echo "   - Social media links"
echo "   - Project descriptions"
echo ""
echo "2. Install dependencies:"
echo "   ${GREEN}npm install${NC}"
echo ""
echo "3. Test locally:"
echo "   ${GREEN}npm start${NC}"
echo "   Then visit: http://localhost:3000"
echo ""
echo "4. Deploy to Heroku:"
echo "   ${GREEN}heroku login${NC}"
echo "   ${GREEN}heroku create your-app-name${NC}"
echo "   ${GREEN}git push heroku main${NC}"
echo ""
echo "For detailed instructions, see:"
echo "  - README.md"
echo "  - DEPLOYMENT.md"
echo "  - CUSTOMIZATION.md"
echo ""
echo -e "${GREEN}Setup complete! Happy coding!${NC}"

