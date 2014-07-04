Ext.define('Portal.model.Statement', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'date', type: "date", dateFormat: 'n/j h:ia' },
       { name: 'ref' },
       { name: 'item' },
       { name: 'debit' },
       { name: 'credit' },
       { name: 'cash_balance' }
    ],
});
