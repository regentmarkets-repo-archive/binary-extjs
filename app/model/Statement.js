Ext.define('BinaryUI.model.Statement', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'date', type: "date" },
       { name: 'ref' },
       { name: 'item' },
       { name: 'debit' },
       { name: 'credit' },
       { name: 'cash_balance' }
    ],
});
