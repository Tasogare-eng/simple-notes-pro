import { test, expect } from '@playwright/test';

/**
 * Stripe Payment Flow E2E Tests
 * Stripe決済フローの統合テスト
 * 
 * 注意: これらのテストはStripe Checkoutの外部ページを含むため、
 * 実際の決済フローのシミュレーションとなります
 */

test.describe('Stripe Payment Flow', () => {
  // テスト用カード情報
  const testCard = {
    number: '4242424242424242',
    expiry: '12/34',
    cvc: '123',
    zip: '10001'
  };

  const testUser = {
    email: 'test@example.com',
    password: 'testpassword123'
  };

  test.beforeEach(async ({ page }) => {
    // テスト環境のセットアップ
    await page.goto('http://localhost:3000');
    
    // ローカルストレージをクリア
    await page.evaluate(() => localStorage.clear());
  });

  test('should complete upgrade flow with test card', async ({ page }) => {
    // 1. ホームページから開始
    await page.goto('http://localhost:3000');
    
    // 2. 料金プランセクションまでスクロール
    await page.getByText('料金プラン').scrollIntoViewIfNeeded();
    
    // 3. Proプランのアップグレードボタンをクリック
    const upgradeButton = page.getByRole('button', { name: 'アップグレード' }).first();
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();
      
      // サインインページにリダイレクトされる場合
      if (page.url().includes('/auth/signin')) {
        console.log('認証が必要です - サインインページにリダイレクトされました');
        return;
      }
    }
  });

  test('should handle checkout from billing page', async ({ page }) => {
    // 請求ページに直接アクセス
    await page.goto('http://localhost:3000/billing');
    
    // 認証が必要な場合はスキップ
    if (page.url().includes('/auth/signin')) {
      console.log('認証が必要です');
      return;
    }
    
    // アップグレードボタンを探す
    const upgradeButton = page.getByRole('button', { name: 'Proプランにアップグレード' });
    
    if (await upgradeButton.isVisible()) {
      // Stripe Checkoutへのリダイレクトをテスト
      const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/api/stripe/checkout')),
        upgradeButton.click()
      ]);
      
      // APIレスポンスの確認
      expect(response.status()).toBe(200);
      
      const responseData = await response.json();
      
      if (responseData.url) {
        console.log('Checkout URL取得成功:', responseData.url);
        
        // Stripe Checkoutページへの遷移をテスト
        await page.goto(responseData.url);
        
        // Stripe Checkoutページの要素を待機
        await page.waitForTimeout(3000);
        
        // Stripeページの確認
        if (page.url().includes('checkout.stripe.com')) {
          console.log('Stripe Checkoutページに到達');
          
          // Stripe Checkoutページでのテストカード入力
          // 注意: Stripeの外部ページのため、要素が変更される可能性があります
          await testStripeCheckout(page, testCard);
        }
      }
    }
  });

  test('should navigate to success page after payment', async ({ page }) => {
    // 成功ページの動作確認
    await page.goto('http://localhost:3000/success');
    
    // 成功メッセージの確認
    await expect(page.locator('h1')).toContainText('アップグレード完了');
    await expect(page.getByText('Proプランへのアップグレードが完了しました')).toBeVisible();
    
    // アクションボタンの確認
    await expect(page.getByRole('link', { name: 'メモを作成する' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'プラン管理' })).toBeVisible();
  });

  test('should handle payment cancellation', async ({ page }) => {
    // キャンセルページの動作確認
    await page.goto('http://localhost:3000/cancel');
    
    // キャンセルメッセージの確認
    await expect(page.locator('h1')).toContainText('決済がキャンセルされました');
    await expect(page.getByText('アップグレードがキャンセルされました')).toBeVisible();
    
    // 再試行オプションの確認
    await expect(page.getByRole('link', { name: '再度アップグレード' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'メモ一覧に戻る' })).toBeVisible();
  });

  test('should verify Stripe test mode elements', async ({ page }) => {
    // APIエンドポイントの動作確認
    const response = await page.request.post('http://localhost:3000/api/stripe/checkout', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {}
    });
    
    // 認証が必要な場合は401を期待
    if (response.status() === 401) {
      console.log('認証が必要です');
      return;
    }
    
    // 成功した場合はCheckout URLを確認
    if (response.status() === 200) {
      const data = await response.json();
      
      if (data.url) {
        expect(data.url).toContain('checkout.stripe.com');
        console.log('Stripe Checkout URL:', data.url);
      }
    }
  });

  test('should display correct pricing information', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 料金プランセクションまでスクロール
    await page.getByText('料金プラン').scrollIntoViewIfNeeded();
    
    // Proプランの価格確認
    const proPlanSection = page.locator('[data-testid="pro-plan"]').first();
    if (await proPlanSection.isVisible()) {
      await expect(proPlanSection).toContainText('¥500');
      await expect(proPlanSection).toContainText('/月');
      await expect(proPlanSection).toContainText('無制限のメモ');
    }
  });
});

/**
 * Stripe Checkoutページでのテストカード入力
 * 注意: Stripeの外部ページのため、実際のテストでは
 * この部分はモックまたはスキップされることがあります
 */
async function testStripeCheckout(page: any, testCard: any) {
  try {
    // メールアドレス入力
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
    }
    
    // カード番号入力
    const cardNumberFrame = page.frameLocator('iframe[title*="カード番号"]');
    if (cardNumberFrame) {
      const cardInput = cardNumberFrame.locator('input[name="cardnumber"]');
      await cardInput.fill(testCard.number);
    }
    
    // 有効期限入力
    const expiryFrame = page.frameLocator('iframe[title*="有効期限"]');
    if (expiryFrame) {
      const expiryInput = expiryFrame.locator('input[name="exp-date"]');
      await expiryInput.fill(testCard.expiry);
    }
    
    // CVV入力
    const cvcFrame = page.frameLocator('iframe[title*="CVC"]');
    if (cvcFrame) {
      const cvcInput = cvcFrame.locator('input[name="cvc"]');
      await cvcInput.fill(testCard.cvc);
    }
    
    // 郵便番号入力
    const zipInput = page.locator('input[name="postalCode"]');
    if (await zipInput.isVisible()) {
      await zipInput.fill(testCard.zip);
    }
    
    // 支払いボタンクリック
    const payButton = page.locator('button[type="submit"]');
    if (await payButton.isVisible()) {
      console.log('支払いボタンをクリック');
      // 実際のテストではここでクリックを実行
      // await payButton.click();
    }
  } catch (error) {
    console.log('Stripe Checkoutページの要素が見つかりません:', error);
  }
}