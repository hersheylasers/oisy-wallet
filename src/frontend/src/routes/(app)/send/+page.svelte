<script lang="ts">
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import IconArrowLeft from '$lib/components/icons/IconArrowLeft.svelte';

	// Get contact data from URL params
	let contact = $page.url.searchParams.get('contact')
		? JSON.parse(decodeURIComponent($page.url.searchParams.get('contact') || '{}'))
		: null;

	let amount = '0';
	const maxAmount = 100;
	const availableBalance = '$100';

	function handleKeypadClick(value: string) {
		if (value === 'backspace') {
			amount = amount.slice(0, -1);
			if (amount === '') amount = '0';
		} else {
			if (amount === '0' && value !== '.') {
				amount = value;
			} else {
				amount += value;
			}
		}
	}

	function handleMax() {
		amount = maxAmount.toString();
	}
</script>

<div class="flex min-h-screen flex-col bg-white">
	<!-- Header -->
	<header class="border-gray-200 flex items-center justify-between border-b p-4">
		<a href="/contacts" class="text-gray-600">
			<IconArrowLeft size={24} />
		</a>
		<h1 class="text-xl font-semibold">Send Request</h1>
		<div class="w-6"></div>
	</header>

	<!-- Contact Info -->
	<div class="border-gray-200 flex items-center gap-4 border-b p-4">
		<div class="bg-gray-300 h-16 w-16 rounded-full"></div>
		<div class="flex-1">
			<h2 class="font-medium">{contact?.name || 'Contact name'}</h2>
			<p class="text-gray-500 text-sm">{contact?.email || 'Email or phone'}</p>
			<select class="border-gray-300 mt-1 w-full rounded-md border bg-white py-1 text-sm">
				<option value={contact?.ethAddress || '0x123...456'}>
					{contact?.ethAddress || 'saved Ethereum address 0x123...456'}
				</option>
			</select>
		</div>
	</div>

	<!-- Amount Input -->
	<div class="p-4">
		<div class="mb-2 flex items-center justify-between">
			<div class="text-4xl font-bold">
				<span class="text-2xl">$</span>{amount}
			</div>
			<button
				on:click={handleMax}
				class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
			>
				Max
			</button>
		</div>

		<div class="mb-4">
			<div class="flex items-center gap-2">
				<span class="font-medium">Ethereum</span>
				<span class="text-gray-500 text-sm">Change asset</span>
			</div>
			<div class="text-gray-500 text-sm">
				Saved contact destination network: Base
				<br />
				{availableBalance} available
			</div>
		</div>

		<!-- Keypad -->
		<div class="grid grid-cols-3 gap-4">
			{#each ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'] as key}
				<button
					on:click={() => handleKeypadClick(key === '⌫' ? 'backspace' : key)}
					class="bg-gray-100 hover:bg-gray-200 flex h-14 items-center justify-center rounded-lg text-xl font-medium transition-colors"
				>
					{key}
				</button>
			{/each}
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="fixed bottom-0 left-0 right-0 z-50 bg-white p-4">
		<div class="mx-auto max-w-lg">
			<div class="flex gap-4">
				<button
					class="hover:bg-gray-800 flex-1 rounded-full bg-black py-4 text-center text-white transition-colors"
				>
					Request
				</button>
				<button
					class="bg-blue-600 hover:bg-blue-700 flex-1 rounded-full py-4 text-center text-white transition-colors"
				>
					Pay
				</button>
			</div>
		</div>
	</div>

	<!-- Spacer for fixed buttons -->
	<div class="h-24" />
</div>
