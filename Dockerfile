# マルチステージビルドでNext.jsアプリをビルド
FROM node:18-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production && npm cache clean --force

# ソースコードをコピー
COPY . .

# Docker環境でのビルドを明示
ENV DOCKER_BUILD=true

# Next.jsアプリをビルド
RUN npm run build

# 本番用イメージ
FROM node:18-alpine AS runner

# セキュリティのために非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 作業ディレクトリを設定
WORKDIR /app

# 必要なファイルをbuilderステージからコピー
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 非rootユーザーに切り替え
USER nextjs

# ポート3000を公開
EXPOSE 3000

# 環境変数を設定
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# アプリケーションを起動
CMD ["node", "server.js"]