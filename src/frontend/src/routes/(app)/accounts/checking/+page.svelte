<script lang="ts">
	import { fade } from 'svelte/transition';
	import IconMoreVertical from '$lib/components/icons/IconMoreVertical.svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	let expandedCrypto: string | null = null;

	const toggleExpand = (crypto: string) => {
		expandedCrypto = expandedCrypto === crypto ? null : crypto;
	};

	const cryptoAssets = [
		{
			symbol: 'BTC',
			name: 'Bitcoin',
			balance: '$100',
			icon: '₿',
			actions: [
				{ name: 'View Transactions', href: '#' },
				{ name: 'Buy', href: '#' },
				{ name: 'Send/Request', href: '#' },
				{ name: 'Transfer', href: '/transfer' }
			]
		},
		{
			symbol: 'ETH',
			name: 'Ethereum',
			balance: '$400',
			icon: '◈',
			actions: [
				{ name: 'View Transactions', href: '#' },
				{ name: 'Buy', href: '#' },
				{ name: 'Send/Request', href: '#' },
				{ name: 'Transfer', href: '/transfer' }
			]
		}
	];
</script>

<div class="flex min-h-screen flex-col bg-[#F8F9FF]">
	<!-- Header Card -->
	<div class="rounded-b-[2rem] bg-gradient-to-b from-[#0066FF] to-[#0052CC] p-6 text-white">
		<div class="mb-6 flex items-start justify-between">
			<h1 class="text-2xl font-bold">Checkings</h1>
			<a href="/accounts/checking/settings" class="p-1">
				<IconMoreVertical size="24" />
			</a>
		</div>
		<div class="mb-2">Available Balance:</div>
		<div class="mb-4 text-3xl font-bold">$500</div>
	</div>

	<!-- Crypto Assets -->
	<div class="mt-4 flex-1 space-y-4 p-4">
		{#each cryptoAssets as asset}
			<div class="overflow-hidden rounded-xl bg-white shadow-sm">
				<!-- Asset Header -->
				<div
					class="flex cursor-pointer items-center justify-between p-4"
					on:click={() => toggleExpand(asset.symbol)}
				>
					<div class="flex items-center space-x-3">
						<span class="text-xl font-medium">{asset.symbol}</span>
						<span class="text-2xl">{asset.icon}</span>
						<span class="text-xl">{asset.balance}</span>
					</div>
					<div class="flex items-center space-x-2">
						<button class="p-1">
							<IconMoreVertical size="20" />
						</button>
						<div class="flex h-6 w-6 items-center justify-center">
							{#if expandedCrypto === asset.symbol}
								<ChevronUp size={20} />
							{:else}
								<ChevronDown size={20} />
							{/if}
						</div>
					</div>
				</div>

				<!-- Expanded Actions -->
				{#if expandedCrypto === asset.symbol}
					<div class="bg-gray-50 grid grid-cols-4 gap-2 p-4 text-center" transition:fade>
						{#each asset.actions as action}
							<a
								href={action.href}
								class="hover:bg-gray-100 rounded px-1 py-2 text-sm transition-colors"
							>
								{action.name}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
