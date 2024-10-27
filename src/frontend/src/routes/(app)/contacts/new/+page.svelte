<script lang="ts">
	import { fade } from 'svelte/transition';
	import IconArrowLeft from '$lib/components/icons/IconArrowLeft.svelte';
	import IconEdit from '$lib/components/icons/IconEdit.svelte';

	let name = '';
	let email = '';
	let phone = '';
	let ethAddress = '';
	let btcAddress = '';

	const networks = {
		ethereum: ['Base', 'Optimism', 'ZkSync', 'Arbitrum'],
		bitcoin: ['Bitcoin', 'Lightning']
	};

	function handleSave() {
		// TODO: Implement contact saving logic
		window.location.href = '/contacts';
	}
</script>

<div class="flex min-h-screen flex-col bg-white">
	<!-- Header -->
	<header class="border-gray-200 flex items-center justify-between border-b p-4">
		<a href="/contacts" class="text-gray-600">
			<IconArrowLeft />
		</a>
		<h1 class="text-xl font-semibold">New Contact</h1>
		<div class="w-6"></div>
	</header>

	<div class="flex-1 p-4" in:fade>
		<!-- Profile Picture -->
		<div class="mb-6 flex justify-center">
			<div class="relative">
				<div class="bg-gray-200 flex h-24 w-24 items-center justify-center rounded-full">
					<IconEdit class="text-gray-500 h-8 w-8" />
				</div>
				<div class="text-gray-500 mt-2 text-center text-sm">*Update after name is typed</div>
			</div>
		</div>

		<!-- Contact Form -->
		<form class="space-y-6" on:submit|preventDefault={handleSave}>
			<!-- Basic Info -->
			<div class="space-y-4">
				<div>
					<label for="name" class="text-gray-700 mb-1 block text-sm font-medium">Name</label>
					<input
						type="text"
						id="name"
						bind:value={name}
						class="border-gray-300 focus:border-blue-500 focus:ring-blue-500 block w-full rounded-lg border p-2.5"
						required
					/>
				</div>

				<div>
					<label for="email" class="text-gray-700 mb-1 block text-sm font-medium">Email</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						class="border-gray-300 focus:border-blue-500 focus:ring-blue-500 block w-full rounded-lg border p-2.5"
					/>
				</div>

				<div>
					<label for="phone" class="text-gray-700 mb-1 block text-sm font-medium">Phone</label>
					<input
						type="tel"
						id="phone"
						bind:value={phone}
						class="border-gray-300 focus:border-blue-500 focus:ring-blue-500 block w-full rounded-lg border p-2.5"
					/>
				</div>
			</div>

			<!-- Crypto Addresses -->
			<div class="space-y-4">
				<div>
					<label for="eth-address" class="text-gray-700 mb-1 block text-sm font-medium"
						>Ethereum Address</label
					>
					<div class="flex gap-2">
						<input
							type="text"
							id="eth-address"
							bind:value={ethAddress}
							placeholder="0xaddress, ENS, ZkSync etc."
							class="border-gray-300 focus:border-blue-500 focus:ring-blue-500 block w-full rounded-lg border p-2.5"
						/>
						<select
							class="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg border bg-white px-3"
						>
							<option value="ethereum">Ethereum</option>
							{#each networks.ethereum as network}
								<option value={network.toLowerCase()}>{network}</option>
							{/each}
						</select>
					</div>
				</div>

				<div>
					<label for="btc-address" class="text-gray-700 mb-1 block text-sm font-medium"
						>Bitcoin Address</label
					>
					<div class="flex gap-2">
						<input
							type="text"
							id="btc-address"
							bind:value={btcAddress}
							class="border-gray-300 focus:border-blue-500 focus:ring-blue-500 block w-full rounded-lg border p-2.5"
						/>
						<select
							class="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg border bg-white px-3"
						>
							{#each networks.bitcoin as network}
								<option value={network.toLowerCase()}>{network}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Add Address Button -->
				<button
					type="button"
					class="border-gray-300 hover:bg-gray-50 flex w-full items-center justify-center rounded-lg border p-2.5"
				>
					<span class="mr-2 text-2xl">+</span>
					Add Another Address
				</button>
			</div>

			<!-- Save Button -->
			<button
				type="submit"
				class="hover:bg-gray-800 mt-6 w-full rounded-full bg-black px-6 py-3 text-white transition-colors"
			>
				Save and Continue
			</button>
		</form>
	</div>
</div>
