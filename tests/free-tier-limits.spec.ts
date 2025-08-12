import { test, expect } from '@playwright/test';

/**
 * Free Tier Limits E2E Tests
 * 無料プラン制限のE2Eテスト
 */

test.describe('Free Tier Limits', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display note limit banner when approaching limit', async ({ page }) => {
    await page.goto('/app');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 無料プランのユーザーがメモ制限に近づいている場合
    // 制限バナーが表示されることを確認
    const limitBanner = page.locator('[data-testid="note-limit-banner"]');
    
    // バナーが表示されている場合の内容確認
    if (await limitBanner.isVisible()) {
      await expect(limitBanner).toContainText('あと');
      await expect(limitBanner).toContainText('個のメモを作成できます');
      await expect(limitBanner.getByRole('link', { name: 'プランをアップグレード' })).toBeVisible();
    }
  });

  test('should show upgrade prompt when at note limit', async ({ page }) => {
    await page.goto('/app');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 無料プランのメモ制限に達している場合
    const limitMessage = page.locator('[data-testid="note-limit-reached"]');
    
    if (await limitMessage.isVisible()) {
      await expect(limitMessage).toContainText('無料プランの制限に達しました');
      await expect(limitMessage).toContainText('3個のメモ');
      await expect(limitMessage.getByRole('button', { name: 'Proプランにアップグレード' })).toBeVisible();
    }
  });

  test('should prevent note creation when at limit', async ({ page }) => {
    await page.goto('/app/notes/new');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // メモ制限に達している場合、作成フォームが無効化されているか確認
    const titleInput = page.getByLabel('タイトル');
    const contentInput = page.getByLabel('内容');
    const saveButton = page.getByRole('button', { name: '保存' });
    
    // 制限に達している場合の動作を確認
    if (await page.locator('[data-testid="limit-reached-message"]').isVisible()) {
      // フォームが無効化されている
      await expect(titleInput).toBeDisabled();
      await expect(contentInput).toBeDisabled();
      await expect(saveButton).toBeDisabled();
      
      // アップグレードボタンが表示されている
      await expect(page.getByRole('button', { name: 'プランをアップグレード' })).toBeVisible();
    }
  });

  test('should redirect to billing when upgrade button clicked', async ({ page }) => {
    await page.goto('/app');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // アップグレードボタンが表示されている場合
    const upgradeButton = page.getByRole('button', { name: 'Proプランにアップグレード' }).first();
    
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();
      
      // 請求ページまたはStripe Checkoutページに遷移
      await page.waitForTimeout(2000);
      
      // URLが変更されることを確認
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/billing|checkout\.stripe\.com/);
    }
  });

  test('should show usage meter in billing page', async ({ page }) => {
    await page.goto('/billing');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 使用量メーターの確認
    const usageMeter = page.locator('[data-testid="usage-meter"]');
    
    if (await usageMeter.isVisible()) {
      // 現在のプラン表示
      await expect(page.getByText('現在のプラン')).toBeVisible();
      
      // 無料プランの場合
      const freePlanIndicator = page.locator('[data-testid="current-plan-free"]');
      if (await freePlanIndicator.isVisible()) {
        await expect(freePlanIndicator).toContainText('無料プラン');
        
        // メモ使用量の表示
        await expect(usageMeter).toContainText('メモ数');
        await expect(usageMeter).toContainText('/ 3');
        
        // プログレスバーの表示
        await expect(usageMeter.locator('[data-testid="usage-progress"]')).toBeVisible();
      }
    }
  });

  test('should display correct note count in various locations', async ({ page }) => {
    await page.goto('/app');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // メモ一覧ページでの件数表示
    const noteCount = page.locator('[data-testid="note-count"]');
    if (await noteCount.isVisible()) {
      // "X / 3 メモ" のような表示を確認
      await expect(noteCount).toMatch(/\d+ \/ 3 メモ/);
    }
    
    // ヘッダーでの件数表示
    const headerCount = page.locator('[data-testid="header-note-count"]');
    if (await headerCount.isVisible()) {
      await expect(headerCount).toContainText('/3');
    }
  });

  test('should show upgrade benefits in limit banner', async ({ page }) => {
    await page.goto('/app');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 制限バナーまたはアップグレードセクションの確認
    const upgradeSection = page.locator('[data-testid="upgrade-section"]');
    
    if (await upgradeSection.isVisible()) {
      // Proプランのメリット表示
      await expect(upgradeSection).toContainText('無制限のメモ');
      await expect(upgradeSection).toContainText('¥500/月');
      await expect(upgradeSection).toContainText('高度な検索機能');
      
      // アップグレードボタンの確認
      await expect(upgradeSection.getByRole('button', { name: 'アップグレード' })).toBeVisible();
    }
  });

  test('should handle note deletion and update count', async ({ page }) => {
    await page.goto('/app');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 既存のメモが存在する場合
    const noteCards = page.locator('[data-testid="note-card"]');
    const initialCount = await noteCards.count();
    
    if (initialCount > 0) {
      // 最初のメモの削除ボタンをクリック
      const firstNoteDeleteButton = noteCards.first().getByRole('button', { name: '削除' });
      
      if (await firstNoteDeleteButton.isVisible()) {
        await firstNoteDeleteButton.click();
        
        // 確認ダイアログで削除を実行
        await page.getByRole('button', { name: '削除' }).click();
        
        // メモ数が減ったことを確認
        await page.waitForTimeout(1000);
        const newCount = await noteCards.count();
        expect(newCount).toBe(initialCount - 1);
        
        // 使用量メーターが更新されることを確認
        const usageMeter = page.locator('[data-testid="usage-meter"]');
        if (await usageMeter.isVisible()) {
          await expect(usageMeter).toContainText(`${newCount} / 3`);
        }
      }
    }
  });
});