#!/bin/bash

# Vercel Environment Variables Setup Helper
# Pre-configured with your Supabase project details

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env.local"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Pre-configured values
SUPABASE_URL="https://lbzpfqarraegkghxwbah.supabase.co"
SUPABASE_PROJECT_ID="lbzpfqarraegkghxwbah"

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🚀 Vercel Environment Variables Setup Guide            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: .env.local not found${NC}"
    echo ""
    echo -e "${YELLOW}Please run the setup first:${NC}"
    echo -e "  ${BLUE}./scripts/quick-setup.sh${NC}"
    echo ""
    exit 1
fi

# Load environment variables
set -a
source "$ENV_FILE"
set +a

echo -e "${GREEN}I'll guide you through setting up Vercel environment variables.${NC}"
echo ""
echo -e "${YELLOW}I'll show you EXACTLY what to copy and where to paste it.${NC}"
echo ""
read -p "Press Enter to continue..."
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}   STEP 1: Open Vercel Dashboard                           ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}1.${NC} Open this URL in your browser:"
echo -e "   ${BLUE}https://vercel.com/dashboard${NC}"
echo ""
echo -e "${GREEN}2.${NC} Find and click on your project: ${YELLOW}gputnam-music-final-site${NC}"
echo ""
echo -e "${GREEN}3.${NC} Click the ${YELLOW}Settings${NC} tab"
echo ""
echo -e "${GREEN}4.${NC} Click ${YELLOW}Environment Variables${NC} in the left sidebar"
echo ""
read -p "Press Enter when you're on the Environment Variables page..."
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}   STEP 2: Add Environment Variables                       ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}I'll give you each variable to add, one at a time.${NC}"
echo ""

# Variable 1: Supabase URL
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Variable 1 of 2: Supabase URL${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}In Vercel, click the 'Add New' button, then enter:${NC}"
echo ""
echo -e "${CYAN}Name:${NC}"
echo -e "  ${GREEN}NEXT_PUBLIC_SUPABASE_URL${NC}"
echo ""
echo -e "${CYAN}Value:${NC}"
echo -e "  ${GREEN}$SUPABASE_URL${NC}"
echo ""
echo -e "${YELLOW}Select ALL environments:${NC}"
echo -e "  ✅ Production"
echo -e "  ✅ Preview"
echo -e "  ✅ Development"
echo ""
echo -e "Then click ${YELLOW}Save${NC}"
echo ""
read -p "Press Enter when you've added this variable..."
echo ""

# Variable 2: Supabase Anon Key
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Variable 2 of 2: Supabase Anon Key${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Click 'Add Another', then enter:${NC}"
echo ""
echo -e "${CYAN}Name:${NC}"
echo -e "  ${GREEN}NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}"
echo ""
echo -e "${CYAN}Value:${NC}"
echo -e "  ${GREEN}${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:50}...${NC}"
echo ""
echo -e "${YELLOW}(Copy the full value from your .env.local file)${NC}"
echo -e "Full value: ${BLUE}$NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}"
echo ""
echo -e "${YELLOW}Select ALL environments:${NC}"
echo -e "  ✅ Production"
echo -e "  ✅ Preview"
echo -e "  ✅ Development"
echo ""
echo -e "Then click ${YELLOW}Save${NC}"
echo ""
read -p "Press Enter when you've added this variable..."
echo ""

# Check for Stripe
if [ ! -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ]; then
    echo -e "${YELLOW}I see you have Stripe configured. Add these too:${NC}"
    echo ""
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}Stripe Variable 1: Publishable Key${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${CYAN}Name:${NC} ${GREEN}NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY${NC}"
    echo -e "${CYAN}Value:${NC} ${GREEN}$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY${NC}"
    echo -e "Select all environments, then click ${YELLOW}Save${NC}"
    echo ""
    read -p "Press Enter when done..."
    echo ""
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}Stripe Variable 2: Secret Key${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${CYAN}Name:${NC} ${GREEN}STRIPE_SECRET_KEY${NC}"
    echo -e "${CYAN}Value:${NC} ${GREEN}${STRIPE_SECRET_KEY:0:20}...${NC}"
    echo -e "Full value: ${BLUE}$STRIPE_SECRET_KEY${NC}"
    echo -e "Select all environments, then click ${YELLOW}Save${NC}"
    echo ""
    read -p "Press Enter when done..."
    echo ""
fi

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}   STEP 3: Redeploy Your Application                       ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Now that variables are set, you need to redeploy:${NC}"
echo ""
echo -e "${GREEN}1.${NC} In Vercel, click the ${YELLOW}Deployments${NC} tab"
echo ""
echo -e "${GREEN}2.${NC} Find the most recent deployment (at the top)"
echo ""
echo -e "${GREEN}3.${NC} Click the ${YELLOW}⋯${NC} (three dots) button on the right"
echo ""
echo -e "${GREEN}4.${NC} Select ${YELLOW}Redeploy${NC}"
echo ""
echo -e "${GREEN}5.${NC} Confirm by clicking ${YELLOW}Redeploy${NC} again"
echo ""
echo -e "${GREEN}6.${NC} Wait for deployment to complete (1-2 minutes)"
echo ""
read -p "Press Enter when deployment is complete..."
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}   STEP 4: Verify It Works                                 ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}1.${NC} Click ${YELLOW}Visit${NC} to open your deployed site"
echo ""
echo -e "${GREEN}2.${NC} The page should load WITHOUT the \"Application error\" message"
echo ""
echo -e "${GREEN}3.${NC} Open browser DevTools (press F12)"
echo ""
echo -e "${GREEN}4.${NC} Click the ${YELLOW}Console${NC} tab"
echo ""
echo -e "${GREEN}5.${NC} Look for: ${GREEN}\"🎵 Connecting to G Putnam Archives (tracks)...\"${NC}"
echo ""
echo -e "${GREEN}6.${NC} You should NOT see any Supabase errors"
echo ""
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}  🎉 Congratulations! Your deployment is configured!        ${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Your app should now be live and working at:${NC}"
echo -e "${BLUE}https://gputnam-music-final-site.vercel.app${NC}"
echo ""
