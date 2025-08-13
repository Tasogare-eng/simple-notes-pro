#!/bin/bash

# Simple Notes Pro - Vercel環境変数設定スクリプト
# 使用方法: ./vercel-env-setup.sh

set -e

echo "🔧 Simple Notes Pro - Vercel環境変数設定"
echo "============================================"

# Vercel CLIがインストールされているか確認
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLIがインストールされていません"
    echo "📥 以下のコマンドでインストールしてください:"
    echo "   npm install -g vercel"
    exit 1
fi

# .env.localファイルが存在するか確認
if [ ! -f ".env.local" ]; then
    echo "❌ .env.localファイルが見つかりません"
    echo "📝 先に開発環境の設定を完了してください"
    exit 1
fi

echo "📋 .env.localから環境変数を読み込んでいます..."

# .env.localから環境変数を読み込み
source .env.local

# 必要な環境変数をチェック
REQUIRED_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "STRIPE_SECRET_KEY"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "STRIPE_PRICE_ID"
)

echo "🔍 必要な環境変数をチェックしています..."
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ $var が設定されていません"
        exit 1
    else
        echo "✅ $var"
    fi
done

# Vercelにログイン
echo ""
echo "🔐 Vercelにログインしています..."
vercel whoami || vercel login

# 環境変数の設定関数
set_env_var() {
    local var_name=$1
    local var_value=$2
    local environment=$3
    
    echo "📝 設定中: $var_name ($environment)"
    echo "$var_value" | vercel env add "$var_name" "$environment" --force
}

# 本番環境の設定
echo ""
echo "🌟 本番環境(Production)の環境変数を設定しています..."

# 本番用のサイトURLを取得
read -p "🌐 本番用のサイトURL（例: https://your-app.vercel.app）: " PROD_SITE_URL

for var in "${REQUIRED_VARS[@]}"; do
    set_env_var "$var" "${!var}" "production"
done

# 本番用サイトURLを設定
set_env_var "NEXT_PUBLIC_SITE_URL" "$PROD_SITE_URL" "production"

# プレビュー環境の設定
echo ""
read -p "🔍 プレビュー環境にも同じ設定を適用しますか？ (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔍 プレビュー環境(Preview)の環境変数を設定しています..."
    
    for var in "${REQUIRED_VARS[@]}"; do
        set_env_var "$var" "${!var}" "preview"
    done
    
    # プレビュー環境では動的URLを使用
    set_env_var "NEXT_PUBLIC_SITE_URL" "https://\$VERCEL_URL" "preview"
fi

# 開発環境の設定
echo ""
read -p "💻 開発環境にも設定を適用しますか？ (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "💻 開発環境(Development)の環境変数を設定しています..."
    
    for var in "${REQUIRED_VARS[@]}"; do
        set_env_var "$var" "${!var}" "development"
    done
    
    set_env_var "NEXT_PUBLIC_SITE_URL" "http://localhost:3000" "development"
fi

echo ""
echo "✅ 環境変数の設定が完了しました！"
echo ""
echo "📊 設定された環境変数を確認:"
vercel env ls

echo ""
echo "🎯 次のステップ:"
echo "1. Stripe Webhookの設定"
echo "   URL: $PROD_SITE_URL/api/stripe/webhook"
echo "2. Vercelでのデプロイ実行"
echo "   コマンド: vercel --prod"
echo ""
echo "📝 詳細は VERCEL_DEPLOYMENT.md を参照してください"