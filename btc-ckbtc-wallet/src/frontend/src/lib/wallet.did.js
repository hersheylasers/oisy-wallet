export const idlFactory = ({ IDL }) => {
	const Network = IDL.Variant({
		Bitcoin: IDL.Null,
		CkBTC: IDL.Null
	});

	const ConversionStatus = IDL.Variant({
		Pending: IDL.Null,
		Complete: IDL.Null,
		Failed: IDL.Text
	});

	const ConversionRecord = IDL.Record({
		timestamp: IDL.Nat64,
		amount: IDL.Nat64,
		fromNetwork: Network,
		toNetwork: Network,
		status: ConversionStatus
	});

	return IDL.Service({
		get_preferred_network: IDL.Func([], [Network], ['query']),
		set_preferred_network: IDL.Func([Network], [], []),
		get_balances: IDL.Func([], [IDL.Record({ btc: IDL.Nat64, ckbtc: IDL.Nat64 })], ['query']),
		get_conversion_history: IDL.Func([], [IDL.Vec(ConversionRecord)], ['query'])
	});
};
