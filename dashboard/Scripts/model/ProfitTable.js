Ext.define('Portal.model.ProfitTable', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'purchase_date', type: 'date', dateFormat: 'n/j h:ia' },
       { name: 'ref' },
       { name: 'contract' },
       { name: 'purchase_price' },
       { name: 'sale_date', type: 'date', dateFormat: 'n/j h:ia' },
       { name: 'profit_loss' },
    ],
});
