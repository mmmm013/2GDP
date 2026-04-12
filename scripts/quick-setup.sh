#!/bin/bash

# Quick Setup Script for G Putnam Music
# Pre-configured with your Supabase project details

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env.local"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Pre-configured Supabase URL from your project
SUPABASE_URL="https://lbzpfqarraegkghxwbah.supabase.co"
SUPABASE_PROJECT_ID="lbzpfqarraegkghxwbah"

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🎵 G Putnam Music - Quick Environment Setup            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if .env.local already exists
if [ -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local already exists!${NC}"
    echo ""
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Cancelled. Your existing .env.local was not modified.${NC}"
        exit 1
    fi
    # Backup existing file
    cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}✓ Backed up existing .env.local${NC}"
    echo ""
fi

echo -e "${GREEN}✨ Good news! I already know your Supabase project details:${NC}"
echo ""
echo -e "  ${BLUE}Project ID:${NC} ${SUPABASE_PROJECT_ID}"
echo -e "  ${BLUE}Project URL:${NC} ${SUPABASE_URL}"
echo ""
echo -e "${YELLOW}I just need ONE more thing from you: your Supabase anon key${NC}"
echo ""

# Show detailed instructions
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}   How to Get Your Supabase Anon Key (30 seconds)         ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Step 1:${NC} Open this link in your browser:"
echo -e "  ${BLUE}https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/settings/api${NC}"
echo ""
echo -e "${GREEN}Step 2:${NC} Look for the section titled \"Project API keys\""
echo ""
echo -e "${GREEN}Step 3:${NC} Find the key labeled \"${YELLOW}anon${NC}\" ${GREEN}or \"${YELLOW}anon public${NC}\""
echo ""
echo -e "${GREEN}Step 4:${NC} Click the ${BLUE}[Copy]${NC} button next to it"
echo ""
echo -e "${GREEN}Step 5:${NC} Paste it below"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Read the anon key
while true; do
    echo -e "${YELLOW}Paste your Supabase anon key here:${NC}"
    echo -e "${YELLOW}(It starts with 'eyJ' and is quite long)${NC}"
    read -p "> " SUPABASE_ANON_KEY
    
    # Validate
    if [ -z "$SUPABASE_ANON_KEY" ]; then
        echo -e "${RED}❌ Key cannot be empty. Please try again.${NC}"
        echo ""
        continue
    fi
    
    if [[ ! "$SUPABASE_ANON_KEY" =~ ^eyJ ]]; then
        echo -e "${RED}❌ This doesn't look like a valid Supabase anon key.${NC}"
        echo -e "${RED}   It should start with 'eyJ'${NC}"
        echo ""
        read -p "Use it anyway? (y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            continue
        fi
    fi
    
    echo -e "${GREEN}✓ Anon key received!${NC}"
    echo ""
    break
done

# Ask about optional Stripe configuration
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}   Optional: Stripe Payment Configuration                 ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Do you want to configure Stripe for payment features?${NC}"
echo -e "${YELLOW}(You can skip this and add it later if needed)${NC}"
echo ""
read -p "Configure Stripe now? (y/N): " -n 1 -r
echo ""

STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}Step 1:${NC} Go to: ${BLUE}https://dashboard.stripe.com/test/apikeys${NC}"
    echo -e "${GREEN}Step 2:${NC} Copy your ${YELLOW}Publishable key${NC} (starts with pk_test_)"
    echo ""
    read -p "Stripe Publishable Key: " STRIPE_PUBLISHABLE_KEY
    
    echo ""
    echo -e "${GREEN}Step 3:${NC} Copy your ${YELLOW}Secret key${NC} (starts with sk_test_)"
    echo ""
    read -p "Stripe Secret Key: " STRIPE_SECRET_KEY
    
    echo -e "${GREEN}✓ Stripe configuration saved!${NC}"
    echo ""
fi

# Create .env.local file
echo "# Environment Variables for G Putnam Music" > "$ENV_FILE"
echo "# Generated on $(date)" >> "$ENV_FILE"
echo "# Auto-configured with your Supabase project details" >> "$ENV_FILE"
echo "" >> "$ENV_FILE"

echo "# Supabase Configuration" >> "$ENV_FILE"
echo "NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL" >> "$ENV_FILE"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY" >> "$ENV_FILE"
echo "" >> "$ENV_FILE"

if [ ! -z "$STRIPE_PUBLISHABLE_KEY" ]; then
    echo "# Stripe Configuration" >> "$ENV_FILE"
    echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY" >> "$ENV_FILE"
    echo "STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY" >> "$ENV_FILE"
    echo "" >> "$ENV_FILE"
fi

echo "# Optional: Deployment URL" >> "$ENV_FILE"
echo "# NEXT_PUBLIC_VERCEL_URL=your-app.vercel.app" >> "$ENV_FILE"

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}  🎉 SUCCESS! Your environment is configured!               ${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ Created: ${NC}$ENV_FILE"
echo ""
echo -e "${YELLOW}What's been configured:${NC}"
echo -e "  ✓ Supabase URL: ${SUPABASE_URL}"
echo -e "  ✓ Supabase Anon Key: ${SUPABASE_ANON_KEY:0:20}..."
if [ ! -z "$STRIPE_PUBLISHABLE_KEY" ]; then
    echo -e "  ✓ Stripe Keys: Configured"
fi
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}   NEXT STEPS:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}1. Test locally:${NC}"
echo -e "   ${BLUE}npm install${NC}"
echo -e "   ${BLUE}npm run dev${NC}"
echo ""
echo -e "${GREEN}2. For Vercel deployment:${NC}"
echo -e "   I've created a helper script for you!"
echo -e "   ${BLUE}./scripts/setup-vercel.sh${NC}"
echo ""
echo -e "   Or manually add these in Vercel Dashboard:"
echo -e "   → Go to: ${BLUE}https://vercel.com/dashboard${NC}"
echo -e "   → Select your project → Settings → Environment Variables"
echo -e "   → Add:"
echo -e "      ${YELLOW}NEXT_PUBLIC_SUPABASE_URL${NC} = ${SUPABASE_URL}"
echo -e "      ${YELLOW}NEXT_PUBLIC_SUPABASE_ANON_KEY${NC} = (your anon key)"
if [ ! -z "$STRIPE_PUBLISHABLE_KEY" ]; then
    echo -e "      ${YELLOW}NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY${NC} = (your key)"
    echo -e "      ${YELLOW}STRIPE_SECRET_KEY${NC} = (your key)"
fi
echo ""
echo -e "${GREEN}3. Verify everything works:${NC}"
echo -e "   ${BLUE}./scripts/verify-env.sh${NC}"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🔒 Security Note:${NC}"
echo -e "  • .env.local is already in .gitignore (safe from git)"
echo -e "  • Never share your keys publicly"
echo -e "  • Use test keys for development, live keys only in production"
echo ""
