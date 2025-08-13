import { NextResponse } from 'next/server'

// ヘルスチェック用API
export async function GET() {
  try {
    // 基本的なヘルスチェック
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }

    return NextResponse.json(health, { status: 200 })
  } catch {
    return NextResponse.json(
      { 
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    )
  }
}