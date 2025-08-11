# Stripe Integration Setup Guide

## Prerequisites

1. **Stripe Account**: Create account at https://stripe.com
2. **Supabase Database**: Must be set up with profiles table
3. **Environment Variables**: Update `.env.local` with Stripe keys

## Quick Setup Steps

### 1. Get Stripe API Keys

In your Stripe Dashboard:
- Go to **Developers > API Keys**
- Copy **Publishable key** and **Secret key** (use Test mode for development)

### 2. Create Product and Price

In Stripe Dashboard:
- Go to **Products**
- Click **Add Product**:
  - Name: `Simple Notes Pro`
  - Description: `Unlimited notes for your ideas`
- Add pricing:
  - Type: `Recurring`
  - Amount: `¥500`
  - Billing period: `Monthly`
  - Currency: `JPY`
- Copy the **Price ID** (starts with `price_`)

### 3. Configure Webhook

In Stripe Dashboard:
- Go to **Developers > Webhooks**
- Click **Add endpoint**
- Endpoint URL: `https://your-domain.com/api/stripe/webhook` (or `http://localhost:3000/api/stripe/webhook` for local)
- Select events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Copy the **Signing secret** (starts with `whsec_`)

### 4. Update Environment Variables

Add to `.env.local`:
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

## Local Development Testing

### Using Stripe CLI

1. **Install Stripe CLI**:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   This will give you a webhook secret starting with `whsec_` - use this in your `.env.local`

4. **Test payment flow**:
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

## Production Setup

### 1. Switch to Live Mode
- In Stripe Dashboard, toggle to **Live mode**
- Get new live API keys and price IDs
- Update environment variables in production

### 2. Configure Production Webhook
- Create webhook endpoint with your production URL
- Use the same events as development
- Update `STRIPE_WEBHOOK_SECRET` in production

## Testing the Integration

### Test Cases to Verify

1. **Checkout Flow**:
   - Free user clicks "Upgrade to Pro"
   - Redirected to Stripe Checkout
   - Complete payment with test card
   - Redirected to success page
   - User plan updated to 'pro' in database

2. **Customer Portal**:
   - Pro user clicks "Manage Subscription" 
   - Opens Stripe Customer Portal
   - Can update payment method
   - Can cancel subscription

3. **Webhook Processing**:
   - Check webhook logs in Stripe Dashboard
   - Verify subscription status updates in database
   - Test subscription cancellation → plan reverts to 'free'

4. **Edge Cases**:
   - Already subscribed user tries to checkout again
   - User without subscription tries to access portal
   - Payment failures and retries

## API Endpoints Created

- **POST** `/api/stripe/checkout` - Creates Stripe Checkout session
- **POST** `/api/stripe/portal` - Creates Customer Portal session  
- **POST** `/api/stripe/webhook` - Handles Stripe webhook events

## Database Integration

The webhooks automatically update the `profiles` table:
- `stripe_customer_id` - Saved after first successful checkout
- `subscription_status` - Updated from Stripe subscription events
- `plan` - Set to 'pro' for active subscriptions, 'free' otherwise

## Webhook Event Handling

- **checkout.session.completed**: Save customer ID, update to Pro plan
- **customer.subscription.created**: Update to Pro plan
- **customer.subscription.updated**: Sync subscription status
- **customer.subscription.deleted**: Revert to Free plan

## Security Notes

- Webhook signatures are verified using `STRIPE_WEBHOOK_SECRET`
- All API routes require user authentication
- Customer data is validated before database updates
- Service role is used for webhook database operations

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**:
   - Check webhook URL is accessible
   - Verify webhook secret matches
   - Check Stripe Dashboard logs

2. **Payment succeeds but plan not updated**:
   - Check webhook processing logs
   - Verify database RLS policies allow service role updates
   - Check customer ID mapping

3. **Customer Portal not accessible**:
   - Ensure user has a `stripe_customer_id`
   - Check API authentication
   - Verify Stripe customer exists

### Debug Commands

```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed

# View webhook logs
stripe logs tail
```

The Stripe integration is now complete and ready for testing! 🚀