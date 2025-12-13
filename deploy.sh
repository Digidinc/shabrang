#!/bin/bash
# Shabrang Deployment Script
# Deploy The Liquid Fortress to VPS

set -e

# Configuration - Update these for your VPS
VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST:-your-vps-ip}"
VPS_PATH="${VPS_PATH:-/var/www/shabrang}"
SSH_KEY="${SSH_KEY:-~/.ssh/id_rsa}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
GOLD='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GOLD}"
echo "╔════════════════════════════════════════════╗"
echo "║         SHABRANG DEPLOYMENT                ║"
echo "║         The Liquid Fortress                ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if dist exists
if [ ! -d "Book/dist" ]; then
    echo -e "${RED}Error: Book/dist not found. Run the build first:${NC}"
    echo "  cd Book && python ../engine/build.py"
    exit 1
fi

# Build first (optional - uncomment if you want auto-rebuild)
# echo -e "${GOLD}Building...${NC}"
# cd Book && ../.venv/bin/python ../engine/build.py && cd ..

# Deploy
echo -e "${GOLD}Deploying to ${VPS_USER}@${VPS_HOST}:${VPS_PATH}${NC}"

# Create remote directory if needed
ssh -i "$SSH_KEY" "${VPS_USER}@${VPS_HOST}" "mkdir -p ${VPS_PATH}"

# Sync files (excluding unnecessary files)
rsync -avz --delete \
    --exclude '.DS_Store' \
    --exclude '*.py' \
    --exclude '__pycache__' \
    --exclude '.venv' \
    --exclude 'node_modules' \
    -e "ssh -i ${SSH_KEY}" \
    Book/dist/ \
    "${VPS_USER}@${VPS_HOST}:${VPS_PATH}/"

echo -e "${GREEN}"
echo "╔════════════════════════════════════════════╗"
echo "║        DEPLOYMENT COMPLETE!                ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "Your book is now live at: https://shabrang.com"
echo ""
echo "Next steps:"
echo "  1. Configure your web server (nginx/caddy) to serve ${VPS_PATH}"
echo "  2. Set up SSL with Let's Encrypt"
echo "  3. Configure DNS to point to your VPS"
echo ""
