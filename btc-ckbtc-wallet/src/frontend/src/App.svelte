<script>
	import AuthGuard from './components/AuthGuard.svelte';
	import NetworkPreference from './components/NetworkPreference.svelte';
	import BalanceDisplay from './components/BalanceDisplay.svelte';
	import ConversionHistory from './components/ConversionHistory.svelte';
	import WalletHeader from './components/WalletHeader.svelte';
</script>

<AuthGuard>
	<main class="container mx-auto p-4">
		<WalletHeader />
		<div class="mt-6 grid grid-cols-1 gap-6">
			<NetworkPreference />
			<BalanceDisplay />
			<ConversionHistory />
		</div>
	</main>
</AuthGuard>

<style>
	:global(body) {
		background-color: #f9fafb;
		color: #111827;
	}
</style>
