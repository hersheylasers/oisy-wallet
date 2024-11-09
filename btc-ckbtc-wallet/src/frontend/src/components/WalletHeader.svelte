<script lang="ts">
	import { authStore } from '$lib/stores/auth';

	$: ({ principal } = $authStore);

	async function copyPrincipal() {
		if (!principal) return;

		try {
			await navigator.clipboard.writeText(principal.toString());
			// TODO: Show success toast
		} catch (error) {
			console.error('Failed to copy principal:', error);
		}
	}

	async function handleLogout() {
		await authStore.logout();
	}
</script>

<header class="rounded-lg bg-white p-6 shadow">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">BTC-ckBTC Wallet</h1>

		<div class="flex items-center space-x-4">
			{#if principal}
				<button
					on:click={copyPrincipal}
					class="text-gray-500 hover:text-gray-700 flex items-center space-x-1 text-sm"
				>
					<span class="font-mono"
						>{principal.toString().slice(0, 10)}...{principal.toString().slice(-8)}</span
					>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
						<path
							d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
						/>
					</svg>
				</button>

				<button on:click={handleLogout} class="text-red-600 hover:text-red-800 text-sm">
					Logout
				</button>
			{/if}
		</div>
	</div>
</header>
