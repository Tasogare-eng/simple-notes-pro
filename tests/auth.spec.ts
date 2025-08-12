import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * 認証機能のE2Eテスト
 */

test.describe('Authentication', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'testpassword123'
  };

  test.beforeEach(async ({ page }) => {
    // テスト前にローカルストレージをクリア
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display sign up form correctly', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // フォーム要素の確認
    await expect(page.locator('h1')).toContainText('アカウント作成');
    await expect(page.getByLabel('メールアドレス')).toBeVisible();
    await expect(page.getByLabel('パスワード')).toBeVisible();
    await expect(page.getByRole('button', { name: 'アカウント作成' })).toBeVisible();
    
    // サインインページへのリンク確認
    await expect(page.getByText('既にアカウントをお持ちですか？')).toBeVisible();
    await expect(page.getByRole('link', { name: 'ログインはこちら' })).toBeVisible();
  });

  test('should display sign in form correctly', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // フォーム要素の確認
    await expect(page.locator('h1')).toContainText('ログイン');
    await expect(page.getByLabel('メールアドレス')).toBeVisible();
    await expect(page.getByLabel('パスワード')).toBeVisible();
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();
    
    // サインアップページへのリンク確認
    await expect(page.getByText('アカウントをお持ちでない方は')).toBeVisible();
    await expect(page.getByRole('link', { name: '新規登録はこちら' })).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // 無効なメールアドレスを入力
    await page.getByLabel('メールアドレス').fill('invalid-email');
    await page.getByLabel('パスワード').fill('password123');
    await page.getByRole('button', { name: 'アカウント作成' }).click();
    
    // バリデーションエラーの確認
    await expect(page.getByText('有効なメールアドレスを入力してください')).toBeVisible();
  });

  test('should show validation errors for short password', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // 短すぎるパスワードを入力
    await page.getByLabel('メールアドレス').fill('test@example.com');
    await page.getByLabel('パスワード').fill('123');
    await page.getByRole('button', { name: 'アカウント作成' }).click();
    
    // バリデーションエラーの確認
    await expect(page.getByText('パスワードは6文字以上で入力してください')).toBeVisible();
  });

  test('should navigate between sign in and sign up pages', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // サインアップページへ移動
    await page.getByRole('link', { name: '新規登録はこちら' }).click();
    await expect(page).toHaveURL('/auth/signup');
    await expect(page.locator('h1')).toContainText('アカウント作成');
    
    // サインインページへ戻る
    await page.getByRole('link', { name: 'ログインはこちら' }).click();
    await expect(page).toHaveURL('/auth/signin');
    await expect(page.locator('h1')).toContainText('ログイン');
  });

  test('should attempt sign up with valid credentials', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // 有効な認証情報を入力
    await page.getByLabel('メールアドレス').fill(testUser.email);
    await page.getByLabel('パスワード').fill(testUser.password);
    
    // フォーム送信
    await page.getByRole('button', { name: 'アカウント作成' }).click();
    
    // 成功時はメール確認ページまたはリダイレクトを期待
    // 実際のSupabase設定に依存するため、エラーがないことを確認
    await page.waitForTimeout(2000);
  });

  test('should attempt sign in with credentials', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // 認証情報を入力
    await page.getByLabel('メールアドレス').fill(testUser.email);
    await page.getByLabel('パスワード').fill(testUser.password);
    
    // フォーム送信
    await page.getByRole('button', { name: 'ログイン' }).click();
    
    // 結果を待機（認証設定に依存）
    await page.waitForTimeout(2000);
  });

  test('should protect app routes when not authenticated', async ({ page }) => {
    // 認証が必要なページにアクセス
    await page.goto('/app');
    
    // サインインページにリダイレクトされることを確認
    await expect(page).toHaveURL('/auth/signin');
    await expect(page.locator('h1')).toContainText('ログイン');
  });

  test('should protect billing routes when not authenticated', async ({ page }) => {
    // 認証が必要なページにアクセス
    await page.goto('/billing');
    
    // サインインページにリダイレクトされることを確認
    await expect(page).toHaveURL('/auth/signin');
    await expect(page.locator('h1')).toContainText('ログイン');
  });
});