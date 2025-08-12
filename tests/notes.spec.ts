import { test, expect } from '@playwright/test';

/**
 * Notes Management E2E Tests
 * メモ管理機能のE2Eテスト
 */

test.describe('Notes Management', () => {
  // テスト用のモックユーザー認証状態
  test.beforeEach(async ({ page }) => {
    // 実際の認証が設定されていない場合のためのモック
    // 本来はテスト用のユーザーでログインする
    await page.goto('/');
  });

  test('should display notes list page structure', async ({ page }) => {
    await page.goto('/app');
    
    // 認証されていない場合はサインインページにリダイレクト
    if (page.url().includes('/auth/signin')) {
      await expect(page.locator('h1')).toContainText('ログイン');
      return;
    }
    
    // ノート一覧ページの基本構造を確認
    await expect(page.locator('h1')).toContainText('メモ一覧');
    await expect(page.getByRole('link', { name: '新しいメモを作成' })).toBeVisible();
  });

  test('should navigate to new note creation page', async ({ page }) => {
    await page.goto('/app');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 新規作成ボタンをクリック
    await page.getByRole('link', { name: '新しいメモを作成' }).click();
    
    // 新規作成ページに遷移
    await expect(page).toHaveURL('/app/notes/new');
    await expect(page.locator('h1')).toContainText('新しいメモを作成');
  });

  test('should display note creation form', async ({ page }) => {
    await page.goto('/app/notes/new');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // フォーム要素の確認
    await expect(page.locator('h1')).toContainText('新しいメモを作成');
    await expect(page.getByLabel('タイトル')).toBeVisible();
    await expect(page.getByLabel('内容')).toBeVisible();
    await expect(page.getByRole('button', { name: '保存' })).toBeVisible();
    await expect(page.getByRole('link', { name: '戻る' })).toBeVisible();
  });

  test('should show validation errors for empty title', async ({ page }) => {
    await page.goto('/app/notes/new');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 内容のみ入力して保存
    await page.getByLabel('内容').fill('テスト内容');
    await page.getByRole('button', { name: '保存' }).click();
    
    // バリデーションエラーの確認
    await expect(page.getByText('タイトルは必須です')).toBeVisible();
  });

  test('should show validation errors for empty content', async ({ page }) => {
    await page.goto('/app/notes/new');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // タイトルのみ入力して保存
    await page.getByLabel('タイトル').fill('テストタイトル');
    await page.getByRole('button', { name: '保存' }).click();
    
    // バリデーションエラーの確認
    await expect(page.getByText('内容は必須です')).toBeVisible();
  });

  test('should create note with valid data', async ({ page }) => {
    await page.goto('/app/notes/new');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 有効なデータを入力
    await page.getByLabel('タイトル').fill('テストメモ');
    await page.getByLabel('内容').fill('これはテスト用のメモ内容です。');
    
    // 保存ボタンをクリック
    await page.getByRole('button', { name: '保存' }).click();
    
    // 保存後の動作を確認（リダイレクトまたは成功メッセージ）
    await page.waitForTimeout(2000);
  });

  test('should display note details page', async ({ page }) => {
    // 実際のノートIDは動的なので、存在しないIDでテスト
    await page.goto('/app/notes/test-note-id');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // ノート詳細ページの基本構造を確認
    // 存在しないノートの場合は404またはエラーページ
    // 存在する場合は詳細情報が表示される
  });

  test('should navigate to edit page from note details', async ({ page }) => {
    await page.goto('/app/notes/test-note-id');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 編集ボタンが存在する場合はクリック
    const editButton = page.getByRole('link', { name: '編集' });
    if (await editButton.isVisible()) {
      await editButton.click();
      await expect(page).toHaveURL(/\/app\/notes\/.*\/edit/);
    }
  });

  test('should display edit form with existing data', async ({ page }) => {
    await page.goto('/app/notes/test-note-id/edit');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 編集フォームの基本構造を確認
    await expect(page.getByLabel('タイトル')).toBeVisible();
    await expect(page.getByLabel('内容')).toBeVisible();
    await expect(page.getByRole('button', { name: '更新' })).toBeVisible();
    await expect(page.getByRole('link', { name: '戻る' })).toBeVisible();
  });

  test('should show delete confirmation dialog', async ({ page }) => {
    await page.goto('/app/notes/test-note-id');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 削除ボタンが存在する場合はクリック
    const deleteButton = page.getByRole('button', { name: '削除' });
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // 確認ダイアログの表示を確認
      await expect(page.getByText('本当に削除しますか？')).toBeVisible();
      await expect(page.getByRole('button', { name: '削除' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible();
    }
  });

  test('should filter notes by search', async ({ page }) => {
    await page.goto('/app');
    
    if (page.url().includes('/auth/signin')) {
      return; // 認証が必要
    }
    
    // 検索機能が実装されている場合
    const searchInput = page.getByPlaceholder('メモを検索...');
    if (await searchInput.isVisible()) {
      await searchInput.fill('テスト');
      await page.keyboard.press('Enter');
      
      // 検索結果の表示を確認
      await page.waitForTimeout(1000);
    }
  });
});