<script lang="ts">
	import { fade } from 'svelte/transition';
	import IconArrowLeft from '$lib/components/icons/IconArrowLeft.svelte';
	import IconSearch from '$lib/components/icons/IconSearch.svelte';
	import IconQrCode from '$lib/components/icons/IconQrCode.svelte';
	import IconUserPlus from '$lib/components/icons/IconUserPlus.svelte';

	// Mock data for contacts
	const contacts = {
		favorites: [
			{ name: 'Alice Smith', email: 'alice@example.com', ethAddress: '0x123...' },
			{ name: 'Bob Johnson', email: 'bob@example.com', ethAddress: '0x456...' }
		],
		recents: [
			{ name: 'Carol White', email: 'carol@example.com', ethAddress: '0x789...' },
			{ name: 'David Brown', email: 'david@example.com', ethAddress: '0xabc...' }
		],
		friends: [
			{ name: 'Eve Green', email: 'eve@example.com', ethAddress: '0xdef...' },
			{ name: 'Frank Black', email: 'frank@example.com', ethAddress: '0xghi...' },
			{ name: 'Grace Lee', email: 'grace@example.com', ethAddress: '0xjkl...' }
		]
	};

	function handleContactClick(contact: any) {
		window.location.href = `/send?contact=${encodeURIComponent(JSON.stringify(contact))}`;
	}
</script>

<div class="flex min-h-screen flex-col bg-white">
	<!-- Header -->
	<header class="border-gray-200 flex items-center justify-between border-b p-4">
		<a href="/" class="text-gray-600">
			<IconArrowLeft size={24} />
		</a>
		<h1 class="text-xl font-semibold">Send to Contact</h1>
		<div class="w-6"></div>
	</header>

	<!-- Search and QR Code -->
	<div class="border-gray-200 flex items-center gap-4 border-b p-4">
		<div class="flex-1">
			<div class="bg-gray-100 flex items-center rounded-lg px-3 py-2">
				<IconSearch size={20} />
				<input
					type="text"
					placeholder="Search contacts"
					class="w-full bg-transparent focus:outline-none"
				/>
			</div>
		</div>
		<button class="text-gray-600 flex items-center justify-center">
			<IconQrCode size={24} />
		</button>
	</div>

	<!-- Contact List -->
	<div class="flex-1 p-4" in:fade>
		<!-- Favorites -->
		{#if contacts.favorites.length > 0}
			<div class="mb-6">
				<h2 class="mb-3 text-lg font-semibold">Favorites</h2>
				<div class="space-y-3">
					{#each contacts.favorites as contact}
						<button
							class="bg-gray-50 hover:bg-gray-100 flex w-full items-center rounded-lg p-3 transition-colors"
							on:click={() => handleContactClick(contact)}
						>
							<div class="bg-gray-300 mr-3 h-10 w-10 rounded-full"></div>
							<div class="text-left">
								<div class="font-medium">{contact.name}</div>
								<div class="text-gray-500 text-sm">{contact.email}</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Recents -->
		{#if contacts.recents.length > 0}
			<div class="mb-6">
				<h2 class="mb-3 text-lg font-semibold">Recents</h2>
				<div class="space-y-3">
					{#each contacts.recents as contact}
						<button
							class="bg-gray-50 hover:bg-gray-100 flex w-full items-center rounded-lg p-3 transition-colors"
							on:click={() => handleContactClick(contact)}
						>
							<div class="bg-gray-300 mr-3 h-10 w-10 rounded-full"></div>
							<div class="text-left">
								<div class="font-medium">{contact.name}</div>
								<div class="text-gray-500 text-sm">{contact.email}</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Friends -->
		{#if contacts.friends.length > 0}
			<div class="mb-6">
				<h2 class="mb-3 text-lg font-semibold">Friends</h2>
				<div class="space-y-3">
					{#each contacts.friends as contact}
						<button
							class="bg-gray-50 hover:bg-gray-100 flex w-full items-center rounded-lg p-3 transition-colors"
							on:click={() => handleContactClick(contact)}
						>
							<div class="bg-gray-300 mr-3 h-10 w-10 rounded-full"></div>
							<div class="text-left">
								<div class="font-medium">{contact.name}</div>
								<div class="text-gray-500 text-sm">{contact.email}</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<!-- Bottom Actions -->
	<div class="border-gray-200 flex flex-col gap-4 border-t p-4">
		<!-- New Contact Button -->
		<a
			href="/contacts/new"
			class="bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2 rounded-lg p-3 transition-colors"
		>
			<IconUserPlus size={20} />
			<span>New Contact</span>
		</a>

		<!-- Send/Request Buttons -->
		<div class="grid grid-cols-2 gap-4">
			<button
				class="bg-gray-900 hover:bg-gray-800 rounded-full px-6 py-3 text-white transition-colors"
			>
				Request
			</button>
			<button
				class="bg-blue-600 hover:bg-blue-700 rounded-full px-6 py-3 text-white transition-colors"
			>
				Send
			</button>
		</div>
	</div>
</div>
