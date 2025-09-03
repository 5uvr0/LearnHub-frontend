import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true
});

test('Admin Dashboard General Test', async ({ page }) => {
  await page.goto('https://app-rnd01.therapbd.net/learnhub');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Demo@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('.rounded-pill.custom-button-shadow.d-inline-flex.align-items-center.justify-content-center.btn.btn-outline-primary').first().click();
  await page.goto('https://app-rnd01.therapbd.net/learnhub/admin/dashboard');
  await page.getByRole('button', { name: '2' }).click();
  await page.getByRole('button', { name: 'Update Info' }).first().click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Force Logout' }).click();
  await page.goto('https://app-rnd01.therapbd.net/learnhub/admin/dashboard');
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('combobox').selectOption('oldest');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('link', { name: 'Logout' }).click();
});