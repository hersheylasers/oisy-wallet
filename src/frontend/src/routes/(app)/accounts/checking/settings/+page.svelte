<script lang="ts">
	import { fade } from 'svelte/transition';
	import IconBackArrow from '$lib/components/icons/IconBackArrow.svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	let nickname = '';
	let showNetworkSettings = false;
	let showStablecoinSettings = false;
	let selectedBTCNetwork = 'Native Network';
	let selectedETHNetwork = 'Layer 1 (Ethereum Mainnet)';
	let selectedStablecoin = 'USDC';

	const btcNetworks = ['Native Network', 'Internet Computer Protocol (ICP)'];

	const ethNetworks = ['Layer 1 (Ethereum Mainnet)', 'Base', 'Optimism', 'Arbitrum'];

	const stablecoins = [
		{
			symbol: 'USDC',
			name: 'USD Coin',
			description: 'Regulated, fully backed stablecoin by Circle',
			icon: '₮'
		},
		{
			symbol: 'DAI',
			name: 'Dai',
			description: 'Decentralized, crypto-collateralized stablecoin',
			icon: '◈'
		},
		{
			symbol: 'USDT',
			name: 'Tether',
			description: 'Widely used, centralized stablecoin',
			icon: '₮'
		},
		{
			symbol: 'BUSD',
			name: 'Binance USD',
			description: 'Regulated stablecoin by Binance and Paxos',
			icon: '₮'
		}
	];

	function updateNickname() {
		// Here you would typically update the nickname in your store/backend
		console.log('Updating nickname to:', nickname);
	}

	function selectStablecoin(symbol: string) {
		selectedStablecoin = symbol;
		showStablecoinSettings = false;
	}
</script>

<div class="flex min-h-screen flex-col bg-white">
	<!-- Header -->
	<header class="flex items-center border-b p-4">
		<a href="/accounts/checking" class="p-2">
			<IconBackArrow size="24" />
		</a>
		<h1 class="ml-4 text-2xl font-bold">Account Settings</h1>
	</header>

	<div class="flex-1 p-4">
		<!-- Preferred Network -->
		<div class="mb-6">
			<button
				class="flex w-full items-center justify-between rounded-lg bg-white p-4 shadow-sm"
				on:click={() => (showNetworkSettings = !showNetworkSettings)}
			>
				<span class="font-medium">Preferred Network</span>
				{#if showNetworkSettings}
					<ChevronUp size={20} />
				{:else}
					<ChevronDown size={20} />
				{/if}
			</button>

			{#if showNetworkSettings}
				<div class="bg-gray-50 mt-4 space-y-4 rounded-lg p-4" transition:fade>
					<!-- BTC Network Selection -->
					<div>
						<label class="mb-2 block text-sm font-medium">Bitcoin Network</label>
						<select bind:value={selectedBTCNetwork} class="w-full rounded-lg border bg-white p-3">
							{#each btcNetworks as network}
								<option value={network}>{network}</option>
							{/each}
						</select>
					</div>

					<!-- ETH Network Selection -->
					<div>
						<label class="mb-2 block text-sm font-medium">Ethereum Network</label>
						<select bind:value={selectedETHNetwork} class="w-full rounded-lg border bg-white p-3">
							{#each ethNetworks as network}
								<option value={network}>{network}</option>
							{/each}
						</select>
					</div>
				</div>
			{/if}
		</div>

		<!-- Account Color -->
		<button class="mb-4 w-full rounded-lg bg-white p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="font-medium">Color</span>
				<div class="bg-blue-600 h-6 w-6 rounded-full"></div>
			</div>
		</button>

		<!-- Account Nickname -->
		<div class="mb-4 w-full rounded-lg bg-white p-4 shadow-sm">
			<label class="mb-2 block font-medium">Nickname</label>
			<div class="flex space-x-2">
				<input
					type="text"
					bind:value={nickname}
					placeholder="Enter account nickname"
					class="flex-1 rounded-lg border p-2"
				/>
				<button
					on:click={updateNickname}
					class="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-white"
				>
					Save
				</button>
			</div>
		</div>

		<!-- Account Type -->
		<button class="mb-4 w-full rounded-lg bg-white p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="font-medium">Account Type</span>
				<span class="text-gray-500">Checking</span>
			</div>
		</button>

		<!-- Preferred Stablecoin -->
		<div class="mb-6">
			<button
				class="flex w-full items-center justify-between rounded-lg bg-white p-4 shadow-sm"
				on:click={() => (showStablecoinSettings = !showStablecoinSettings)}
			>
				<span class="font-medium">Preferred Stablecoin</span>
				<div class="flex items-center space-x-2">
					<span class="text-gray-500">{selectedStablecoin}</span>
					{#if showStablecoinSettings}
						<ChevronUp size={20} />
					{:else}
						<ChevronDown size={20} />
					{/if}
				</div>
			</button>

			{#if showStablecoinSettings}
				<div class="mt-4 space-y-2" transition:fade>
					{#each stablecoins as coin}
						<button
							class="hover:bg-gray-50 w-full rounded-lg bg-white p-4 shadow-sm transition-colors"
							class:bg-blue-50={selectedStablecoin === coin.symbol}
							on:click={() => selectStablecoin(coin.symbol)}
						>
							<div class="flex items-center justify-between">
								<div>
									<div class="flex items-center space-x-2">
										<span class="text-xl">{coin.icon}</span>
										<span class="font-medium">{coin.symbol}</span>
										<span class="text-gray-500">({coin.name})</span>
									</div>
									<p class="text-gray-500 mt-1 text-sm">{coin.description}</p>
								</div>
								{#if selectedStablecoin === coin.symbol}
									<div class="bg-blue-600 h-2 w-2 rounded-full"></div>
								{/if}
							</div>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
