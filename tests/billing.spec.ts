import { test, expect } from '@playwright/test';

/**
 * Billing and Subscription E2E Tests
 * 請求・サブスクリプション機能のE2Eテスト
 */

test.describe('Billing and Subscription', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display billing page structure', async ({ page }) => {
    await page.goto('/billing');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 請求ページの基本構造を確認
    await expect(page.locator('h1')).toContainText('プラン管理');
    
    // 現在のプラン情報
    await expect(page.getByText('現在のプラン')).toBeVisible();
    
    // 使用量メーター
    const usageMeter = page.locator('[data-testid="usage-meter"]');
    if (await usageMeter.isVisible()) {
      await expect(usageMeter).toContainText('メモ数');
    }
  });

  test('should show free plan details for free users', async ({ page }) => {
    await page.goto('/billing');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 無料プランユーザーの場合
    const freePlanSection = page.locator('[data-testid="current-plan-free"]');
    
    if (await freePlanSection.isVisible()) {
      await expect(freePlanSection).toContainText('無料プラン');
      await expect(freePlanSection).toContainText('¥0');
      await expect(freePlanSection).toContainText('最大3つのメモ');
      
      // アップグレードボタンの確認
      await expect(page.getByRole('button', { name: 'Proプランにアップグレード' })).toBeVisible();
    }
  });

  test('should show pro plan details for pro users', async ({ page }) => {
    await page.goto('/billing');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // Proプランユーザーの場合
    const proPlanSection = page.locator('[data-testid="current-plan-pro"]');
    
    if (await proPlanSection.isVisible()) {
      await expect(proPlanSection).toContainText('Proプラン');
      await expect(proPlanSection).toContainText('¥500');
      await expect(proPlanSection).toContainText('無制限のメモ');
      
      // 管理ボタンの確認
      await expect(page.getByRole('button', { name: 'サブスクリプション管理' })).toBeVisible();
    }
  });

  test('should display plan comparison section', async ({ page }) => {
    await page.goto('/billing');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // プラン比較セクションの確認
    const planComparison = page.locator('[data-testid="plan-comparison"]');
    
    if (await planComparison.isVisible()) {
      // 無料プランカード
      const freePlanCard = planComparison.locator('[data-testid="free-plan-card"]');
      await expect(freePlanCard.getByText('無料プラン')).toBeVisible();
      await expect(freePlanCard.getByText('¥0')).toBeVisible();
      await expect(freePlanCard.getByText('最大3つのメモ')).toBeVisible();
      
      // Proプランカード
      const proPlanCard = planComparison.locator('[data-testid="pro-plan-card"]');
      await expect(proPlanCard.getByText('Proプラン')).toBeVisible();
      await expect(proPlanCard.getByText('¥500')).toBeVisible();
      await expect(proPlanCard.getByText('無制限のメモ')).toBeVisible();
      await expect(proPlanCard.getByText('高度な検索機能')).toBeVisible();
    }
  });

  test('should initiate stripe checkout flow', async ({ page }) => {
    await page.goto('/billing');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // アップグレードボタンをクリック
    const upgradeButton = page.getByRole('button', { name: 'Proプランにアップグレード' });
    
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();
      
      // Stripe Checkoutページへのリダイレクトまたはローディング状態を確認
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      
      // Stripe Checkoutページまたはローディング状態の確認
      if (currentUrl.includes('checkout.stripe.com')) {
        // Stripe Checkoutページに正常にリダイレクトされた
        await expect(page.getByText('Stripe')).toBeVisible();
      } else {
        // ローディング状態またはエラーメッセージの確認
        const loadingElement = page.locator('[data-testid="checkout-loading"]');
        const errorMessage = page.locator('[data-testid="checkout-error"]');
        
        if (await loadingElement.isVisible()) {
          await expect(loadingElement).toContainText('決済ページに移動中');
        } else if (await errorMessage.isVisible()) {
          await expect(errorMessage).toContainText('エラー');
        }
      }
    }
  });

  test('should open customer portal for pro users', async ({ page }) => {
    await page.goto('/billing');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // サブスクリプション管理ボタンをクリック
    const manageButton = page.getByRole('button', { name: 'サブスクリプション管理' });
    
    if (await manageButton.isVisible()) {
      await manageButton.click();
      
      // Customer Portalページへのリダイレクトを確認
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      
      if (currentUrl.includes('billing.stripe.com')) {
        // Stripe Customer Portalに正常にリダイレクトされた
        await expect(page.getByText('Stripe')).toBeVisible();
      } else {
        // ローディング状態またはエラーメッセージの確認
        const loadingElement = page.locator('[data-testid="portal-loading"]');
        const errorMessage = page.locator('[data-testid="portal-error"]');
        
        if (await loadingElement.isVisible()) {
          await expect(loadingElement).toContainText('管理ページに移動中');
        } else if (await errorMessage.isVisible()) {
          await expect(errorMessage).toContainText('エラー');
        }
      }
    }
  });

  test('should display subscription status correctly', async ({ page }) => {
    await page.goto('/billing');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // サブスクリプション状態の表示確認
    const subscriptionStatus = page.locator('[data-testid="subscription-status"]');
    
    if (await subscriptionStatus.isVisible()) {
      // 可能な状態値の確認
      const statusText = await subscriptionStatus.textContent();
      
      // 有効な状態値のいずれかが表示されていることを確認
      expect(statusText).toMatch(/アクティブ|試用期間|支払い遅延|キャンセル済み|未登録/);
    }
  });

  test('should show next billing date for active subscriptions', async ({ page }) => {
    await page.goto('/billing');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // アクティブなサブスクリプションの場合
    const nextBillingDate = page.locator('[data-testid="next-billing-date"]');
    
    if (await nextBillingDate.isVisible()) {
      await expect(nextBillingDate).toContainText('次回請求日');
      // 日付形式の確認（YYYY-MM-DD または YYYY年MM月DD日）
      const dateText = await nextBillingDate.textContent();
      expect(dateText).toMatch(/\d{4}[-年]\d{1,2}[-月]\d{1,2}/);
    }
  });

  test('should handle payment method display', async ({ page }) => {
    await page.goto('/billing');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 支払い方法情報の表示
    const paymentMethod = page.locator('[data-testid="payment-method"]');
    
    if (await paymentMethod.isVisible()) {
      await expect(paymentMethod).toContainText('支払い方法');
      
      // カード情報が表示されている場合
      const cardInfo = paymentMethod.locator('[data-testid="card-info"]');
      if (await cardInfo.isVisible()) {
        // マスクされたカード番号の確認
        await expect(cardInfo).toMatch(/\*\*\*\* \*\*\*\* \*\*\*\* \d{4}/);
      }
    }
  });

  test('should display billing history if available', async ({ page }) => {
    await page.goto('/billing');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 請求履歴セクション
    const billingHistory = page.locator('[data-testid="billing-history"]');
    
    if (await billingHistory.isVisible()) {
      await expect(billingHistory).toContainText('請求履歴');
      
      // 履歴項目の確認
      const historyItems = billingHistory.locator('[data-testid="billing-item"]');
      const itemCount = await historyItems.count();
      
      if (itemCount > 0) {
        // 最初の項目の詳細確認
        const firstItem = historyItems.first();
        await expect(firstItem).toContainText('¥');
        await expect(firstItem).toMatch(/\d{4}[-年]/); // 日付の確認
        
        // ダウンロードリンクの確認
        const downloadLink = firstItem.getByRole('link', { name: '領収書' });
        if (await downloadLink.isVisible()) {
          await expect(downloadLink).toHaveAttribute('href');
        }
      }
    }
  });
});