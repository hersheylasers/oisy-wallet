<script lang="ts">
	import { onMount } from 'svelte';
	import { walletStore } from '$lib/stores/wallet';
	import type { PreferredNetwork } from '$lib/api';

	let isLoading = false;

	$: ({ preferredNetwork, error } = $walletStore);

	async function updatePreference(network: PreferredNetwork) {
		try {
			isLoading = true;
			await walletStore.setPreferredNetwork(network);
		} catch (err) {
			console.error('Failed to update preference:', err);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		walletStore.init();
	});
</script>

<div class="rounded-lg bg-white p-6 shadow">
	<h2 class="mb-4 text-xl font-semibold">Network Preferences</h2>

	<div class="space-y-4">
		<div>
			<label class="text-gray-700 block text-sm font-medium">Preferred Network</label>
			<select
				bind:value={preferredNetwork}
				class="border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 block w-full rounded-md shadow-sm"
				disabled={isLoading}
			>
				<option value="Bitcoin">Bitcoin Network</option>
				<option value="CkBTC">Internet Computer (ckBTC)</option>
			</select>
		</div>

		{#if error}
			<div class="text-red-600 mt-2 text-sm">
				{error}
				<button
					class="text-blue-600 hover:text-blue-800 ml-2"
					on:click={() => walletStore.clearError()}
				>
					Dismiss
				</button>
			</div>
		{/if}

		{#if isLoading}
			<div class="text-gray-500 text-sm">Updating preference...</div>
		{/if}
	</div>
</div>
