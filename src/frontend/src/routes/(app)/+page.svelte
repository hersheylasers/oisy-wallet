<script lang="ts">
	import { fade } from 'svelte/transition';
	import Card from '$lib/components/ui/Card.svelte';
	import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte';
	import NavigationMenu from '$lib/components/navigation/NavigationMenu.svelte';
	import NavigationItem from '$lib/components/navigation/NavigationItem.svelte';
	import IconManage from '$lib/components/icons/lucide/IconManage.svelte';
	import IconWallet from '$lib/components/icons/lucide/IconWallet.svelte';
	import IconSend from '$lib/components/icons/IconSend.svelte';
	import IconPlus from '$lib/components/icons/lucide/IconPlus.svelte';
	import IconIdCard from '$lib/components/icons/IconIdCard.svelte';
	import IconOpenChat from '$lib/components/icons/IconOpenChat.svelte';

	const accounts = [
		{
			type: 'Checking',
			balance: '$1,234.56',
			description: 'Main Account'
		},
		{
			type: 'Savings',
			balance: '$5,678.90',
			description: 'Emergency Fund'
		},
		{
			type: 'Investment',
			balance: '$10,234.56',
			description: 'Long Term Growth'
		},
		{
			type: 'Social',
			balance: '$789.12',
			description: 'Social Payments'
		}
	];

	const getCardColor = (type: string) => {
		// Using variations of the app's blue theme
		switch (type) {
			case 'Checking':
				return 'bg-gradient-to-br from-[#0066FF] to-[#0052CC]';
			case 'Savings':
				return 'bg-gradient-to-br from-[#0066FF] to-[#0047B3]';
			case 'Investment':
				return 'bg-gradient-to-br from-[#0066FF] to-[#003D99]';
			case 'Social':
				return 'bg-gradient-to-br from-[#0066FF] to-[#003380]';
			default:
				return 'bg-gradient-to-br from-[#0066FF] to-[#0052CC]';
		}
	};
</script>

<div class="bg-gray-100 flex min-h-screen flex-col">
	<!-- Header with Settings -->
	<header class="flex items-center justify-between p-4">
		<h1 class="text-2xl font-bold">Accounts</h1>
		<ButtonIcon ariaLabel="Settings" on:click={() => (window.location.href = '/settings')}>
			<IconManage />
		</ButtonIcon>
	</header>

	<!-- Account Cards -->
	<main class="flex-1 space-y-4 p-4 pb-24" in:fade>
		{#each accounts as account}
			<div class="transform cursor-pointer transition-all hover:scale-[1.02]">
				<div class={`rounded-xl p-6 text-white shadow-lg ${getCardColor(account.type)}`}>
					<div class="mb-8 flex items-start justify-between">
						<div>
							<h2 class="text-lg font-semibold">{account.type}</h2>
							<p class="text-sm opacity-80">{account.description}</p>
						</div>
					</div>
					<div class="text-2xl font-bold">{account.balance}</div>
				</div>
			</div>
		{/each}

		<!-- Add Account Card -->
		<div class="transform cursor-pointer transition-all hover:scale-[1.02]">
			<div
				class="border-gray-300 text-gray-500 flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white p-6"
			>
				<IconPlus />
				<span class="mt-2 font-medium">Add Account</span>
			</div>
		</div>
	</main>

	<!-- Bottom Navigation -->
	<nav class="border-gray-200 fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
		<div class="mx-auto max-w-screen-xl px-4">
			<div class="grid h-16 grid-cols-4">
				<div class="flex flex-col items-center justify-center">
					<NavigationItem href="/" selected={true} ariaLabel="Home">
						<div class="mb-1 h-6 w-6">
							<IconWallet />
						</div>
						<span class="text-xs">Home</span>
					</NavigationItem>
				</div>
				<div class="flex flex-col items-center justify-center">
					<NavigationItem href="/send" ariaLabel="Send/Receive">
						<div class="mb-1 h-6 w-6">
							<IconSend />
						</div>
						<span class="whitespace-nowrap text-xs">Send/Receive</span>
					</NavigationItem>
				</div>
				<div class="flex flex-col items-center justify-center">
					<NavigationItem href="/social" ariaLabel="Social">
						<div class="mb-1 h-6 w-6">
							<IconOpenChat />
						</div>
						<span class="text-xs">Social</span>
					</NavigationItem>
				</div>
				<div class="flex flex-col items-center justify-center">
					<NavigationItem href="/profile" ariaLabel="Profile">
						<div class="mb-1 h-6 w-6">
							<IconIdCard />
						</div>
						<span class="text-xs">Profile</span>
					</NavigationItem>
				</div>
			</div>
		</div>
	</nav>
</div>
