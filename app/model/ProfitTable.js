Ext.define('BinaryUI.model.ProfitTable', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'purchase_date' },
       { name: 'ref' },
       { name: 'contract' },
       { name: 'purchase_price' },
       { name: 'sale_date' },
       { name: 'profit_loss' },
    ],
});
