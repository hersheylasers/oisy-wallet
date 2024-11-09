import { writable } from 'svelte/store';
import { canisterIds, getActor } from '../api';
import { authStore } from './auth';

function createWalletStore() {
	const { subscribe, set, update } = writable({
		preferredNetwork: { Bitcoin: null },
		balances: { btc: 0n, ckbtc: 0n },
		conversionHistory: [],
		isLoading: false,
		error: null
	});

	let store;
	subscribe((value) => {
		store = value;
	});

	return {
		subscribe,
		init: async () => {
			try {
				await Promise.all([refreshBalances(), refreshHistory()]);
			} catch (error) {
				console.error('Wallet init error:', error);
				update((state) => ({ ...state, error: error.message }));
			}
		},
		refreshBalances: async () => {
			update((state) => ({ ...state, isLoading: true }));
			try {
				const actor = await getActor(canisterIds.walletBackend /* TODO: add wallet IDL */);
				const balances = await actor.get_balances();
				update((state) => ({
					...state,
					balances,
					isLoading: false
				}));
			} catch (error) {
				console.error('Failed to refresh balances:', error);
				update((state) => ({
					...state,
					error: error.message,
					isLoading: false
				}));
			}
		},
		refreshHistory: async () => {
			update((state) => ({ ...state, isLoading: true }));
			try {
				const actor = await getActor(canisterIds.walletBackend /* TODO: add wallet IDL */);
				const history = await actor.get_conversion_history();
				update((state) => ({
					...state,
					conversionHistory: history,
					isLoading: false
				}));
			} catch (error) {
				console.error('Failed to refresh history:', error);
				update((state) => ({
					...state,
					error: error.message,
					isLoading: false
				}));
			}
		},
		setPreferredNetwork: async (network) => {
			update((state) => ({ ...state, isLoading: true }));
			try {
				const actor = await getActor(canisterIds.walletBackend /* TODO: add wallet IDL */);
				await actor.set_preferred_network(network);
				update((state) => ({
					...state,
					preferredNetwork: network,
					isLoading: false
				}));
			} catch (error) {
				console.error('Failed to set preferred network:', error);
				update((state) => ({
					...state,
					error: error.message,
					isLoading: false
				}));
			}
		},
		clearError: () => update((state) => ({ ...state, error: null }))
	};
}

export const walletStore = createWalletStore();

// Subscribe to auth changes to initialize wallet when authenticated
authStore.subscribe(async (authState) => {
	if (authState.isAuthenticated) {
		await walletStore.init();
	}
});
