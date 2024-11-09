import { writable } from 'svelte/store';
import type { AuthState } from './auth';
import type { WalletState } from './wallet';

export function createTestAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		isAuthenticated: false,
		principal: null,
		client: null,
		isLoading: false,
		error: null
	});

	return {
		subscribe,
		set,
		update,
		init: vi.fn(),
		login: vi.fn(),
		logout: vi.fn(),
		clearError: vi.fn()
	};
}

export function createTestWalletStore() {
	const { subscribe, set, update } = writable<WalletState>({
		preferredNetwork: { Bitcoin: null },
		balances: { btc: 0n, ckbtc: 0n },
		conversionHistory: [],
		isLoading: false,
		error: null
	});

	return {
		subscribe,
		set,
		update,
		init: vi.fn(),
		setPreferredNetwork: vi.fn(),
		refreshBalances: vi.fn(),
		refreshHistory: vi.fn(),
		clearError: vi.fn()
	};
}
