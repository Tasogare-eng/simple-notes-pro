#!/bin/bash

# Simple Notes Pro - Vercelデプロイスクリプト
# 使用方法: ./vercel-deploy.sh [production|preview]

set -e

ENVIRONMENT=${1:-preview}
PROJECT_NAME="simple-notes-pro"

echo "🚀 Simple Notes Pro をVercelにデプロイしています..."
echo "📦 環境: $ENVIRONMENT"

# Vercel CLIがインストールされているか確認
if ! command -v vercel &> /dev/null; then
    echo "📥 Vercel CLIをインストールしています..."
    npm install -g vercel
fi

# ログイン確認
echo "🔐 Vercelにログインしています..."
vercel whoami || vercel login

# 依存関係の確認
echo "📦 依存関係をチェックしています..."
npm install

# 型チェック
echo "🔍 TypeScriptの型チェックを実行しています..."
npm run type-check

# ローカルビルドテスト
echo "🔨 ローカルビルドをテストしています..."
npm run build

# 環境変数の確認
echo "🔧 環境変数を確認しています..."
REQUIRED_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "STRIPE_SECRET_KEY"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "STRIPE_PRICE_ID"
    "NEXT_PUBLIC_SITE_URL"
)

for var in "${REQUIRED_VARS[@]}"; do
    if vercel env ls | grep -q "$var"; then
        echo "✅ $var が設定されています"
    else
        echo "❌ $var が設定されていません"
        echo "💡 vercel env add $var で設定してください"
        exit 1
    fi
done

# Git状態の確認
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  コミットされていない変更があります"
    echo "📝 変更をコミットしてからデプロイしてください"
    read -p "続行しますか？ (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# デプロイの実行
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🌟 本番環境にデプロイしています..."
    vercel --prod
else
    echo "🔍 プレビュー環境にデプロイしています..."
    vercel
fi

# デプロイ結果の確認
if [ $? -eq 0 ]; then
    echo "✅ デプロイが完了しました！"
    echo ""
    echo "📊 便利なコマンド:"
    echo "  プロジェクト状態: vercel ls"
    echo "  ログ確認: vercel logs"
    echo "  環境変数確認: vercel env ls"
    echo "  ドメイン確認: vercel domains ls"
    echo ""
    
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "🌐 本番URL: $(vercel ls | grep "$PROJECT_NAME" | awk '{print $2}' | head -1)"
    else
        echo "🔍 プレビューURL: $(vercel ls | grep "$PROJECT_NAME" | awk '{print $2}' | head -1)"
    fi
else
    echo "❌ デプロイに失敗しました"
    echo "📋 ログを確認してください: vercel logs"
    exit 1
fi

echo ""
echo "🎉 デプロイ完了！"