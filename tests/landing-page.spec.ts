import { test, expect } from '@playwright/test';

/**
 * Landing Page E2E Tests
 * ランディングページのE2Eテスト
 */

test.describe('Landing Page', () => {
  test('should display landing page with all sections', async ({ page }) => {
    await page.goto('/');
    
    // ヘロセクションの確認
    await expect(page.locator('h1')).toContainText('Simple Notes Pro');
    await expect(page.getByText('シンプルで高機能なメモアプリ')).toBeVisible();
    
    // 機能セクションの確認
    await expect(page.getByText('主な機能')).toBeVisible();
    
    // 料金セクションの確認
    await expect(page.getByText('料金プラン')).toBeVisible();
    await expect(page.getByTestId('free-plan')).toBeVisible();
    await expect(page.getByTestId('pro-plan')).toBeVisible();
    
    // FAQセクションの確認
    await expect(page.getByText('よくある質問')).toBeVisible();
  });

  test('should navigate to sign up page from CTA button', async ({ page }) => {
    await page.goto('/');
    
    // メインCTAボタンをクリック
    await page.getByRole('link', { name: '無料で始める' }).first().click();
    
    // サインアップページに遷移することを確認
    await expect(page).toHaveURL('/auth/signup');
    await expect(page.locator('h1')).toContainText('アカウント作成');
  });

  test('should navigate to sign in page from header', async ({ page }) => {
    await page.goto('/');
    
    // ヘッダーのログインリンクをクリック
    await page.getByRole('link', { name: 'ログイン' }).click();
    
    // サインインページに遷移することを確認
    await expect(page).toHaveURL('/auth/signin');
    await expect(page.locator('h1')).toContainText('ログイン');
  });

  test('should display pricing information correctly', async ({ page }) => {
    await page.goto('/');
    
    // 無料プランの詳細
    const freePlan = page.locator('[data-testid="free-plan"]').first();
    await expect(freePlan).toBeVisible();
    await expect(freePlan.locator('..').getByText('¥0')).toBeVisible();
    await expect(page.getByText('最大3つのメモ')).toBeVisible();
    
    // Proプランの詳細
    const proPlan = page.locator('[data-testid="pro-plan"]').first();
    await expect(proPlan).toBeVisible();
    await expect(proPlan.locator('..').getByText('¥500')).toBeVisible();
    await expect(page.getByText('無制限のメモ', { exact: true })).toBeVisible();
  });

  test('should have working FAQ accordion', async ({ page }) => {
    await page.goto('/');
    
    // FAQセクションまでスクロール
    await page.getByText('よくある質問').scrollIntoViewIfNeeded();
    
    // 最初のFAQ項目をクリック
    const firstFaq = page.locator('[data-testid="faq-item"]').first();
    await firstFaq.click();
    
    // 回答が表示されることを確認
    await expect(firstFaq.locator('[data-testid="faq-answer"]')).toBeVisible();
  });
});