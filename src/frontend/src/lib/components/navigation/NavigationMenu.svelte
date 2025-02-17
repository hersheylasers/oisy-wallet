<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import { page } from '$app/stores';
	import IconWallet from '$lib/components/icons/IconWallet.svelte';
	import IconlySettings from '$lib/components/icons/iconly/IconlySettings.svelte';
	import IconlyUfo from '$lib/components/icons/iconly/IconlyUfo.svelte';
	import InfoMenu from '$lib/components/navigation/InfoMenu.svelte';
	import NavigationItem from '$lib/components/navigation/NavigationItem.svelte';
	import { AppPath } from '$lib/constants/routes.constants';
	import { networkId } from '$lib/derived/network.derived';
	import { i18n } from '$lib/stores/i18n.store';
	import {
		isRouteDappExplorer,
		isRouteSettings,
		isRouteTokens,
		isRouteTransactions,
		networkParam
	} from '$lib/utils/nav.utils.js';

	// If we pass $page directly, we get a type error: for some reason (I cannot find any
	// documentation on it), the type of $page is not `Page`, but `unknown`. So we need to manually
	// cast it to `Page`.
	let pageData: Page;
	$: pageData = $page;
</script>

<div class="flex h-full w-full flex-col justify-between py-3 pl-4 md:pl-8">
	<div class="flex flex-col gap-3">
		<NavigationItem
			href="/"
			ariaLabel={$i18n.navigation.alt.tokens}
			selected={isRouteTokens(pageData) || isRouteTransactions(pageData)}
		>
			<IconWallet />
			{$i18n.navigation.text.tokens}
		</NavigationItem>

		<NavigationItem
			href={AppPath.Explore}
			ariaLabel={$i18n.navigation.alt.dapp_explorer}
			selected={isRouteDappExplorer(pageData)}
		>
			<IconlyUfo />
			{$i18n.navigation.text.dapp_explorer}
		</NavigationItem>

		<NavigationItem
			href={`${AppPath.Settings}?${networkParam($networkId)}`}
			ariaLabel={$i18n.navigation.alt.settings}
			selected={isRouteSettings(pageData)}
		>
			<IconlySettings />
			{$i18n.navigation.text.settings}
		</NavigationItem>
	</div>

	<div class="my-4 flex h-full flex-col justify-center">
		<slot />
	</div>

	<InfoMenu />
</div>
