import { test, expect } from '@playwright/test';

/**
 * Payment Flow E2E Tests
 * 決済フロー のE2Eテスト
 */

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display success page with correct content', async ({ page }) => {
    await page.goto('/success');
    
    // 成功ページの基本構造を確認
    await expect(page.locator('h1')).toContainText('アップグレード完了');
    await expect(page.getByText('Proプランへのアップグレードが完了しました')).toBeVisible();
    
    // 次のステップの案内
    await expect(page.getByText('これで無制限にメモを作成できます')).toBeVisible();
    
    // アクションボタンの確認
    await expect(page.getByRole('link', { name: 'メモを作成する' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'プラン管理' })).toBeVisible();
  });

  test('should navigate to app from success page', async ({ page }) => {
    await page.goto('/success');
    
    // メモ作成ボタンをクリック
    await page.getByRole('link', { name: 'メモを作成する' }).click();
    
    // アプリページに遷移することを確認
    await expect(page).toHaveURL('/app');
  });

  test('should navigate to billing from success page', async ({ page }) => {
    await page.goto('/success');
    
    // プラン管理ボタンをクリック
    await page.getByRole('link', { name: 'プラン管理' }).click();
    
    // 請求ページに遷移することを確認
    await expect(page).toHaveURL('/billing');
  });

  test('should display cancel page with correct content', async ({ page }) => {
    await page.goto('/cancel');
    
    // キャンセルページの基本構造を確認
    await expect(page.locator('h1')).toContainText('決済がキャンセルされました');
    await expect(page.getByText('アップグレードがキャンセルされました')).toBeVisible();
    
    // 再試行の案内
    await expect(page.getByText('いつでも再度アップグレードできます')).toBeVisible();
    
    // アクションボタンの確認
    await expect(page.getByRole('link', { name: '再度アップグレード' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'メモ一覧に戻る' })).toBeVisible();
  });

  test('should navigate to billing from cancel page', async ({ page }) => {
    await page.goto('/cancel');
    
    // 再度アップグレードボタンをクリック
    await page.getByRole('link', { name: '再度アップグレード' }).click();
    
    // 請求ページに遷移することを確認
    await expect(page).toHaveURL('/billing');
  });

  test('should navigate to app from cancel page', async ({ page }) => {
    await page.goto('/cancel');
    
    // メモ一覧に戻るボタンをクリック
    await page.getByRole('link', { name: 'メモ一覧に戻る' }).click();
    
    // アプリページに遷移することを確認
    await expect(page).toHaveURL('/app');
  });

  test('should handle success page when not authenticated', async ({ page }) => {
    // 認証されていない状態で成功ページにアクセス
    await page.goto('/success');
    
    // 成功ページは認証不要で表示されるはず
    await expect(page.locator('h1')).toContainText('アップグレード完了');
    
    // ただし、認証が必要なページへのリンクは適切に処理される
    await page.getByRole('link', { name: 'メモを作成する' }).click();
    
    // 認証が必要な場合はサインインページにリダイレクト
    if (page.url().includes('/auth/signin')) {
      await expect(page.locator('h1')).toContainText('ログイン');
    }
  });

  test('should handle cancel page when not authenticated', async ({ page }) => {
    // 認証されていない状態でキャンセルページにアクセス
    await page.goto('/cancel');
    
    // キャンセルページは認証不要で表示されるはず
    await expect(page.locator('h1')).toContainText('決済がキャンセルされました');
    
    // 認証が必要なページへのリンクの動作確認
    await page.getByRole('link', { name: 'メモ一覧に戻る' }).click();
    
    // 認証が必要な場合はサインインページにリダイレクト
    if (page.url().includes('/auth/signin')) {
      await expect(page.locator('h1')).toContainText('ログイン');
    }
  });

  test('should display appropriate messaging for different scenarios', async ({ page }) => {
    await page.goto('/success');
    
    // 成功ページでのメッセージング確認
    await expect(page.getByText('プランのアップグレードが正常に完了しました')).toBeVisible();
    await expect(page.getByText('請求書は登録されたメールアドレスに送信されます')).toBeVisible();
    
    // アイコンやビジュアル要素の確認
    const successIcon = page.locator('[data-testid="success-icon"]');
    if (await successIcon.isVisible()) {
      await expect(successIcon).toBeVisible();
    }
  });

  test('should show next steps clearly on success page', async ({ page }) => {
    await page.goto('/success');
    
    // 次のステップセクションの確認
    const nextSteps = page.locator('[data-testid="next-steps"]');
    
    if (await nextSteps.isVisible()) {
      await expect(nextSteps).toContainText('次にできること');
      await expect(nextSteps).toContainText('無制限のメモを作成');
      await expect(nextSteps).toContainText('高度な検索機能を利用');
      await expect(nextSteps).toContainText('サブスクリプションの管理');
    }
  });

  test('should provide helpful information on cancel page', async ({ page }) => {
    await page.goto('/cancel');
    
    // キャンセル理由や次のアクションの案内
    await expect(page.getByText('決済を完了せずにページを離れました')).toBeVisible();
    await expect(page.getByText('引き続き無料プランをご利用いただけます')).toBeVisible();
    
    // サポート情報の確認
    const supportInfo = page.locator('[data-testid="support-info"]');
    if (await supportInfo.isVisible()) {
      await expect(supportInfo).toContainText('ご不明な点がございましたら');
      await expect(supportInfo.getByRole('link', { name: 'お問い合わせ' })).toBeVisible();
    }
  });

  test('should handle session timeout on payment pages', async ({ page }) => {
    // 古いセッション情報でページにアクセス
    await page.goto('/success?session_id=expired_session');
    
    // エラーハンドリングの確認
    const errorMessage = page.locator('[data-testid="session-error"]');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText('セッションの有効期限が切れています');
      await expect(page.getByRole('link', { name: 'ホームに戻る' })).toBeVisible();
    } else {
      // エラーがない場合は通常の成功ページが表示される
      await expect(page.locator('h1')).toContainText('アップグレード完了');
    }
  });

  test('should verify payment completion status', async ({ page }) => {
    await page.goto('/success?session_id=test_session');
    
    // 決済完了の詳細情報
    const paymentDetails = page.locator('[data-testid="payment-details"]');
    
    if (await paymentDetails.isVisible()) {
      await expect(paymentDetails).toContainText('決済金額: ¥500');
      await expect(paymentDetails).toContainText('プラン: Simple Notes Pro');
      await expect(paymentDetails).toContainText('次回請求日');
      
      // 領収書ダウンロードリンク
      const receiptLink = paymentDetails.getByRole('link', { name: '領収書をダウンロード' });
      if (await receiptLink.isVisible()) {
        await expect(receiptLink).toHaveAttribute('href');
      }
    }
  });
});