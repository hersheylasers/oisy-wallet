import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import type {
	ConversionRecord as BackendConversionRecord,
	_SERVICE
} from '../../../declarations/wallet_backend/index';
import { idlFactory } from '../../../declarations/wallet_backend/wallet_backend.did';

export type PreferredNetwork = { Bitcoin: null } | { CkBTC: null };

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

function convertRecord(record: BackendConversionRecord): ConversionRecord {
	return {
		timestamp: record.timestamp,
		fromNetwork: record.from_network,
		toNetwork: record.to_network,
		amount: record.amount,
		status: record.status
	};
}

class WalletApi {
	private actor: ActorSubclass<_SERVICE>;

	constructor(canisterId: string, agent: HttpAgent) {
		this.actor = Actor.createActor<_SERVICE>(idlFactory, {
			agent,
			canisterId
		});
	}

	async setNetworkPreference(network: PreferredNetwork): Promise<void> {
		const result = await this.actor.set_network_preference(network);
		if ('Err' in result) {
			throw new Error(result.Err);
		}
	}

	async getNetworkPreference(): Promise<PreferredNetwork> {
		return await this.actor.get_network_preference();
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
		const records = await this.actor.get_conversion_history();
		return records.map(convertRecord);
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
