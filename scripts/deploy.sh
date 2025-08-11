#!/bin/bash

# Simple Notes Pro Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 Simple Notes Pro Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI is not installed. Install with: npm i -g vercel"
        echo "You can still deploy manually through the Vercel dashboard"
    fi
    
    print_success "Dependencies check completed"
}

# Install dependencies
install_deps() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Run build test
test_build() {
    print_status "Testing production build..."
    if npm run build; then
        print_success "Build test passed"
    else
        print_error "Build test failed"
        exit 1
    fi
}

# Run linting
lint_check() {
    print_status "Running linting checks..."
    if npm run lint; then
        print_success "Linting passed"
    else
        print_error "Linting failed"
        exit 1
    fi
}

# Environment setup
setup_env() {
    print_status "Checking environment configuration..."
    
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found"
        echo "Please create .env.local based on .env.example"
        echo "Copy .env.example to .env.local and fill in your values"
        return 1
    fi
    
    # Check for required environment variables
    required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY" "STRIPE_SECRET_KEY" "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "STRIPE_WEBHOOK_SECRET")
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" .env.local || grep -q "^$var=$" .env.local; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing or empty environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        return 1
    fi
    
    print_success "Environment configuration looks good"
}

# Deploy with Vercel CLI
deploy_vercel() {
    if command -v vercel &> /dev/null; then
        print_status "Deploying with Vercel CLI..."
        
        # Set production environment variables
        echo "Please make sure you have set the following environment variables in Vercel:"
        echo "- NEXT_PUBLIC_SUPABASE_URL"
        echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "- SUPABASE_SERVICE_ROLE_KEY"
        echo "- STRIPE_SECRET_KEY"
        echo "- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        echo "- STRIPE_WEBHOOK_SECRET"
        echo "- NEXT_PUBLIC_SITE_URL"
        
        read -p "Have you set all environment variables in Vercel? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            vercel --prod
            print_success "Deployment completed!"
        else
            print_warning "Please set environment variables in Vercel dashboard first"
            exit 1
        fi
    else
        print_warning "Vercel CLI not available. Please deploy manually:"
        echo "1. Push your code to GitHub"
        echo "2. Connect your repository to Vercel"
        echo "3. Set environment variables in Vercel dashboard"
        echo "4. Deploy from Vercel dashboard"
    fi
}

# Database setup instructions
db_setup_instructions() {
    print_status "Database setup instructions:"
    echo ""
    echo "1. Go to your Supabase project dashboard"
    echo "2. Navigate to SQL Editor"
    echo "3. Run the SQL script from: supabase/deploy.sql"
    echo "4. Verify that all tables and policies are created correctly"
    echo ""
    print_warning "Make sure to run the database migration before deploying!"
}

# Stripe setup instructions
stripe_setup_instructions() {
    print_status "Stripe setup instructions:"
    echo ""
    echo "1. Create a Pro plan product in Stripe Dashboard"
    echo "2. Set the price to ¥500/month (or your preferred amount)"
    echo "3. Copy the Price ID and set it in STRIPE_PRICE_ID"
    echo "4. Set up webhooks in Stripe:"
    echo "   - Endpoint URL: https://your-domain.com/api/stripe/webhook"
    echo "   - Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_succeeded, invoice.payment_failed"
    echo "5. Copy the webhook secret and set it in STRIPE_WEBHOOK_SECRET"
    echo ""
}

# Main deployment function
main() {
    echo ""
    print_status "Starting deployment process..."
    echo ""
    
    check_dependencies
    echo ""
    
    install_deps
    echo ""
    
    if ! setup_env; then
        echo ""
        print_error "Environment setup failed. Please fix the issues above."
        exit 1
    fi
    echo ""
    
    lint_check
    echo ""
    
    test_build
    echo ""
    
    db_setup_instructions
    echo ""
    
    stripe_setup_instructions
    echo ""
    
    deploy_vercel
    echo ""
    
    print_success "🎉 Deployment process completed!"
    echo ""
    print_status "Next steps:"
    echo "1. Verify your application is running correctly"
    echo "2. Test the signup and payment flows"
    echo "3. Monitor logs for any issues"
    echo "4. Set up monitoring and analytics"
    echo ""
    print_success "Your Simple Notes Pro app should now be live! 🚀"
}

# Check if script is being run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi