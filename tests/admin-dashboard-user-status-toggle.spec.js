import { test, expect } from '@playwright/test';

test.use({
    ignoreHTTPSErrors: true
});

test('Admin Dashboard User Status Toggle', async ({ page }) => {
    await page.goto('https://app-rnd01.therapbd.net/learnhub');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('admin@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Demo@123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText('Email: admin@gmail.com').click();
    await page.getByRole('paragraph').filter({ hasText: /^Status: Enabled$/ }).click();
    await page.getByRole('button', { name: 'Show Site Statistics' }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Go to Kafka Dashboard' }).click();
    const page1 = await page1Promise;
    const page2Promise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Go to Hazelcast Dashboard' }).click();
    const page2 = await page2Promise;
    await page.locator('div:nth-child(5) > .d-flex.flex-column > .d-flex.justify-content-end > .rounded-pill').click();
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => { });
    });
    await page.getByRole('button', { name: 'Disable' }).click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByRole('button', { name: 'Disabled' }).click();
    await page.getByText('playwright_instructor_new@').click();
    await page.getByText('Status: Disabled').click();
    await page.getByRole('button', { name: 'Update Info' }).click();
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => { });
    });
    await page.getByRole('button', { name: 'Enable' }).click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByRole('textbox', { name: 'Filter by email...' }).click();
    await page.getByRole('textbox', { name: 'Filter by email...' }).fill('playwright');
    await page.getByText('playwright_instructor_new@').click();
    await page.getByRole('button', { name: 'Update Info' }).nth(1).click();
    await page.getByText('Status:').click();
    await page.getByText('Enabled').click();
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => { });
    });
    await page.getByRole('link', { name: 'Logout' }).click();
});