import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { get, writable } from 'svelte/store';

const II_URL = import.meta.env.VITE_II_URL || 'https://identity.ic0.app';

export interface AuthState {
	isAuthenticated: boolean;
	principal: Principal | null;
	client: AuthClient | null;
	isLoading: boolean;
	error: string | null;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		isAuthenticated: false,
		principal: null,
		client: null,
		isLoading: true,
		error: null
	});

	return {
		subscribe,

		async init() {
			try {
				const client = await AuthClient.create();
				const isAuthenticated = await client.isAuthenticated();
				const principal = isAuthenticated ? client.getIdentity().getPrincipal() : null;

				set({
					isAuthenticated,
					principal,
					client,
					isLoading: false,
					error: null
				});

				return isAuthenticated;
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to initialize authentication';
				update((state) => ({ ...state, isLoading: false, error }));
				return false;
			}
		},

		async login() {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const client = await AuthClient.create();

				await new Promise<void>((resolve, reject) => {
					client.login({
						identityProvider: II_URL,
						onSuccess: () => resolve(),
						onError: reject
					});
				});

				const principal = client.getIdentity().getPrincipal();

				set({
					isAuthenticated: true,
					principal,
					client,
					isLoading: false,
					error: null
				});
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to login';
				update((state) => ({
					...state,
					isAuthenticated: false,
					principal: null,
					isLoading: false,
					error
				}));
			}
		},

		async logout() {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const store = get(authStore);
				if (store.client) {
					await store.client.logout();
				}

				set({
					isAuthenticated: false,
					principal: null,
					client: null,
					isLoading: false,
					error: null
				});
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to logout';
				update((state) => ({ ...state, isLoading: false, error }));
			}
		},

		clearError() {
			update((state) => ({ ...state, error: null }));
		}
	};
}

export const authStore = createAuthStore();
