#!/bin/bash

# Environment Verification Script for G Putnam Music
# Verifies that environment variables are properly configured

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
echo -e "${BLUE}║   Environment Variables Verification                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: .env.local file not found${NC}"
    echo ""
    echo -e "${YELLOW}Run the setup wizard first:${NC}"
    echo -e "  ${BLUE}./scripts/setup-env.sh${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Found .env.local file${NC}"
echo ""

# Load environment variables
set -a
source "$ENV_FILE"
set +a

# Verification results
ERRORS=0
WARNINGS=0

# Function to verify a variable
verify_var() {
    local var_name="$1"
    local required="$2"
    local pattern="$3"
    local description="$4"
    
    local value="${!var_name}"
    
    if [ -z "$value" ]; then
        if [ "$required" = "yes" ]; then
            echo -e "${RED}❌ $var_name is not set${NC}"
            echo -e "   ${YELLOW}Description: $description${NC}"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${YELLOW}⚠️  $var_name is not set (optional)${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
        return 1
    fi
    
    # Validate pattern if provided
    if [ ! -z "$pattern" ]; then
        if [[ ! "$value" =~ $pattern ]]; then
            echo -e "${RED}❌ $var_name has invalid format${NC}"
            echo -e "   ${YELLOW}Expected pattern: $pattern${NC}"
            ERRORS=$((ERRORS + 1))
            return 1
        fi
    fi
    
    # Show masked value for security
    local masked_value="${value:0:10}...${value: -4}"
    echo -e "${GREEN}✓ $var_name is set${NC}"
    echo -e "   ${BLUE}Value: $masked_value${NC}"
    return 0
}

echo -e "${BLUE}Checking required variables...${NC}"
echo ""

verify_var "NEXT_PUBLIC_SUPABASE_URL" "yes" "^https://[a-z0-9]+\.supabase\.co$" "Supabase project URL"
verify_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "yes" "^eyJ" "Supabase anonymous key"

echo ""
echo -e "${BLUE}Checking optional variables...${NC}"
echo ""

verify_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "no" "^pk_(test|live)_" "Stripe publishable key"
verify_var "STRIPE_SECRET_KEY" "no" "^sk_(test|live)_" "Stripe secret key"
verify_var "NEXT_PUBLIC_VERCEL_URL" "no" "" "Vercel deployment URL"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✨ All required environment variables are properly configured!${NC}"
    echo ""
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Note: $WARNINGS optional variable(s) not set${NC}"
        echo -e "${YELLOW}This is fine if you don't need those features.${NC}"
        echo ""
    fi
    
    echo -e "${GREEN}You can now:${NC}"
    echo -e "  1. Run the development server: ${BLUE}npm run dev${NC}"
    echo -e "  2. Build for production: ${BLUE}npm run build${NC}"
    echo -e "  3. Deploy to Vercel (after setting vars there)"
    echo ""
    
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s) in environment configuration${NC}"
    echo ""
    echo -e "${YELLOW}Please run the setup wizard to fix:${NC}"
    echo -e "  ${BLUE}./scripts/setup-env.sh${NC}"
    echo ""
    exit 1
fi
