#!/bin/bash

# Environment Setup Script for G Putnam Music
# This script helps you configure environment variables safely

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env.local"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   G Putnam Music - Environment Setup Wizard               ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
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

echo -e "${GREEN}This wizard will help you configure environment variables.${NC}"
echo -e "${GREEN}You'll need access to:${NC}"
echo -e "  1. Your Supabase project (https://supabase.com/dashboard)"
echo -e "  2. Your Stripe account (https://dashboard.stripe.com) [Optional]"
echo ""
echo -e "${YELLOW}Note: You can skip optional variables by pressing Enter${NC}"
echo ""
read -p "Press Enter to continue..."
echo ""

# Function to read a variable with validation
read_var() {
    local var_name="$1"
    local prompt="$2"
    local optional="$3"
    local validation_pattern="$4"
    local help_url="$5"
    
    while true; do
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}$prompt${NC}"
        if [ ! -z "$help_url" ]; then
            echo -e "${YELLOW}📖 Help: $help_url${NC}"
        fi
        if [ "$optional" = "yes" ]; then
            echo -e "${YELLOW}(Optional - press Enter to skip)${NC}"
        fi
        read -p "> " value
        
        # Check if optional and empty
        if [ "$optional" = "yes" ] && [ -z "$value" ]; then
            echo ""
            return 0
        fi
        
        # Validate if pattern provided
        if [ ! -z "$validation_pattern" ] && [ ! -z "$value" ]; then
            if [[ ! "$value" =~ $validation_pattern ]]; then
                echo -e "${RED}❌ Invalid format. Please try again.${NC}"
                continue
            fi
        fi
        
        # Check for non-empty
        if [ -z "$value" ]; then
            echo -e "${RED}❌ This field is required.${NC}"
            continue
        fi
        
        # Store the value
        eval "$var_name='$value'"
        echo -e "${GREEN}✓ Saved${NC}"
        echo ""
        return 0
    done
}

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   SECTION 1: Supabase Configuration (Required)            ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}To find your Supabase credentials:${NC}"
echo -e "  1. Go to https://supabase.com/dashboard"
echo -e "  2. Select your project"
echo -e "  3. Click 'Settings' (gear icon) → 'API'"
echo -e "  4. Copy the values shown below"
echo ""

read_var SUPABASE_URL \
    "Enter your NEXT_PUBLIC_SUPABASE_URL:\nExample: https://abcdefghijklmnop.supabase.co" \
    "no" \
    "^https://[a-z0-9]+\.supabase\.co$" \
    "https://supabase.com/dashboard/project/_/settings/api"

read_var SUPABASE_ANON_KEY \
    "Enter your NEXT_PUBLIC_SUPABASE_ANON_KEY:\nExample: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
    "no" \
    "^eyJ" \
    "https://supabase.com/dashboard/project/_/settings/api"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   SECTION 2: Stripe Configuration (Optional)              ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}To find your Stripe keys:${NC}"
echo -e "  1. Go to https://dashboard.stripe.com/test/apikeys"
echo -e "  2. Copy your publishable key and secret key"
echo ""
echo -e "${YELLOW}Skip this section if you don't need payment features.${NC}"
echo ""

read_var STRIPE_PUBLISHABLE_KEY \
    "Enter your NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:\nExample: pk_test_..." \
    "yes" \
    "^pk_(test|live)_" \
    "https://dashboard.stripe.com/test/apikeys"

read_var STRIPE_SECRET_KEY \
    "Enter your STRIPE_SECRET_KEY:\nExample: sk_test_..." \
    "yes" \
    "^sk_(test|live)_" \
    "https://dashboard.stripe.com/test/apikeys"

# Create .env.local file
echo "# Environment variables for G Putnam Music" > "$ENV_FILE"
echo "# Generated on $(date)" >> "$ENV_FILE"
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
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Success! Environment variables have been configured.${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}File created: $ENV_FILE${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Test locally:"
echo -e "     ${BLUE}npm install && npm run dev${NC}"
echo -e ""
echo -e "  2. For Vercel deployment, set these in your Vercel dashboard:"
echo -e "     ${BLUE}https://vercel.com/dashboard → Your Project → Settings → Environment Variables${NC}"
echo -e ""
echo -e "  3. Verify your setup with:"
echo -e "     ${BLUE}./scripts/verify-env.sh${NC}"
echo ""
echo -e "${YELLOW}⚠️  Security Note:${NC}"
echo -e "  - Never commit .env.local to git (it's already in .gitignore)"
echo -e "  - Keep your API keys secure and don't share them"
echo -e "  - Use separate keys for development and production"
echo ""
