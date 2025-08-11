# Stripe Webhook Configuration Guide

This guide walks you through setting up Stripe webhooks for Simple Notes Pro in production.

## Prerequisites

- Stripe account with API keys
- Your production domain deployed and accessible
- Simple Notes Pro deployed to production

## Step 1: Create Webhook Endpoint

1. **Login to Stripe Dashboard**
   - Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
   - Navigate to **Developers** → **Webhooks**

2. **Add Endpoint**
   - Click **"Add endpoint"**
   - Enter your endpoint URL: `https://your-domain.com/api/stripe/webhook`
   - Description: "Simple Notes Pro Webhooks"

## Step 2: Configure Events

Select the following events to listen for:

### Required Events
- `checkout.session.completed` - When a customer completes checkout
- `customer.subscription.created` - When a new subscription is created
- `customer.subscription.updated` - When subscription details change
- `customer.subscription.deleted` - When a subscription is cancelled
- `invoice.payment_succeeded` - When payment is successful
- `invoice.payment_failed` - When payment fails

### Optional Events (for enhanced functionality)
- `customer.created` - When a new customer is created
- `customer.updated` - When customer details change
- `invoice.created` - When a new invoice is generated
- `payment_method.attached` - When payment method is added

## Step 3: Get Webhook Secret

1. **Copy Webhook Secret**
   - After creating the webhook, click on it
   - In the **"Signing secret"** section, click **"Reveal"**
   - Copy the secret (starts with `whsec_`)

2. **Set Environment Variable**
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

## Step 4: Test Webhook

1. **Send Test Event**
   - In the webhook details page, click **"Send test webhook"**
   - Select `checkout.session.completed`
   - Click **"Send test webhook"**

2. **Verify Response**
   - Check that the webhook responds with `200 OK`
   - Look at the **"Recent deliveries"** section for any errors

## Step 5: Create Product and Price

1. **Create Product**
   - Go to **Products** in Stripe Dashboard
   - Click **"Add product"**
   - Name: "Simple Notes Pro"
   - Description: "Unlimited notes and premium features"

2. **Add Price**
   - Click **"Add price"**
   - Type: **Recurring**
   - Price: **¥500** (or your preferred amount)
   - Billing period: **Monthly**
   - Click **"Save price"**

3. **Copy Price ID**
   - Copy the Price ID (starts with `price_`)
   - Set environment variable:
   ```bash
   STRIPE_PRICE_ID=price_your_price_id_here
   ```

## Step 6: Configure Customer Portal

1. **Go to Customer Portal Settings**
   - Navigate to **Settings** → **Customer portal**

2. **Configure Portal**
   - **Business information**: Add your business name and website
   - **Customer information**: Allow customers to update email and address
   - **Invoice history**: Enable invoice history
   - **Payment methods**: Allow adding and removing payment methods
   - **Subscriptions**: Allow customers to cancel subscriptions

3. **Set Cancellation Behavior**
   - **Cancellation behavior**: "Cancel at period end"
   - **Proration**: Disabled for downgrades

## Step 7: Environment Variables Checklist

Make sure these are set in your production environment:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_price_id

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Step 8: Test the Full Flow

1. **Test Signup**
   - Visit your production site
   - Sign up for a new account
   - Verify profile is created in Supabase

2. **Test Free Tier**
   - Create 3 notes
   - Verify limit is enforced on 4th note

3. **Test Upgrade Flow**
   - Click upgrade button
   - Complete Stripe Checkout
   - Verify webhook processes the payment
   - Check that user is upgraded to Pro plan

4. **Test Customer Portal**
   - Access billing page as Pro user
   - Click "Manage Subscription"
   - Verify Stripe Customer Portal opens
   - Test updating payment method

## Troubleshooting

### Common Issues

1. **Webhook Timeout**
   - Ensure your endpoint responds within 10 seconds
   - Check server logs for processing delays

2. **Invalid Signature**
   - Verify `STRIPE_WEBHOOK_SECRET` is correct
   - Check that raw request body is used for signature verification

3. **Missing Events**
   - Verify all required events are selected in webhook configuration
   - Check webhook event history for delivery status

4. **Customer Portal Issues**
   - Ensure customer has a valid Stripe customer ID
   - Check that subscription is properly linked to customer

### Debug Webhook Issues

1. **Check Vercel Logs**
   ```bash
   vercel logs your-project-name
   ```

2. **Check Stripe Webhook Logs**
   - Go to webhook details in Stripe Dashboard
   - Check "Recent deliveries" for error details

3. **Test Webhook Locally**
   ```bash
   # Install Stripe CLI
   npm install -g stripe-cli
   
   # Forward webhooks to local server
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

## Security Notes

- Never expose webhook secrets in client-side code
- Always verify webhook signatures
- Use HTTPS for webhook endpoints
- Monitor webhook delivery failures
- Set up alerts for failed payments

## Next Steps

After webhook setup is complete:
1. Monitor webhook delivery success rates
2. Set up alerting for failed payments
3. Test edge cases (failed payments, subscription changes)
4. Document any custom webhook handling for your team