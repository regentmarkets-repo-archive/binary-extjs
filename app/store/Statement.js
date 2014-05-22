Ext.define('BinaryUI.store.Statement', {
    extend: 'Ext.data.Store',

    alias: 'store.statement',
    model: 'BinaryUI.model.Statement',

    proxy: {
        type: 'memory',
        data: [
            ['2014-05-16 09:54:08', '1205184341', 'AUD 1.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '1.95', '', '81.51'],
            ['2014-05-16 09:54:08', '1205184341', 'AUD 2.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '', '2.95', '82.51'],
            ['2014-05-16 09:54:08', '1205184341', 'AUD 3.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '3.95', '', '83.51'],
            ['2014-05-16 09:54:08', '1205184341', 'AUD 4.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '', '4.95', '84.51'],
            ['2014-05-16 09:54:08', '1205184341', 'AUD 5.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '5.95', '', '85.51'],
            ['2014-05-16 09:54:08', '1205184341', 'AUD 6.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '', '6.95', '86.51'],
            ['2014-05-16 09:54:08', '1205184341', 'AUD 7.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '7.95', '', '87.51'],
            ['2014-05-16 09:54:08', '1205184341', 'AUD 8.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '', '8.95', '88.51'],
            ['2014-05-16 09:54:08', '1205184341', 'AUD 9.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '9.95', '', '89.51'],
            ['2014-05-16 09:54:08', '1205184341', 'AUD 10.00 payout if French Index is strictly higher than entry spot at close on 2014-05-22.', '10.95', '', '90.51'],
        ]
    },

});
