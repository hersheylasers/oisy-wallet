<script lang="ts">
	import { fade } from 'svelte/transition';
	import IconBackArrow from '$lib/components/icons/IconBackArrow.svelte';
	import { ChevronDown } from 'lucide-svelte';

	let amount = '0';
	let selectedFromAccount = 'Checkings (nickname)';
	let selectedToAccount = 'Savings (nickname)';
	let showKeypad = false;
	let showFromDropdown = false;
	let showToDropdown = false;

	const accounts = [
		{ name: 'Checkings (nickname)', type: 'checking', balance: '$500' },
		{ name: 'Savings (nickname)', type: 'savings', balance: '$1,000' },
		{ name: 'Investment (nickname)', type: 'investment', balance: '$2,000' }
	];

	const keypadNumbers = [
		['1', '2', '3'],
		['4', '5', '6'],
		['7', '8', '9'],
		['.', '0', '⌫']
	];

	function handleKeypadInput(key: string) {
		if (key === '⌫') {
			amount = amount.slice(0, -1);
			if (amount === '') amount = '0';
		} else if (key === '.' && !amount.includes('.')) {
			amount += key;
		} else if (key !== '.') {
			amount = amount === '0' ? key : amount + key;
		}
	}

	function selectFromAccount(account: string) {
		selectedFromAccount = account;
		showFromDropdown = false;
	}

	function selectToAccount(account: string) {
		selectedToAccount = account;
		showToDropdown = false;
	}

	// Close dropdowns when clicking outside
	function handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.dropdown-container')) {
			showFromDropdown = false;
			showToDropdown = false;
		}
	}
</script>

<svelte:window on:click={handleClick} />

<div class="flex min-h-screen flex-col bg-white">
	<!-- Header -->
	<header class="flex items-center p-4">
		<a href="/accounts/checking" class="p-2">
			<IconBackArrow size="24" />
		</a>
		<h1 class="ml-4 text-2xl font-bold">Transfer Between Accounts</h1>
	</header>

	<div class="flex-1 p-6">
		<!-- Account Selection -->
		<div class="mb-8 space-y-4">
			<!-- From Account -->
			<div class="dropdown-container relative">
				<label class="mb-2 block text-sm font-medium">From</label>
				<button
					class="bg-gray-50 flex w-full items-center justify-between rounded-lg border p-3"
					on:click|stopPropagation={() => (showFromDropdown = !showFromDropdown)}
				>
					<span>{selectedFromAccount}</span>
					<ChevronDown size={20} class={showFromDropdown ? 'rotate-180 transform' : ''} />
				</button>
				{#if showFromDropdown}
					<div
						class="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-white shadow-lg"
						transition:fade={{ duration: 100 }}
					>
						{#each accounts as account}
							<button
								class="hover:bg-gray-50 flex w-full items-center justify-between p-3 text-left"
								on:click|stopPropagation={() => selectFromAccount(account.name)}
							>
								<span>{account.name}</span>
								<span class="text-gray-500 text-sm">{account.balance}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- To Account -->
			<div class="dropdown-container relative">
				<label class="mb-2 block text-sm font-medium">To</label>
				<button
					class="bg-gray-50 flex w-full items-center justify-between rounded-lg border p-3"
					on:click|stopPropagation={() => (showToDropdown = !showToDropdown)}
				>
					<span>{selectedToAccount}</span>
					<ChevronDown size={20} class={showToDropdown ? 'rotate-180 transform' : ''} />
				</button>
				{#if showToDropdown}
					<div
						class="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-white shadow-lg"
						transition:fade={{ duration: 100 }}
					>
						{#each accounts as account}
							<button
								class="hover:bg-gray-50 flex w-full items-center justify-between p-3 text-left"
								on:click|stopPropagation={() => selectToAccount(account.name)}
							>
								<span>{account.name}</span>
								<span class="text-gray-500 text-sm">{account.balance}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Amount Input -->
		<div class="mb-8">
			<div class="mb-2 text-4xl font-bold" on:click={() => (showKeypad = true)}>
				${amount}
			</div>
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<span class="font-medium">Ethereum</span>
					<button class="text-blue-600 text-sm">Change asset</button>
				</div>
				<div class="text-sm">$100 available</div>
			</div>
			<button class="text-blue-600 mt-2 text-sm">Change network? Edit contact here</button>
		</div>

		<!-- Keypad -->
		{#if showKeypad}
			<div class="bg-gray-100 fixed inset-x-0 bottom-0 p-4 pb-8" transition:fade>
				<div class="mx-auto max-w-sm">
					<div class="grid grid-cols-3 gap-3">
						{#each keypadNumbers as row}
							{#each row as key}
								<button
									class="hover:bg-gray-50 active:bg-gray-100 flex h-16 items-center justify-center rounded-2xl bg-white text-xl font-medium shadow-sm transition-colors"
									on:click={() => handleKeypadInput(key)}
								>
									{key}
								</button>
							{/each}
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Slide to Confirm -->
	<div class="border-t bg-white p-4">
		<button class="w-full rounded-full bg-black p-4 font-medium text-white">
			Slide to confirm
		</button>
	</div>
</div>

<style>
	/* Ensure buttons maintain square aspect ratio */
	button.h-16 {
		aspect-ratio: 1;
	}
</style>
