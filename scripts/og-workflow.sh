#!/bin/bash
#
# Complete OG Image Generation Workflow for Shabrang CMS
#
# This script orchestrates the entire OG image generation process:
# 1. Install dependencies (if needed)
# 2. Generate OG images using Playwright
# 3. Update post frontmatter with image paths
# 4. Report results
#
# Usage:
#   ./scripts/og-workflow.sh              # Full workflow
#   ./scripts/og-workflow.sh --setup      # Setup only
#   ./scripts/og-workflow.sh --generate   # Generate images only
#   ./scripts/og-workflow.sh --update     # Update metadata only

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Shabrang CMS - OG Image Workflow${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Function: Setup dependencies
setup_dependencies() {
  echo -e "${YELLOW}📦 Checking dependencies...${NC}\n"

  # Check Python
  if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    echo "   Install from: https://www.python.org/downloads/"
    exit 1
  fi

  echo -e "${GREEN}✓${NC} Python 3: $(python3 --version)"

  # Check pip
  if ! command -v pip3 &> /dev/null; then
    echo -e "${RED}❌ pip3 not found${NC}"
    exit 1
  fi

  echo -e "${GREEN}✓${NC} pip3: $(pip3 --version | cut -d' ' -f1-2)"

  # Check Playwright
  if ! python3 -c "import playwright" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Playwright not installed${NC}"
    echo "   Installing Playwright..."
    pip3 install playwright
  else
    echo -e "${GREEN}✓${NC} Playwright installed"
  fi

  # Check Playwright browsers
  echo -e "\n${YELLOW}🌐 Checking Playwright browsers...${NC}"
  if [ ! -d "$HOME/.cache/ms-playwright" ] && [ ! -d "$HOME/Library/Caches/ms-playwright" ]; then
    echo "   Installing Chromium browser..."
    playwright install chromium
  else
    echo -e "${GREEN}✓${NC} Playwright browsers installed"
  fi

  echo -e "\n${GREEN}✨ Setup complete!${NC}\n"
}

# Function: Generate OG images
generate_images() {
  echo -e "${YELLOW}🎨 Generating OG images...${NC}\n"

  if [ ! -f "scripts/generate-og-images-playwright.py" ]; then
    echo -e "${RED}❌ Generator script not found${NC}"
    exit 1
  fi

  python3 scripts/generate-og-images-playwright.py

  echo -e "\n${GREEN}✅ Image generation complete${NC}\n"
}

# Function: Update post metadata
update_metadata() {
  echo -e "${YELLOW}📝 Updating post metadata...${NC}\n"

  if [ ! -f "scripts/update-post-metadata.js" ]; then
    echo -e "${RED}❌ Update script not found${NC}"
    exit 1
  fi

  # First do a dry run
  echo -e "${BLUE}Running dry-run first...${NC}\n"
  node scripts/update-post-metadata.js --dry-run

  echo -e "\n${YELLOW}Proceed with actual update? (y/n)${NC} "
  read -r response

  if [[ "$response" =~ ^[Yy]$ ]]; then
    node scripts/update-post-metadata.js
    echo -e "\n${GREEN}✅ Metadata update complete${NC}\n"
  else
    echo -e "\n${YELLOW}⏭️  Skipped metadata update${NC}\n"
  fi
}

# Function: Generate report
generate_report() {
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  Summary Report${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

  # Count generated images
  og_dir="public/images/og"
  if [ -d "$og_dir" ]; then
    jpg_count=$(find "$og_dir" -name "*.jpg" -type f 2>/dev/null | wc -l | tr -d ' ')
    echo -e "📸 Generated OG images: ${GREEN}${jpg_count}${NC}"
    echo -e "📁 Output directory: ${BLUE}${og_dir}${NC}\n"

    # Show file sizes
    echo -e "${YELLOW}File sizes:${NC}"
    find "$og_dir" -name "*.jpg" -type f -exec ls -lh {} \; 2>/dev/null | \
      awk '{printf "   %s - %s\n", $9, $5}' | sort

  else
    echo -e "${YELLOW}⚠️  No OG images found${NC}\n"
  fi

  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✨ All done!${NC}\n"
  echo -e "${YELLOW}📋 Next steps:${NC}"
  echo "   1. Review images: ls -lh public/images/og/"
  echo "   2. Review metadata changes: git diff content/"
  echo "   3. Test locally: npm run dev"
  echo "   4. Validate cards:"
  echo "      - Facebook: https://developers.facebook.com/tools/debug/"
  echo "      - Twitter: https://cards-dev.twitter.com/validator"
  echo "   5. Commit changes: git add . && git commit -m 'feat: Add OG images for social sharing'"
  echo ""
}

# Main workflow
case "${1:-}" in
  --setup)
    setup_dependencies
    ;;
  --generate)
    generate_images
    generate_report
    ;;
  --update)
    update_metadata
    ;;
  --help|-h)
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  (none)      Run full workflow (setup + generate + update)"
    echo "  --setup     Setup dependencies only"
    echo "  --generate  Generate OG images only"
    echo "  --update    Update post metadata only"
    echo "  --help      Show this help message"
    echo ""
    ;;
  *)
    # Full workflow
    setup_dependencies
    generate_images
    update_metadata
    generate_report
    ;;
esac
