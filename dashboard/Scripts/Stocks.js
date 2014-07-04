var meTest = {};
	Ext.define('Portal.view.stocks.Stocks', {
    extend: 'Ext.grid.Panel',
    xtype: 'stocks',

    requires: [
        //'widget.sparklineline',
        'plugin.cellupdating'
    ],

    //controller: 'stocks',

    height: 300,

    store: {
        type: 'stocks',
        autoLoad: true
    },

    stripeRows: true,
    columnLines: true,

    plugins: [
        //'cellupdating'
    ],

    viewConfig:{
    	markDirty:false
    },

    renderPositiveNegative: function (val, format) {
    	var out = Ext.util.Format.number(val, '0.00'),
            s = '<span';

    	if (val > 0) {
    		s += ' style="color:#73b51e;"';
    	} else if (val < 0) {
    		s += ' style="color:#cf4c35;"';
    	}

    	return s + '>' + out + '</span>';
    },

    updaterPositiveNegative: function (cell, value, format) {
    	var innerSpan = Ext.fly(cell).down('span', true);

    	innerSpan.style.color = value > 0 ? '#73b51e' : '#cf4c35';
    	innerSpan.firstChild.data = Ext.util.Format.number(value, format);
    },
    columns: [{
        text: 'Company',
        flex: 1,
    	//sortable: true,
        renderer: function (val, m , r , row) {
        	var result = Ext.data.StoreManager.lookup('Stocks').data.items[row].raw[0];
        	return result;
        },
    }, {
        text: 'Price',
        width: 75,
        formatter: 'usMoney',
        dataIndex: 'price',
        align: 'right'
    }, {
        text: 'Trend',
        width: 100,
        dataIndex: 'trend',
        //xtype: 'widgetcolumn',
        //widget: {
        //    xtype: 'sparklineline',
        //    tipTpl: 'Price: {y:number("0.00")}'
        //}
    }, {
        text: 'Change',
        width: 80,
        producesHTML: true,
        renderer: function (val) {
        	return this.renderPositiveNegative(val, '0.00');
        },
        dataIndex: 'change',
        align: 'right'
    }, {
        text: '%',
        width: 70,
        renderer: function (val) {
        	return this.renderPositiveNegative(val, '0.00%');
        },
        updater: function (cell, value) {
        	this.updaterPositiveNegative(cell, value, '0.00%');
        },
        dataIndex: 'pctChange',
        align: 'right'
    }, {
        text: 'Last Updated',
        hidden: true,
        width: 175,
        sortable: true,
        formatter: 'date("m/d/Y H:i:s")',
        dataIndex: 'lastChange'
    }]
});
