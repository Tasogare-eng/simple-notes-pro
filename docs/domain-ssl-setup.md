# Domain and SSL Configuration Guide

This guide covers setting up a custom domain and SSL certificate for Simple Notes Pro.

## Option 1: Using Vercel (Recommended)

### Step 1: Add Domain in Vercel

1. **Access Project Settings**
   - Go to [vercel.com](https://vercel.com)
   - Select your Simple Notes Pro project
   - Go to **Settings** → **Domains**

2. **Add Custom Domain**
   - Click **"Add"**
   - Enter your domain: `simplenotespro.com`
   - Click **"Add"**

### Step 2: Configure DNS Records

#### For Root Domain (simplenotespro.com)

**If using a DNS provider that supports ALIAS/CNAME flattening:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**If using a DNS provider that requires A records:**
```
Type: A
Name: @
Value: 76.76.19.61
```

#### For Subdomain (www.simplenotespro.com)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Verify Domain

1. **Wait for DNS Propagation**
   - DNS changes can take up to 48 hours
   - Usually takes 5-30 minutes for most providers

2. **Check Domain Status**
   - In Vercel dashboard, domain should show "Valid"
   - SSL certificate will be automatically provisioned

### Step 4: Set Redirect (Optional)

To redirect www to non-www (or vice versa):

1. **Configure Redirect**
   - In Vercel domain settings
   - Set `www.simplenotespro.com` to redirect to `simplenotespro.com`
   - Choose **301 Permanent Redirect**

## Option 2: Using Cloudflare

### Step 1: Add Site to Cloudflare

1. **Create Cloudflare Account**
   - Go to [cloudflare.com](https://cloudflare.com)
   - Sign up or log in

2. **Add Site**
   - Click **"Add a Site"**
   - Enter your domain: `simplenotespro.com`
   - Choose the Free plan

### Step 2: Change Nameservers

1. **Get Cloudflare Nameservers**
   - Cloudflare will provide 2 nameservers
   - Example: `lucas.ns.cloudflare.com` and `mia.ns.cloudflare.com`

2. **Update Domain Registrar**
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Change nameservers to Cloudflare's

### Step 3: Configure DNS Records

1. **Add A Record for Root Domain**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   Proxy status: Proxied (orange cloud)
   ```

2. **Add CNAME for www**
   ```
   Type: CNAME
   Name: www
   Value: simplenotespro.com
   Proxy status: Proxied (orange cloud)
   ```

3. **Add CNAME for Vercel**
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   Proxy status: DNS only (gray cloud)
   ```

### Step 4: Configure SSL

1. **SSL/TLS Settings**
   - Go to **SSL/TLS** → **Overview**
   - Set encryption mode to **"Full (strict)"**

2. **Edge Certificates**
   - Go to **SSL/TLS** → **Edge Certificates**
   - Enable **"Always Use HTTPS"**
   - Enable **"HTTP Strict Transport Security (HSTS)"**

## DNS Providers Specific Instructions

### Namecheap
1. Go to Domain List → Manage
2. Advanced DNS tab
3. Add CNAME record: Host `@`, Value `cname.vercel-dns.com`

### GoDaddy
1. Go to DNS Management
2. Add CNAME: Name `@`, Value `cname.vercel-dns.com`

### Google Domains
1. Go to DNS settings
2. Add CNAME: Name `@`, Data `cname.vercel-dns.com`

### AWS Route 53
1. Create hosted zone for your domain
2. Add ALIAS record: Name `@`, Alias Target `cname.vercel-dns.com`

## Environment Variable Updates

After setting up your domain, update your environment variables:

```bash
# Update in Vercel dashboard and .env.local
NEXT_PUBLIC_SITE_URL=https://simplenotespro.com
```

### Update Stripe Webhook URL
1. Go to Stripe Dashboard → Webhooks
2. Edit your webhook endpoint
3. Change URL to: `https://simplenotespro.com/api/stripe/webhook`

### Update Supabase Redirect URLs
1. Go to Supabase Dashboard → Authentication → Settings
2. Add to Site URL: `https://simplenotespro.com`
3. Add to Redirect URLs:
   - `https://simplenotespro.com/auth/callback`
   - `https://simplenotespro.com/auth/signin`
   - `https://simplenotespro.com/auth/signup`

## SSL Certificate Verification

### Check SSL Status
```bash
# Using OpenSSL
openssl s_client -connect simplenotespro.com:443 -servername simplenotespro.com

# Using curl
curl -I https://simplenotespro.com
```

### Online SSL Checkers
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [SSL Checker](https://www.sslchecker.com/)

## Performance Optimizations

### Enable HTTP/2
- Automatically enabled with SSL on Vercel
- No additional configuration needed

### Enable Gzip Compression
Add to `next.config.ts`:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  // Other config...
}

export default nextConfig
```

### Set up CDN Caching
If using Cloudflare:
1. Go to **Caching** → **Configuration**
2. Set **Caching Level** to "Standard"
3. Enable **Auto Minify** for CSS, JavaScript, and HTML

## Security Headers

### Add Security Headers to Vercel
Create `vercel.json` headers section:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

## Monitoring and Analytics

### Set up Domain Monitoring
- Use UptimeRobot or Pingdom for uptime monitoring
- Set up alerts for downtime

### DNS Monitoring
- Monitor DNS propagation with DNSChecker.org
- Set up monitoring for DNS changes

## Troubleshooting

### Common Issues

1. **Domain not propagating**
   - Check DNS settings with `nslookup simplenotespro.com`
   - Wait up to 48 hours for full propagation

2. **SSL Certificate not working**
   - Ensure domain is verified in Vercel
   - Check that DNS points to correct servers

3. **Redirect loops**
   - Check Cloudflare SSL mode (should be Full or Full Strict)
   - Verify redirect configurations

### Debug Commands
```bash
# Check DNS resolution
dig simplenotespro.com
nslookup simplenotespro.com

# Check SSL certificate
curl -vI https://simplenotespro.com

# Test specific DNS servers
dig @8.8.8.8 simplenotespro.com
```

## Next Steps

After domain and SSL setup:
1. Test the full application on the new domain
2. Update all documentation and links
3. Set up monitoring and alerts
4. Configure analytics (Google Analytics, etc.)
5. Submit sitemap to Google Search Console