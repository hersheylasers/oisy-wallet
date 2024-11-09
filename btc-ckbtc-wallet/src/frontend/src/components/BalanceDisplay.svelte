<script context="module" lang="ts">
	export {};
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { walletStore } from '$lib/stores/wallet';

	let refreshInterval: number;

	$: ({ balances, isLoading, error } = $walletStore);

	onMount(() => {
		// Refresh balances every 30 seconds
		refreshInterval = setInterval(() => {
			walletStore.refreshBalances();
		}, 30000);

		return () => {
			clearInterval(refreshInterval);
		};
	});

	function formatBalance(balance: bigint): string {
		return (Number(balance) / 100_000_000).toFixed(8);
	}
</script>

<div class="rounded-lg bg-white p-6 shadow">
	<h2 class="mb-4 text-xl font-semibold">Balances</h2>

	{#if isLoading}
		<div class="py-4 text-center">
			<span class="text-gray-500">Loading balances...</span>
		</div>
	{:else if error}
		<div class="text-red-600 bg-red-50 rounded-lg p-4">
			{error}
			<button
				class="text-blue-600 hover:text-blue-800 ml-2"
				on:click={() => walletStore.clearError()}
			>
				Dismiss
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-4">
			<div class="bg-gray-50 rounded-lg p-4">
				<h3 class="text-gray-500 text-sm font-medium">Bitcoin</h3>
				<p class="mt-2 text-2xl font-semibold">{formatBalance(balances.btc)} BTC</p>
			</div>

			<div class="bg-gray-50 rounded-lg p-4">
				<h3 class="text-gray-500 text-sm font-medium">ckBTC</h3>
				<p class="mt-2 text-2xl font-semibold">{formatBalance(balances.ckbtc)} ckBTC</p>
			</div>
		</div>
	{/if}

	<button
		class="text-blue-600 hover:text-blue-800 mt-4 text-sm"
		on:click={() => walletStore.refreshBalances()}
		disabled={isLoading}
	>
		Refresh Balances
	</button>
</div>
