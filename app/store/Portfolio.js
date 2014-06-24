Ext.define('BinaryUI.store.Portfolio', {
	extend: 'Ext.data.Store',

	alias: 'store.portfolio',
	model: 'BinaryUI.model.Portfolio',

	proxy: {
		type: 'memory',
		data: [
            ['1205184341', 'AUD 1.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', 'AUD 1.95', 'AUD 1.46'],
            ['2305184341', 'AUD 2.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', 'AUD 2.95', 'AUD 2.46'],
            ['3305184341', 'AUD 3.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', 'AUD 3.95', 'AUD 3.46'],
            ['4305184341', 'AUD 4.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', 'AUD 4.95', 'AUD 4.46'],
            ['5305184341', 'AUD 5.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', 'AUD 5.95', 'AUD 5.46'],
            ['6305184341', 'AUD 5.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', 'AUD 6.95', 'AUD 6.46'],
            ['7305184341', 'AUD 5.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', 'AUD 7.95', 'AUD 7.46'],
            ['8305184341', 'AUD 5.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', 'AUD 8.95', 'AUD 8.46'],
            ['9305184341', 'AUD 5.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', 'AUD 9.95', 'AUD 9.46'],
            ['10305184341', 'AUD 5.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', 'AUD 10.95', 'AUD 10.46'],
		]
	}
});
