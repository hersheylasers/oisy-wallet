import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/wallet_backend/wallet_backend.did';
import type { _SERVICE } from '../../../declarations/wallet_backend/wallet_backend.did.d';

export type PreferredNetwork = 'Bitcoin' | 'CkBTC';

export interface Balances {
	btc: bigint;
	ckbtc: bigint;
}

export interface ConversionRecord {
	timestamp: bigint;
	fromNetwork: PreferredNetwork;
	toNetwork: PreferredNetwork;
	amount: bigint;
	status: { Pending: null } | { Complete: null } | { Failed: string };
}

class WalletApi {
	private actor: Actor;

	constructor(canisterId: string, agent: HttpAgent) {
		this.actor = Actor.createActor<_SERVICE>(idlFactory, {
			agent,
			canisterId
		});
	}

	async setNetworkPreference(network: PreferredNetwork): Promise<void> {
		const result = await this.actor.set_network_preference({ [network]: null });
		if ('Err' in result) {
			throw new Error(result.Err);
		}
	}

	async getNetworkPreference(): Promise<PreferredNetwork> {
		const result = await this.actor.get_network_preference();
		return Object.keys(result)[0] as PreferredNetwork;
	}

	async getBalances(): Promise<Balances> {
		const result = await this.actor.get_balances();
		if ('Err' in result) {
			throw new Error(result.Err);
		}
		return result.Ok;
	}

	async checkAndConvert(): Promise<void> {
		const result = await this.actor.check_and_convert();
		if ('Err' in result) {
			throw new Error(result.Err);
		}
	}

	async getConversionHistory(): Promise<ConversionRecord[]> {
		return await this.actor.get_conversion_history();
	}
}

let api: WalletApi | null = null;

export function initApi(canisterId: string, agent: HttpAgent): void {
	api = new WalletApi(canisterId, agent);
}

export function getApi(): WalletApi {
	if (!api) {
		throw new Error('API not initialized');
	}
	return api;
}
