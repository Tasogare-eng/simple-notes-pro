#!/bin/bash

# Simple Notes Pro - VPSデプロイスクリプト
# 使用方法: ./deploy.sh [environment]

set -e

# 環境設定（デフォルト: production）
ENVIRONMENT=${1:-production}
PROJECT_NAME="simple-notes-pro"
CONTAINER_NAME="simple-notes-pro"

echo "🚀 Simple Notes Pro をデプロイしています..."
echo "📦 環境: $ENVIRONMENT"

# 既存のコンテナを停止・削除
echo "📦 既存のコンテナを停止しています..."
docker-compose down --remove-orphans || true

# イメージをビルド
echo "🔨 Dockerイメージをビルドしています..."
docker-compose build --no-cache

# 古いイメージを削除（スペース節約）
echo "🧹 古いイメージを削除しています..."
docker system prune -f

# 環境変数ファイルの確認
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production ファイルが見つかりません"
    echo "📝 .env.production.example をコピーして設定してください"
    exit 1
fi

# コンテナを起動
echo "🎯 アプリケーションを起動しています..."
docker-compose up -d

# ヘルスチェック
echo "🔍 ヘルスチェックを実行しています..."
sleep 10

# 最大30回（約5分）ヘルスチェックを試行
for i in {1..30}; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ アプリケーションが正常に起動しました！"
        echo "🌐 アクセス URL: http://localhost:3000"
        break
    else
        echo "⏳ アプリケーションの起動を待機中... ($i/30)"
        sleep 10
    fi
    
    if [ $i -eq 30 ]; then
        echo "❌ アプリケーションの起動に失敗しました"
        echo "📋 ログを確認してください:"
        docker-compose logs --tail=50
        exit 1
    fi
done

echo "🎉 デプロイが完了しました！"
echo ""
echo "📊 コンテナの状態:"
docker-compose ps

echo ""
echo "📝 便利なコマンド:"
echo "  ログを確認: docker-compose logs -f"
echo "  コンテナ停止: docker-compose down"
echo "  再起動: docker-compose restart"