# Simple Notes Pro - VPSデプロイガイド

## 📋 概要

このガイドでは、Simple Notes ProをDockerコンテナとしてVPS（Virtual Private Server）にデプロイする方法を説明します。

## 🛠 前提条件

### VPSサーバー要件
- **OS**: Ubuntu 20.04 LTS以上（推奨）
- **メモリ**: 最低2GB（推奨4GB以上）
- **ストレージ**: 最低10GB
- **ネットワーク**: HTTP/HTTPS アクセス可能

### ローカル要件
- Git
- SSH アクセス（VPSへの接続用）

## 🚀 デプロイ手順

### Step 1: VPSサーバーのセットアップ

#### 1.1 Dockerのインストール

```bash
# システムの更新
sudo apt update && sudo apt upgrade -y

# Dockerの公式GPGキーを追加
sudo apt install ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Dockerのリポジトリを追加
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Dockerをインストール
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Dockerを起動・自動起動設定
sudo systemctl start docker
sudo systemctl enable docker

# 現在のユーザーをdockerグループに追加
sudo usermod -aG docker $USER

# ログアウト・ログインして権限を反映
exit
```

#### 1.2 Docker Composeのインストール

```bash
# Docker Compose V2 を確認（通常はDockerと一緒にインストール済み）
docker compose version

# もしインストールされていない場合：
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: プロジェクトのデプロイ

#### 2.1 プロジェクトのクローン

```bash
# プロジェクトをクローン
git clone https://github.com/Tasogare-eng/simple-notes-pro.git
cd simple-notes-pro
```

#### 2.2 環境変数の設定

```bash
# 本番用環境変数ファイルを作成
cp .env.production.example .env.production

# 環境変数を編集
nano .env.production
```

**設定が必要な環境変数:**

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe設定
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_ID=price_your-product-price-id

# アプリケーション設定
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
```

#### 2.3 アプリケーションのデプロイ

```bash
# デプロイスクリプトを実行
./deploy.sh production
```

### Step 3: Nginxリバースプロキシの設定（推奨）

#### 3.1 Nginxのインストール

```bash
sudo apt install nginx
```

#### 3.2 Nginx設定ファイルの作成

```bash
sudo nano /etc/nginx/sites-available/simple-notes-pro
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 3.3 Nginx設定の有効化

```bash
# 設定ファイルを有効化
sudo ln -s /etc/nginx/sites-available/simple-notes-pro /etc/nginx/sites-enabled/

# デフォルト設定を無効化
sudo rm /etc/nginx/sites-enabled/default

# 設定をテスト
sudo nginx -t

# Nginxを再起動
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 4: SSL証明書の設定（Let's Encrypt）

```bash
# Certbotをインストール
sudo apt install certbot python3-certbot-nginx

# SSL証明書を取得
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自動更新を設定
sudo crontab -e
# 以下の行を追加:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 運用・管理

### アプリケーション管理コマンド

```bash
# ログの確認
docker compose logs -f

# コンテナの状態確認
docker compose ps

# アプリケーションの停止
docker compose down

# アプリケーションの再起動
docker compose restart

# 完全な再デプロイ
./deploy.sh production
```

### アップデート手順

```bash
# 最新のコードを取得
git pull origin main

# アプリケーションを再デプロイ
./deploy.sh production
```

### ログの確認

```bash
# アプリケーションログ
docker compose logs -f simple-notes-pro

# Nginxログ
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# システムログ
sudo journalctl -u docker -f
```

## 🔐 セキュリティ設定

### ファイアウォール設定

```bash
# UFWを有効化
sudo ufw enable

# 必要なポートを開放
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# ファイアウォール状態を確認
sudo ufw status
```

### 定期的なセキュリティアップデート

```bash
# 自動アップデートを設定
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 📊 モニタリング

### ヘルスチェック

```bash
# アプリケーションのヘルスチェック
curl http://localhost:3000/api/health

# レスポンス例:
# {
#   "status": "ok",
#   "timestamp": "2025-01-01T00:00:00.000Z",
#   "version": "1.0.0",
#   "environment": "production"
# }
```

### リソース監視

```bash
# コンテナのリソース使用量
docker stats

# システムリソース
htop
df -h
```

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. コンテナが起動しない

```bash
# ログを確認
docker compose logs

# 環境変数を確認
cat .env.production

# ポートの競合を確認
sudo netstat -tulpn | grep 3000
```

#### 2. データベース接続エラー

- Supabase URLとキーが正しいか確認
- ネットワーク接続を確認
- Supabaseプロジェクトの状態を確認

#### 3. Stripe決済エラー

- Stripe本番キーが設定されているか確認
- Webhook URLが正しく設定されているか確認
- ドメインがStripeで承認されているか確認

## 📝 バックアップ

### 定期バックアップスクリプト

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# バックアップディレクトリを作成
mkdir -p $BACKUP_DIR

# プロジェクトファイルをバックアップ
tar -czf $BACKUP_DIR/simple-notes-pro_$DATE.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    /path/to/simple-notes-pro

# 古いバックアップを削除（30日以上）
find $BACKUP_DIR -name "simple-notes-pro_*.tar.gz" -mtime +30 -delete

echo "バックアップ完了: $BACKUP_DIR/simple-notes-pro_$DATE.tar.gz"
```

## 🎯 本番運用チェックリスト

- [ ] 環境変数が正しく設定されている
- [ ] SSL証明書が設定されている
- [ ] ファイアウォールが適切に設定されている
- [ ] 定期バックアップが設定されている
- [ ] モニタリングが設定されている
- [ ] Supabase RLSポリシーが適切に設定されている
- [ ] Stripe本番設定が完了している
- [ ] ドメインDNSが正しく設定されている

## 📞 サポート

問題が発生した場合は、以下の情報を含めてサポートにお問い合わせください：

1. エラーメッセージ
2. `docker compose logs` の出力
3. 実行した手順
4. 環境情報（OS、Dockerバージョンなど）

---

🎉 デプロイが完了したら、`https://your-domain.com` でSimple Notes Proにアクセスできます！