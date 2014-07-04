Ext.define('Portal.store.Statement', {
	extend: 'Ext.data.Store',

	alias: 'store.statement',
	model: 'Portal.model.Statement',

	proxy:
	{
		type: 'memory',
		data:
		[
            { date: '2014-05-16 09:54:08', ref: '1205184341', item: 'AUD 1.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', debit: '1.95', credit: '', cash_balance: '81.51' },
            { date: '2014-05-16 09:54:08', ref: '1205184341', item: 'AUD 2.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', debit: '', credit: '2.95', cash_balance: '82.51' },
            { date: '2014-05-16 09:54:08', ref: '1205184341', item: 'AUD 3.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', debit: '3.95', credit: '', cash_balance: '83.51' },
            { date: '2014-05-16 09:54:08', ref: '1205184341', item: 'AUD 4.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', debit: '', credit: '4.95', cash_balance: '84.51' },
            { date: '2014-05-16 09:54:08', ref: '1205184341', item: 'AUD 5.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', debit: '5.95', credit: '', cash_balance: '85.51' }
        ]
	}
});
