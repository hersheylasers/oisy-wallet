import { writable } from 'svelte/store';
import { canisterIds, getActor } from '../api';
import { idlFactory } from '../wallet.did';
import { authStore } from './auth';

function createWalletStore() {
	const { subscribe, set, update } = writable({
		preferredNetwork: { Bitcoin: null },
		balances: { btc: BigInt(0), ckbtc: BigInt(0) },
		conversionHistory: [],
		isLoading: false,
		error: null
	});

	let store;
	subscribe((value) => {
		store = value;
	});

	async function getWalletActor() {
		return await getActor(canisterIds.walletBackend, idlFactory);
	}

	const walletStore = {
		subscribe,
		refreshBalances: async () => {
			if (!store) return;
			update((state) => ({ ...state, isLoading: true }));
			try {
				const actor = await getWalletActor();
				const balances = await actor.get_balances();
				update((state) => ({
					...state,
					balances: {
						btc: BigInt(balances.btc.toString()),
						ckbtc: BigInt(balances.ckbtc.toString())
					},
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
			if (!store) return;
			update((state) => ({ ...state, isLoading: true }));
			try {
				const actor = await getWalletActor();
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
			if (!store) return;
			update((state) => ({ ...state, isLoading: true }));
			try {
				const actor = await getWalletActor();
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

	return walletStore;
}

export const walletStore = createWalletStore();

// Initialize wallet when authenticated
authStore.subscribe(async (authState) => {
	if (authState.isAuthenticated) {
		await walletStore.refreshBalances();
		await walletStore.refreshHistory();
	}
});
