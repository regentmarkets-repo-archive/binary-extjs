Ext.define('BinaryUI.store.ProfitTable', {
	extend: 'Ext.data.Store',

	alias: 'store.profittable',
	model: 'BinaryUI.model.ProfitTable',

	proxy: {
		type: 'memory',
		data: [
            ['2014-01-16 01:54:08', '1205184341', 'AUD 1.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '1.95', '2014-05-16 09:54:08', '1.00', '0.49'],
            ['2014-02-16 02:54:08', '1205184341', 'AUD 2.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '2.95', '2014-05-16 09:54:08', '1.00', '0.49'],
            ['2014-03-16 03:54:08', '1205184341', 'AUD 3.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '3.95', '2014-05-16 09:54:08', '1.00', '0.49'],
            ['2014-04-16 04:54:08', '1205184341', 'AUD 4.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '4.95', '2014-05-16 09:54:08', '1.00', '0.49'],
            ['2014-05-16 05:54:08', '1205184341', 'AUD 5.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '5.95', '2014-05-16 09:54:08', '1.00', '0.49'],
            ['2014-06-16 06:54:08', '1205184341', 'AUD 6.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '6.95', '2014-05-16 09:54:08', '1.00', '0.49'],
            ['2014-07-16 07:54:08', '1205184341', 'AUD 7.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '7.95', '2014-05-16 09:54:08', '1.00', '0.49'],
            ['2014-08-16 08:54:08', '1205184341', 'AUD 8.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '8.95', '2014-05-16 09:54:08', '1.00', '0.49'],
            ['2014-09-16 09:54:08', '1205184341', 'AUD 9.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '9.95', '2014-05-16 09:54:08', '1.00', '0.49'],
            ['2014-10-16 10:54:08', '1205184341', 'AUD 10.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '10.95', '2014-05-16 09:54:08', '1.00', '0.49'],
		]
	}
});
