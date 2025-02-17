import { getTransactions as getTransactionsApi } from '$icp/api/icrc-index-ng.api';
import { IcWalletScheduler } from '$icp/schedulers/ic-wallet.scheduler';
import type { IcTransactionUi } from '$icp/types/ic-transaction';
import { mapCkBTCTransaction } from '$icp/utils/ckbtc-transactions.utils';
import { mapCkEthereumTransaction } from '$icp/utils/cketh-transactions.utils';
import {
	isTokenCkBtcLedger,
	isTokenCkErc20Ledger,
	isTokenCkEthLedger
} from '$icp/utils/ic-send.utils';
import { mapIcrcTransaction, mapTransactionIcrcToSelf } from '$icp/utils/icrc-transactions.utils';
import type { SchedulerJobData, SchedulerJobParams } from '$lib/schedulers/scheduler';
import type { PostMessage, PostMessageDataRequestIcrc } from '$lib/types/post-message';
import {
	type IcrcIndexNgGetTransactions,
	type IcrcTransaction,
	type IcrcTransactionWithId
} from '@dfinity/ledger-icrc';
import { assertNonNullish, nonNullish } from '@dfinity/utils';

const getTransactions = ({
	identity,
	certified,
	data
}: SchedulerJobParams<PostMessageDataRequestIcrc>): Promise<IcrcIndexNgGetTransactions> => {
	assertNonNullish(data, 'No data - indexCanisterId - provided to fetch transactions.');

	return getTransactionsApi({
		identity,
		certified,
		owner: identity.getPrincipal(),
		// We query tip to discover the new transactions
		start: undefined,
		...data
	});
};

const mapTransaction = ({
	transaction,
	jobData: { identity, data }
}: {
	transaction: Pick<IcrcTransactionWithId, 'id'> & { transaction: IcrcTransaction };
	jobData: SchedulerJobData<PostMessageDataRequestIcrc>;
}): IcTransactionUi => {
	const ledgerId = nonNullish(data) ? { ledgerCanisterId: data.ledgerCanisterId } : undefined;
	const env = { env: data?.env };

	if (nonNullish(ledgerId) && isTokenCkBtcLedger(ledgerId)) {
		return mapCkBTCTransaction({ transaction, identity, ...env, ...ledgerId });
	}

	if (nonNullish(ledgerId) && (isTokenCkEthLedger(ledgerId) || isTokenCkErc20Ledger(ledgerId))) {
		return mapCkEthereumTransaction({ transaction, identity, ...env, ...ledgerId });
	}

	return mapIcrcTransaction({ transaction, identity });
};

const scheduler: IcWalletScheduler<
	IcrcTransaction,
	IcrcTransactionWithId,
	PostMessageDataRequestIcrc
> = new IcWalletScheduler(
	getTransactions,
	mapTransactionIcrcToSelf,
	mapTransaction,
	'syncIcrcWallet'
);

onmessage = async ({ data: dataMsg }: MessageEvent<PostMessage<PostMessageDataRequestIcrc>>) => {
	const { msg, data } = dataMsg;

	switch (msg) {
		case 'stopIcrcWalletTimer':
			scheduler.stop();
			return;
		case 'startIcrcWalletTimer':
			await scheduler.start(data);
			return;
		case 'triggerIcrcWalletTimer':
			await scheduler.trigger(data);
			return;
	}
};
