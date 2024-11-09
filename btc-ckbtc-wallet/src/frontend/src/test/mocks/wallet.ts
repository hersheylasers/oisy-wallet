import type { Balances, ConversionRecord, PreferredNetwork } from '$lib/api';
import { vi } from 'vitest';

export const mockBalances: Balances = {
	btc: 100000000n, // 1 BTC
	ckbtc: 50000000n // 0.5 BTC
};

export const mockConversionHistory: ConversionRecord[] = [
	{
		timestamp: 1625097600000n,
		fromNetwork: { Bitcoin: null },
		toNetwork: { CkBTC: null },
		amount: 50000000n,
		status: { Complete: null }
	},
	{
		timestamp: 1625184000000n,
		fromNetwork: { CkBTC: null },
		toNetwork: { Bitcoin: null },
		amount: 25000000n,
		status: { Pending: null }
	}
];

export const mockWalletApi = {
	setNetworkPreference: vi.fn().mockResolvedValue(undefined),
	getNetworkPreference: vi.fn().mockResolvedValue({ Bitcoin: null } as PreferredNetwork),
	getBalances: vi.fn().mockResolvedValue(mockBalances),
	checkAndConvert: vi.fn().mockResolvedValue(undefined),
	getConversionHistory: vi.fn().mockResolvedValue(mockConversionHistory)
};
