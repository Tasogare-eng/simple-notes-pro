import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker環境でのみstandalone出力を有効化
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  
  // 画像最適化設定
  images: {
    // Vercelでは最適化を有効、Dockerでは無効
    unoptimized: process.env.DOCKER_BUILD === 'true'
  },
  
  // 実験的機能
  experimental: {
    // サーバーサイドでのスタンドアロン出力を有効化（Docker用）
    outputFileTracingRoot: process.env.DOCKER_BUILD === 'true' ? process.cwd() : undefined,
  },
  
  // Webpack設定
  webpack: (config, { isServer }) => {
    // サーバーサイドでのpolyfillを追加
    if (isServer) {
      config.externals = [...(config.externals || []), 'stripe']
    }
    return config
  },
};

export default nextConfig;
