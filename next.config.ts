import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker環境での本番ビルド用設定
  output: 'standalone',
  
  // 画像最適化をカスタム設定（必要に応じて）
  images: {
    unoptimized: true
  },
  
  // 静的ファイルの提供設定
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  
  // 実験的機能
  experimental: {
    // サーバーサイドでのスタンドアロン出力を有効化
    outputFileTracingRoot: process.cwd(),
  },
};

export default nextConfig;
