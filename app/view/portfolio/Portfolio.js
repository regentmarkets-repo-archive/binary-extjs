Ext.define('BinaryUI.view.portfolio.Portfolio', {
    extend: 'Ext.grid.Panel',
    xtype: 'portfolio',

    controller: 'portfolio',

    height: 300,

    store: {
        type: 'portfolio',
        autoLoad: true
    },

    stripeRows: true,
    columnLines: true,

    plugins: [
        'cellupdating'
    ],

    columns: [{
        text: 'Ref',
        sortable: false,
        dataIndex: 'ref'
    }, {
        text: 'Contract Details',
        dataIndex: 'details',
    }, {
        text: 'Purchase',
        dataIndex: 'purchase',
    }, {
        text: 'Indicative',
        dataIndex: 'indicative',
    }]
});
