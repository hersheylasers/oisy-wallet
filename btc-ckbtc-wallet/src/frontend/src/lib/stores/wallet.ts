import { writable } from 'svelte/store';
import type { Balances, ConversionRecord, PreferredNetwork } from '../api';
import { getApi } from '../api';

export interface WalletState {
	preferredNetwork: PreferredNetwork;
	balances: Balances;
	conversionHistory: ConversionRecord[];
	isLoading: boolean;
	error: string | null;
}

function createWalletStore() {
	const { subscribe, set, update } = writable<WalletState>({
		preferredNetwork: { Bitcoin: null },
		balances: { btc: 0n, ckbtc: 0n },
		conversionHistory: [],
		isLoading: false,
		error: null
	});

	return {
		subscribe,

		async init() {
			update((state) => ({ ...state, isLoading: true }));
			try {
				const [network, balances, history] = await Promise.all([
					getApi().getNetworkPreference(),
					getApi().getBalances(),
					getApi().getConversionHistory()
				]);

				set({
					preferredNetwork: network,
					balances,
					conversionHistory: history,
					isLoading: false,
					error: null
				});
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Unknown error occurred';
				update((state) => ({
					...state,
					isLoading: false,
					error
				}));
			}
		},

		async setPreferredNetwork(network: PreferredNetwork) {
			update((state) => ({ ...state, isLoading: true }));
			try {
				await getApi().setNetworkPreference(network);
				update((state) => ({
					...state,
					preferredNetwork: network,
					isLoading: false
				}));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Unknown error occurred';
				update((state) => ({
					...state,
					isLoading: false,
					error
				}));
			}
		},

		async refreshBalances() {
			try {
				const balances = await getApi().getBalances();
				update((state) => ({ ...state, balances }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Unknown error occurred';
				update((state) => ({ ...state, error }));
			}
		},

		async refreshHistory() {
			try {
				const history = await getApi().getConversionHistory();
				update((state) => ({ ...state, conversionHistory: history }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Unknown error occurred';
				update((state) => ({ ...state, error }));
			}
		},

		clearError() {
			update((state) => ({ ...state, error: null }));
		}
	};
}

export const walletStore = createWalletStore();
