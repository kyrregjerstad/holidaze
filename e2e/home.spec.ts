import { expect, test } from '@playwright/test';

test('Landing Page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Holidaze/);

  await expect(page.locator('h1')).toContainText('Holidaze');
  await expect(page.locator('h2').first()).toContainText('Your Gateway to Unforgettable Getaways');
});

test('logging in as a venue manager', async ({ page }) => {
  const username = process.env.PLAYWRIGHT_USERNAME!;
  const password = process.env.PLAYWRIGHT_PASSWORD!;

  if (!username || !password) {
    throw new Error('Please provide .env PLAYWRIGHT_USERNAME and PLAYWRIGHT_PASSWORD');
  }

  await page.goto('/');

  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByPlaceholder('email').fill(username);
  await page.getByPlaceholder('password').fill(password);
  await page.getByRole('button', { name: 'Log in ☀️' }).click();
  await expect(page.getByText('Welcome back venue_manager! 👋').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Holidaze' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your Gateway to Unforgettable' })).toBeVisible();
  await page.getByRole('banner').getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Profile' }).click();
  await expect(page.getByRole('heading', { name: 'venue_manager' })).toBeVisible();
});

test('Login page', async ({ page }) => {
  await page.goto('/login');

  await page.getByRole('button', { name: 'Log in ☀️' }).click();
  await expect(page.getByText('Invalid email')).toBeVisible();

  await page.getByPlaceholder('email').fill('test@test.com');
  await page.getByRole('button', { name: 'Log in ☀️' }).click();
  await expect(page.getByText('Incorrect email or password')).toBeVisible();
});

test('Registration page', async ({ page }) => {
  await page.goto('/register');

  await page.getByText('Name').click();

  await test.step('assert that the form is visible', async () => {
    await expect(page.getByPlaceholder('name')).toBeVisible();
    await expect(page.getByPlaceholder('email')).toBeVisible();
    await expect(page.getByPlaceholder('password', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('repeat password')).toBeVisible();
    await expect(page.getByText("I'm a venue manager")).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register ☀️' })).toBeVisible();
    await expect(page.getByText('Already have an account?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  });

  await test.step('form gives validation errors', async () => {
    await page.getByRole('button', { name: 'Register ☀️' }).click();
    await expect(page.getByText('Name must be at least 3 characters')).toBeVisible();
    await expect(page.getByText('Invalid email')).toBeVisible();
    await expect(page.getByText('Password must be at least 8')).toBeVisible();

    await page.getByPlaceholder('name').fill('123');
    await page.getByPlaceholder('email').fill('test@test.com');
    await expect(page.getByText('Only @stud.noroff.no emails are allowed')).toBeVisible();
  });
});
