import { createTestAuthStore, createTestWalletStore } from '$lib/stores/test-stores';
import type { RenderResult } from '@testing-library/svelte';
import { render } from '@testing-library/svelte';
import { vi } from 'vitest';

// Create test stores
const testAuthStore = createTestAuthStore();
const testWalletStore = createTestWalletStore();

// Mock the store modules
vi.mock('$lib/stores/auth', () => ({
	authStore: testAuthStore
}));

vi.mock('$lib/stores/wallet', () => ({
	walletStore: testWalletStore
}));

export function renderWithStores(
	Component: any,
	props: any = {}
): RenderResult<any> & { cleanup: () => void } {
	const rendered = render(Component, props);

	return {
		...rendered,
		cleanup: () => {
			rendered.unmount();
			testAuthStore.set({
				isAuthenticated: false,
				principal: null,
				client: null,
				isLoading: false,
				error: null
			});
			testWalletStore.set({
				preferredNetwork: { Bitcoin: null },
				balances: { btc: 0n, ckbtc: 0n },
				conversionHistory: [],
				isLoading: false,
				error: null
			});
		}
	};
}
