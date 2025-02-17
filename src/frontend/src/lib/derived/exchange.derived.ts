import { EXCHANGE_DISABLED } from '$env/exchange.env';
import {
	BTC_MAINNET_TOKEN_ID,
	BTC_REGTEST_TOKEN_ID,
	BTC_TESTNET_TOKEN_ID
} from '$env/tokens.btc.env';
import { ETHEREUM_TOKEN_ID, ICP_TOKEN_ID, SEPOLIA_TOKEN_ID } from '$env/tokens.env';
import { enabledErc20Tokens } from '$eth/derived/erc20.derived';
import type { Erc20Token } from '$eth/types/erc20';
import { enabledIcrcTokens } from '$icp/derived/icrc.derived';
import type { IcCkToken } from '$icp/types/ic-token';
import { exchangeStore } from '$lib/stores/exchange.store';
import type { ExchangesData } from '$lib/types/exchange';
import { nonNullish } from '@dfinity/utils';
import { derived, type Readable } from 'svelte/store';

export const exchangeInitialized: Readable<boolean> = derived(
	[exchangeStore],
	([$exchangeStore]) => EXCHANGE_DISABLED || nonNullish($exchangeStore)
);

// TODO: create tests for store
export const exchanges: Readable<ExchangesData> = derived(
	[exchangeStore, enabledErc20Tokens, enabledIcrcTokens],
	([$exchangeStore, $erc20Tokens, $icrcTokens]) => {
		const ethPrice = $exchangeStore?.ethereum;
		const btcPrice = $exchangeStore?.bitcoin;
		const icpPrice = $exchangeStore?.['internet-computer'];

		return {
			// TODO: improve feed price on BTC testnet, for now we assume that 1 BTC mainnet = 1 BTC testnet
			[BTC_TESTNET_TOKEN_ID]: btcPrice,
			[BTC_MAINNET_TOKEN_ID]: btcPrice,
			[BTC_REGTEST_TOKEN_ID]: btcPrice,
			[ETHEREUM_TOKEN_ID]: ethPrice,
			[SEPOLIA_TOKEN_ID]: ethPrice,
			[ICP_TOKEN_ID]: icpPrice,
			...Object.entries($exchangeStore ?? {}).reduce((acc, [key, currentPrice]) => {
				const token = $erc20Tokens.find(
					({ address }) => address.toLowerCase() === key.toLowerCase()
				);

				return {
					...acc,
					...(nonNullish(token) && { [token.id]: currentPrice })
				};
			}, {}),
			...$erc20Tokens
				.filter(({ exchange }) => exchange === 'icp')
				.reduce(
					(acc, { id }) => ({
						...acc,
						[id]: icpPrice
					}),
					{}
				),
			...$icrcTokens.reduce((acc, token) => {
				const { id, ledgerCanisterId, exchangeCoinId } = token;

				const icrcPrice = $exchangeStore?.[ledgerCanisterId];

				if (nonNullish(icrcPrice)) {
					return {
						...acc,
						[id]: icrcPrice
					};
				}

				const { twinToken } = token as Partial<IcCkToken>;
				const { address } = (twinToken as Partial<Erc20Token>) ?? { address: undefined };
				const ckEthereumPrice = nonNullish(address)
					? $exchangeStore?.[address.toLowerCase()]
					: ethPrice;

				return {
					...acc,
					[id]:
						exchangeCoinId === 'ethereum'
							? ckEthereumPrice
							: exchangeCoinId === 'bitcoin'
								? btcPrice
								: exchangeCoinId === 'internet-computer'
									? icpPrice
									: undefined
				};
			}, {})
		};
	}
);
