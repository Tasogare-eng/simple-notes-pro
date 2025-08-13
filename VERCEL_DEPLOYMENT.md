# Simple Notes Pro - Vercelデプロイガイド

## 📋 概要

このガイドでは、Simple Notes ProをVercelにデプロイする方法を詳しく説明します。Vercelは自動デプロイ、高速CDN、サーバーレス関数などの機能を提供します。

## 🚀 Vercelデプロイ手順

### Step 1: Vercelアカウントの準備

1. **Vercelアカウント作成**
   - [Vercel](https://vercel.com)にアクセス
   - GitHubアカウントでサインアップ（推奨）

2. **Vercel CLI インストール**（オプション）
   ```bash
   npm install -g vercel
   vercel login
   ```

### Step 2: GitHubリポジトリの準備

```bash
# 最新の変更をプッシュ
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 3: Vercelプロジェクトの作成

#### 3.1 Vercel Dashboard から（推奨）

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. **"New Project"** をクリック
3. GitHubリポジトリ `simple-notes-pro` を選択
4. **"Import"** をクリック

#### 3.2 設定の確認

- **Framework Preset**: Next.js（自動検出）
- **Root Directory**: `./`（デフォルト）
- **Build Command**: `npm run build`（自動設定）
- **Output Directory**: `.next`（自動設定）

### Step 4: 環境変数の設定

#### 4.1 Vercel Dashboard での設定

1. プロジェクト設定画面で **"Settings"** タブ
2. **"Environment Variables"** セクション
3. 以下の環境変数を追加:

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe設定
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_ID=price_your-product-price-id

# アプリケーション設定
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

#### 4.2 Vercel CLI での設定（オプション）

```bash
# プロジェクトディレクトリで実行
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add STRIPE_PRICE_ID production
vercel env add NEXT_PUBLIC_SITE_URL production

# 開発・プレビュー環境用
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
# ... 他の環境変数も同様
```

#### 4.3 環境変数の設定方法詳細

**重要**: Vercelでは環境変数を各環境（Production, Preview, Development）ごとに設定する必要があります。

1. **Dashboard での設定**:
   - Variable Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
   - Environment: Production, Preview, Development（必要に応じて選択）

2. **CLI での設定**:
   ```bash
   # 本番環境用
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   # 値を入力: https://your-project.supabase.co
   
   # プレビュー環境用（同じ値でも別途設定が必要）
   vercel env add NEXT_PUBLIC_SUPABASE_URL preview
   ```

### Step 5: Stripe Webhook URLの設定

#### 5.1 Vercelデプロイ後のURL確認

デプロイ完了後、割り当てられたURLを確認:
```
https://your-app.vercel.app
```

#### 5.2 Stripe Dashboard での Webhook設定

1. [Stripe Dashboard](https://dashboard.stripe.com) → **Webhooks**
2. **"Add endpoint"** をクリック
3. **Endpoint URL**: `https://your-app.vercel.app/api/stripe/webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. **Add endpoint** をクリック
6. **Signing secret** をコピーして `STRIPE_WEBHOOK_SECRET` に設定

### Step 6: カスタムドメインの設定（オプション）

#### 6.1 ドメインの追加

1. Vercel Dashboard → プロジェクト → **"Settings"** → **"Domains"**
2. カスタムドメインを入力（例: `yourdomain.com`）
3. DNSレコードの設定指示に従う

#### 6.2 DNS設定例

```bash
# A レコード
@ → 76.76.19.61

# CNAME レコード  
www → cname.vercel-dns.com
```

## 🔧 Vercel固有の設定

### vercel.json の説明

```json
{
  "framework": "nextjs",
  "env": {
    // 環境変数の参照設定
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url"
  },
  "functions": {
    // API関数のタイムアウト設定
    "src/app/api/stripe/webhook/route.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    // CORS設定
    {
      "source": "/api/stripe/webhook",
      "headers": [
        {
          "key": "Access-Control-Allow-Headers",
          "value": "stripe-signature, content-type"
        }
      ]
    }
  ],
  "rewrites": [
    // URLリライト設定
    {
      "source": "/health",
      "destination": "/api/health"
    }
  ]
}
```

### next.config.ts の最適化

```typescript
const nextConfig: NextConfig = {
  // Docker環境でのみstandalone出力を有効化
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  
  // 画像最適化設定（Vercelでは有効）
  images: {
    unoptimized: process.env.DOCKER_BUILD === 'true'
  },
  
  // Webpack設定でStripe最適化
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'stripe']
    }
    return config
  },
};
```

## 📊 Vercelの機能活用

### Analytics の有効化

1. Vercel Dashboard → プロジェクト → **"Analytics"**
2. **"Enable Analytics"** をクリック
3. パフォーマンス指標を監視

### Edge Functions（将来的に活用可能）

```typescript
// middleware.ts での設定例
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Vercel Edge Functions での処理
  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/billing/:path*']
}
```

### ISR（Incremental Static Regeneration）

```typescript
// pages/api/revalidate.ts
export default async function handler(req, res) {
  try {
    await res.revalidate('/path-to-revalidate')
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}
```

## 🔐 セキュリティとパフォーマンス

### セキュリティヘッダーの設定

```javascript
// next.config.ts に追加
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      }
    ]
  },
}
```

## 📈 モニタリングと最適化

### Real User Monitoring（RUM）

```typescript
// _app.tsx または layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

### Speed Insights

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. ビルドエラー

```bash
# ローカルでビルドテスト
npm run build

# 型エラーの確認
npm run type-check

# 依存関係の確認
npm install
```

#### 2. 環境変数エラー

- Vercel Dashboard で環境変数を再確認
- Production/Preview環境での適用を確認
- ページリロードで反映確認

#### 3. API関数のタイムアウト

```json
// vercel.json での設定
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### 4. Stripe Webhook エラー

- WebhookのURLが正しいか確認
- `STRIPE_WEBHOOK_SECRET` が正しく設定されているか確認
- Vercel Function Logsでエラー詳細を確認

### ログの確認方法

1. **Vercel Dashboard** → プロジェクト → **"Functions"**
2. API関数をクリックしてログを確認
3. リアルタイムログでデバッグ

## 🔄 CI/CDとデプロイフロー

### 自動デプロイ設定

Vercelは自動的に以下のデプロイを実行:

- **Production**: `main` ブランチのプッシュ
- **Preview**: プルリクエストの作成・更新

### GitHub Actionsとの連携（オプション）

```yaml
# .github/workflows/vercel-deploy.yml
name: Vercel Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 本番運用チェックリスト

- [ ] 環境変数が全て正しく設定されている
- [ ] Stripe Webhookが正しく設定されている
- [ ] カスタムドメインが設定されている（必要に応じて）
- [ ] Supabase RLSポリシーが適切に設定されている
- [ ] Analytics が有効化されている
- [ ] セキュリティヘッダーが設定されている
- [ ] パフォーマンス監視が設定されている

## 💰 Vercel料金プラン

### Hobby Plan（無料）
- 100GB bandwidth/月
- サーバーレス関数実行時間: 100時間/月
- 個人プロジェクト向け

### Pro Plan（$20/月）
- 1TB bandwidth/月
- サーバーレス関数実行時間: 1000時間/月
- 商用利用可能
- パスワード保護
- Analytics Pro

## 📞 サポートとリソース

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Vercel Community**: https://github.com/vercel/vercel/discussions

---

🎉 デプロイが完了したら、Vercelの提供するURLまたはカスタムドメインでSimple Notes Proにアクセスできます！