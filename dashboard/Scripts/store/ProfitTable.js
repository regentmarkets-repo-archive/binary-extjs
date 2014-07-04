Ext.define('Portal.store.ProfitTable', {
	extend: 'Ext.data.Store',

	alias: 'store.profittable',
	model: 'Portal.model.ProfitTable',

	proxy: {
		type: 'memory',
		data: [
            { purchase_date: '2014-01-16 01:54:08', ref: '1205184341', contract: 'AUD 1.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', purchase_price: '1.95', sale_date: '2014-05-16 09:54:08', profit_loss: '1.00' },
            { purchase_date: '2014-02-16 02:54:08', ref: '1205184341', contract: 'AUD 2.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', purchase_price: '2.95', sale_date: '2014-05-16 09:54:08', profit_loss: '0.49' }
           ]
	}
});
