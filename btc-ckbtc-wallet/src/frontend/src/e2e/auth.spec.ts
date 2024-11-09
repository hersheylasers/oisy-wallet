import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
	test('shows login button when not authenticated', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Login with Internet Identity')).toBeVisible();
	});

	test('shows wallet interface after authentication', async ({ page }) => {
		// Mock authentication
		await page.route('**/*', async (route) => {
			if (route.request().url().includes('isAuthenticated')) {
				await route.fulfill({ json: { authenticated: true } });
			} else {
				await route.continue();
			}
		});

		await page.goto('/');
		await expect(page.getByText('BTC-ckBTC Wallet')).toBeVisible();
		await expect(page.getByText('Network Preferences')).toBeVisible();
	});
});
