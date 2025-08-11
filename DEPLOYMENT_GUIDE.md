# Simple Notes Pro - Complete Deployment Guide

This comprehensive guide will walk you through deploying Simple Notes Pro to production.

## 🚀 Quick Start Checklist

Before starting deployment, ensure you have:

- [ ] Supabase project created
- [ ] Stripe account with API keys
- [ ] Domain name (optional but recommended)
- [ ] GitHub repository with your code
- [ ] Vercel account

## 📋 Pre-Deployment Setup

### 1. Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run Database Migration**
   - Go to SQL Editor in Supabase Dashboard
   - Copy and run the contents of `supabase/deploy.sql`
   - Verify tables and policies are created

3. **Configure Authentication**
   - Go to Authentication → Settings
   - Set Site URL: `https://your-domain.com` (or Vercel URL)
   - Add Redirect URLs:
     - `https://your-domain.com/auth/callback`
     - `https://your-domain.com/auth/signin`
     - `https://your-domain.com/auth/signup`

### 2. Stripe Setup

1. **Create Products and Pricing**
   - Create "Simple Notes Pro" product
   - Add monthly price: ¥500/month
   - Copy the Price ID

2. **Set up Webhooks** (detailed guide in `docs/stripe-webhook-setup.md`)
   - Endpoint: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment.*`
   - Copy webhook secret

3. **Configure Customer Portal**
   - Enable customer portal in Stripe Dashboard
   - Configure cancellation behavior: "Cancel at period end"

## 🌐 Deployment Options

### Option A: Deploy with Vercel (Recommended)

#### Step 1: Connect Repository

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Choose "Simple Notes Pro" project

#### Step 2: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_price_id

# Site
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

#### Step 3: Deploy

1. **Trigger Deployment**
   - Vercel will automatically deploy on push
   - Or manually trigger from dashboard

2. **Verify Deployment**
   - Check build logs for any errors
   - Visit your Vercel URL to test the application

### Option B: Deploy with Manual Script

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Run deployment script
./scripts/deploy.sh
```

The script will:
- Check dependencies
- Test build
- Run linting
- Guide you through environment setup
- Deploy to Vercel

## 🔧 Post-Deployment Configuration

### 1. Domain Setup (Optional)

Follow the detailed guide in `docs/domain-ssl-setup.md`:

1. **Add Domain to Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain

2. **Configure DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`

3. **Update Environment Variables**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

### 2. Update Service Configurations

#### Update Stripe Webhook URL
- Go to Stripe Dashboard → Webhooks
- Update endpoint URL to your production domain

#### Update Supabase URLs
- Update Site URL and Redirect URLs in Supabase Dashboard
- Use your production domain

### 3. Test Full Application Flow

1. **Test Signup Flow**
   - Visit your production site
   - Sign up for a new account
   - Verify account creation in Supabase

2. **Test Free Tier**
   - Create 3 notes
   - Verify 4th note is blocked with upgrade prompt

3. **Test Payment Flow**
   - Click upgrade button
   - Complete Stripe Checkout (use test card: 4242 4242 4242 4242)
   - Verify webhook processes payment
   - Check user is upgraded to Pro

4. **Test Pro Features**
   - Create unlimited notes
   - Access billing page
   - Test customer portal

## 🔒 Security Configuration

### 1. Environment Security

- Never commit `.env.local` to git
- Use Vercel's encrypted environment variables
- Rotate secrets regularly

### 2. Webhook Security

- Always verify webhook signatures
- Use HTTPS for all webhook endpoints
- Monitor webhook delivery failures

### 3. Database Security

- Row Level Security (RLS) is enabled by default
- All policies restrict access to authenticated users' own data
- Service role key is only used server-side

## 📊 Monitoring and Analytics

### 1. Error Monitoring

#### Vercel Logs
```bash
vercel logs your-project-name
```

#### Real-time Monitoring
- Set up Vercel Analytics
- Monitor function execution times
- Track error rates

### 2. Business Metrics

#### Supabase Analytics
- Monitor user signups
- Track note creation
- Analyze usage patterns

#### Stripe Dashboard
- Monitor subscription metrics
- Track revenue
- Analyze churn rates

### 3. Uptime Monitoring

Recommended services:
- UptimeRobot (free tier available)
- Pingdom
- StatusPage.io

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs
vercel logs --follow

# Test build locally
npm run build
```

#### Environment Variable Issues
- Verify all required variables are set
- Check for typos in variable names
- Ensure secrets are properly encoded

#### Database Connection Issues
- Verify Supabase project is active
- Check RLS policies are correctly configured
- Test database connection with service role key

#### Stripe Integration Issues
- Verify webhook endpoint is accessible
- Check webhook signature verification
- Monitor webhook delivery in Stripe Dashboard

#### Authentication Issues
- Verify redirect URLs in Supabase
- Check Site URL configuration
- Test auth flow with network tab open

### Debug Commands

```bash
# Check environment variables
printenv | grep NEXT_PUBLIC

# Test API endpoints
curl https://your-domain.com/api/stripe/webhook

# Verify DNS
dig your-domain.com

# Test SSL
curl -I https://your-domain.com
```

## 🔄 CI/CD Pipeline

### Basic GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📈 Scaling Considerations

### Database Scaling
- Supabase handles scaling automatically
- Monitor connection limits
- Consider read replicas for high traffic

### CDN and Caching
- Vercel provides global CDN
- Configure cache headers for static assets
- Use Cloudflare for additional optimization

### Performance Monitoring
- Enable Vercel Analytics
- Monitor Core Web Vitals
- Set up performance budgets

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migration completed
- [ ] Stripe webhooks tested
- [ ] Domain and SSL configured
- [ ] Error monitoring set up
- [ ] Backup strategy in place
- [ ] Security headers configured
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Team trained on deployment process

## 🆘 Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**
   - Check error logs
   - Monitor performance metrics
   - Review security alerts

2. **Monthly**
   - Update dependencies
   - Review database performance
   - Analyze user feedback

3. **Quarterly**
   - Security audit
   - Performance optimization
   - Feature usage analysis

### Getting Help

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Stripe Support**: [support.stripe.com](https://support.stripe.com)

### Emergency Contacts

Keep these handy for production issues:
- Domain registrar support
- DNS provider support
- Payment processor support
- Hosting provider support

---

🎉 **Congratulations!** Your Simple Notes Pro application should now be running in production!

Remember to:
- Test thoroughly before announcing launch
- Monitor closely for the first few days
- Have a rollback plan ready
- Keep this documentation updated