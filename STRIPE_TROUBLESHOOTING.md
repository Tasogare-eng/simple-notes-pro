# Stripe Checkout エラー - トラブルシューティングガイド

## 🚨 現在発生している問題

**エラー**: "Failed to initiate checkout" が表示される

## 🔍 トラブルシューティング手順

### Step 1: 開発サーバーの再起動

環境変数の変更を反映させるため、開発サーバーを再起動してください：

```bash
# 現在のサーバーを停止 (Ctrl+C)
# 再度起動
npm run dev
```

### Step 2: 環境変数の確認

ブラウザのコンソールまたはターミナルで以下を確認してください：

**必要な環境変数:**
- `STRIPE_SECRET_KEY` (sk_test_...)
- `STRIPE_PRICE_ID` (price_...)
- `NEXT_PUBLIC_SITE_URL` (http://localhost:3000)

### Step 3: Stripe設定の確認

#### 3.1 Stripe価格IDの確認

```bash
# .env.localファイルで確認
grep STRIPE_PRICE_ID .env.local
# 期待値: STRIPE_PRICE_ID=price_1Rv9YYIjGa1HSXyAMxiGT1PE
```

#### 3.2 Stripe Dashboardでの確認

1. [Stripe Dashboard](https://dashboard.stripe.com) にアクセス
2. **Products** → **Simple Notes Pro** を確認
3. 価格ID `price_1Rv9YYIjGa1HSXyAMxiGT1PE` が存在することを確認
4. **Test mode** が有効になっていることを確認

### Step 4: デバッグログの確認

"Upgrade to Pro" ボタンをクリックした後、以下の場所でログを確認：

#### 4.1 ブラウザのコンソール
1. 開発者ツールを開く (F12)
2. **Console** タブを確認
3. エラーメッセージがあれば記録

#### 4.2 サーバーログ (Terminal)
開発サーバーのターミナルで以下のログを確認：

```
Initiating checkout for user: [user-id]
User profile: { plan: 'free', stripeCustomerId: null }
Creating/retrieving Stripe customer...
Stripe customer: [customer-id]
Using price ID: price_1Rv9YYIjGa1HSXyAMxiGT1PE
Creating checkout session with: { customerId: ..., priceId: ..., ... }
Checkout session created: { id: ..., url: ... }
```

### Step 5: 一般的な問題と解決策

#### 5.1 環境変数が読み込まれない

**症状**: `Payment configuration error: Price ID not configured`

**解決策**:
```bash
# 開発サーバーを完全に停止
# .env.localファイルを確認
cat .env.local

# サーバーを再起動
npm run dev
```

#### 5.2 Stripe価格IDが無効

**症状**: `No such price: 'price_xxxxx'`

**解決策**:
1. Stripe Dashboardで価格IDを再確認
2. テストモードとライブモードの混在を確認
3. 正しい価格IDを`.env.local`に設定

#### 5.3 Stripeキーが無効

**症状**: `Invalid API key provided`

**解決策**:
1. `.env.local`の`STRIPE_SECRET_KEY`を確認
2. `sk_test_`で始まっていることを確認
3. Stripe Dashboardでキーを再生成

#### 5.4 ネットワークエラー

**症状**: `Failed to fetch` または `Network error`

**解決策**:
1. インターネット接続を確認
2. ファイアウォール設定を確認
3. VPNを使用している場合は無効化してテスト

### Step 6: 手動テスト手順

#### 6.1 直接API呼び出しテスト

```bash
# APIエンドポイントを直接テスト
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: [your-session-cookie]"
```

#### 6.2 Stripe CLIでのテスト

```bash
# Stripe CLIで価格を確認
stripe prices list --limit 10

# 特定の価格IDを確認
stripe prices retrieve price_1Rv9YYIjGa1HSXyAMxiGT1PE
```

## 🔧 デバッグモードでの実行

### より詳細なログを有効化

次の環境変数を`.env.local`に追加：

```bash
# デバッグモード
DEBUG=stripe:*
STRIPE_LOG_LEVEL=debug
```

### Stripeのテストモード確認

```bash
# Stripeテストキーが正しく設定されているか確認
node -e "
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log('Stripe initialized:', !!stripe);
console.log('Test mode:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'));
"
```

## 📞 さらなるサポートが必要な場合

### ログ情報の収集

以下の情報を収集してください：

1. **サーバーログ**（コンソール出力）
2. **ブラウザのコンソールエラー**
3. **環境変数の状態**（機密情報は除く）
4. **Stripe Dashboardのスクリーンショット**

### 確認事項チェックリスト

- [ ] 開発サーバーを再起動した
- [ ] .env.localファイルに全ての必要な環境変数が設定されている
- [ ] Stripe Dashboardでテストモードが有効
- [ ] 価格ID `price_1Rv9YYIjGa1HSXyAMxiGT1PE` が存在する
- [ ] ブラウザのコンソールにエラーが表示されていない
- [ ] サーバーログで具体的なエラーメッセージを確認した

---

**次のステップ**: 上記の手順を実行した後、具体的なエラーメッセージをお知らせください。より詳細なサポートを提供できます。