Ext.define('BinaryUI.view.statement.Statement', {
    extend: 'Ext.grid.Panel',
    xtype: 'statement',

    controller: 'statement',

    height: 300,

    store: {
        type: 'statement',
        autoLoad: true
    },

    stripeRows: true,
    columnLines: true,

    plugins: [
        'cellupdating'
    ],

    columns: [{
        text: 'Date',
        dataIndex: 'date'
    },{
        text: 'Ref',
        dataIndex: 'ref'
    }, {
        text: 'Item',
        dataIndex: 'item',
    }, {
        text: 'Debit',
        dataIndex: 'debit',
    }, {
        text: 'Credit',
        dataIndex: 'credit',
    }, {
        text: 'Cash Balance',
        dataIndex: 'cash_balance',
    }]
});
