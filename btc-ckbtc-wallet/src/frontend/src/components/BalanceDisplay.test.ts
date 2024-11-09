import { createTestWalletStore } from '$lib/stores/test-stores';
import { screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mockBalances } from '../test/mocks/wallet';
import { renderWithStores } from '../test/utils';
import BalanceDisplay from './BalanceDisplay.svelte';

const walletStore = createTestWalletStore();

describe('BalanceDisplay', () => {
	let cleanup: () => void;

	beforeEach(() => {
		({ cleanup } = renderWithStores(BalanceDisplay));
		walletStore.set({
			...walletStore,
			balances: mockBalances,
			isLoading: false,
			error: null
		});
	});

	afterEach(() => {
		cleanup();
	});

	it('displays BTC balance correctly', () => {
		expect(screen.getByText('1.00000000 BTC')).toBeInTheDocument();
	});

	it('displays ckBTC balance correctly', () => {
		expect(screen.getByText('0.50000000 ckBTC')).toBeInTheDocument();
	});

	it('shows loading state', async () => {
		walletStore.set({
			...walletStore,
			isLoading: true
		});
		expect(screen.getByText('Loading balances...')).toBeInTheDocument();
	});

	it('shows error state', async () => {
		walletStore.set({
			...walletStore,
			error: 'Failed to load balances'
		});
		expect(screen.getByText('Failed to load balances')).toBeInTheDocument();
	});
});
