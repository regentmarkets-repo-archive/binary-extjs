/// <reference path="../../../Dashboard/Ext.Dashboard/Scripts/ext-all-debug-w-comments.js" />
Binary = Binary || {};

Binary.MarketSelectorClass = function ()
{
	var marketStore = Ext.create('Ext.data.Store',
	{
		id: 'marketStore',
		model: Ext.define('Market',
		{
			extend: 'Ext.data.Model',
			fields: ['marketName', 'display_name', { name: 'submarkets', type: 'string' }, { name: 'symbols', type: 'string' }, { name: 'contract_categories', type: 'string' }]
		}),
		proxy:
		{
			type: 'memory',
			reader: { type: 'array' }
		}
	});

	var symbolStore = Ext.create('Ext.data.Store',
	{
		id: 'symbolStore',
		model: Ext.define('Symbol',
		{
			extend: 'Ext.data.Model',
			fields: ['symbol', 'display_name']
		})
	});

	Binary.Markets = {};
	Binary.Markets = Binary.Markets || {};

	Binary.Api.Client.markets(function (data)
	{
		for (var k in data.markets)
		{
			if (data.markets[k] != 'prototype' && data.markets[k] != 'futures')
			{
				Binary.Markets[k] = {};
				Binary.Markets[k].name = data.markets[k];
				Binary.Markets[k].symbols = [];
				Binary.Markets[k].contract_categories = [];
			}
		}

		Binary.Mediator.fireEvent('marketsAvailable', Binary.Markets);
		build_market_select();
	});

	Binary.Api.Client.offerings(function (offerings_data)
	{
		var dat = offerings_data.offerings;
		var submarket_array = [];
	});
}


var build_market_select = function ()
{
	var marketStore=Ext.data.StoreManager.lookup('marketStore');
	$.each(Binary.Markets, function ()
	{
		if (this.name)
		{
			marketStore.add(
			{
				marketName: this.name,
				display_name: this.name.charAt(0).toUpperCase() + this.name.slice(1)
			});
		}
	});

	init_contracts(false);

	Ext.create('Ext.form.field.ComboBox',
	{
		id: 'ext_Market_market',
		renderTo: 'ext_Market_div',
		value: 'random',
		valueField: 'marketName',
		displayField: 'display_name',
		emptyText: 'Select market',
		store: 'marketStore',
		queryMode: 'local',
		labelWidth: 70,
		padding: 5,
		editable: false,
		listeners:
		{
			afterrender: function ()
			{
				build_instrument_select();
			},
			change: function ()
			{
				build_instrument_select();
				//build_contractCategory_select();
				if (Ext.ComponentQuery.query('[name=tradePanel_container]')[0])
					resetTabs();
			}
		}
	});
};

var build_instrument_select = function ()
{
	Ext.data.StoreManager.lookup('symbolStore').removeAll();
	var instrumentExtCombo = Ext.getCmp('ext_Symbol_market');
	if (!instrumentExtCombo)
	{
		Ext.create('Ext.form.field.ComboBox',
			{
				id: 'ext_Symbol_market',
				renderTo: 'ext_Symbol_div',
				displayField: 'display_name',
				valueField: 'symbol',
				value: 'R_50',
				emptyText: 'Select symbol',
				store: 'symbolStore',
				queryMode: 'local',
				labelWidth: 70,
				padding: 5,
				editable: false,
				listeners:
				{
					change: function (obj, newValue, oldValue)
					{						
						if ((newValue != oldValue) && (newValue))
						{
							Binary.Mediator.fireEvent('symbolchanged', this);
							Binary.Mediator.fireEvent('instrumentchanged', this);
							if (Ext.ComponentQuery.query('[name=tradePanel_container]')[0])
							{
								var needReset = true;
								var t_panel = Ext.ComponentQuery.query('[name=tradePanel_container]')[0].items.items[0].items.items;
								for (var t in t_panel)
								{
									if (t_panel[t].isDisabled() == false)
									{
										needReset = false;
									}
								}
								if (needReset) resetTabs();
							}
						}						
					}
				}
			});
		Ext.getCmp('ext_Symbol_market').setLoading();
	}
	else
	{
		instrumentExtCombo.clearValue();
		instrumentExtCombo.setLoading();
	}

	if (Binary.Markets)
	{
		for (var i in Binary.Markets)
		{
			if (Binary.Markets[i].name == Ext.getCmp('ext_Market_market').getValue())
				//get symbols using API
				Binary.Api.Client.markets.market(function (data)
				{
					if (data.symbols && data.symbols.length > 0)
					{
						Binary.Markets[i].symbols = [];
						for (var j in data.symbols)
						{
							Binary.Markets[i].symbols.push(data.symbols[j]);
						}
						$.each(Binary.Markets[i].symbols, function ()
						{
							if (this.symbol)
								Ext.data.StoreManager.lookup('symbolStore').add({ symbol: this.symbol, display_name: this.display_name });
						});
						Ext.getCmp('ext_Symbol_market').setLoading(false);
						Ext.getCmp('ext_Symbol_market').setValue(Ext.data.StoreManager.lookup('symbolStore').getAt(0).get('symbol'));
					}
				},
				Binary.Markets[i].name);
		};
	}
};