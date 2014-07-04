Ext.define('Portal.view.profittable.ProfitTable', {
    extend: 'Ext.grid.Panel',
    xtype: 'profittable',

    //controller: 'profittable',

    height: 300,

    store: {
        type: 'profittable',
        autoLoad: true
    },

    stripeRows: true,
    columnLines: true,

    plugins: [
        'cellupdating'
    ],

    columns: [{
        text: 'Ref',
        dataIndex: 'ref'
    }, {
        text: 'Contract',
        dataIndex: 'contract'
    }, {
        text: 'Purchase Price',
        dataIndex: 'purchase_price',
    }, {
        text: 'Sale Price',
        dataIndex: 'sale_price',
    },{
        text: 'Profit Loss',
        dataIndex: 'profit_loss',
    }]
});
