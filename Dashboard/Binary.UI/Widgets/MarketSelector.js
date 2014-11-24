/// <reference path="../../../Dashboard/Ext.Dashboard/Scripts/ext-all-debug-w-comments.js" />
/// <reference path="../Scripts/Binary/Binary.Api.Client.js" />

Binary = Binary || {};

Binary.MarketSelectorClass = function (el)
{
	var marketStore = Ext.create('Ext.data.Store',
	{
		fields: ['market', 'display_name']
	});

	var symbolStore = Ext.create('Ext.data.Store',
	{
		fields: ['market', 'symbol', 'display_name']
	});

	Binary.Markets = {};
	var selectorContainer = null;
	var marketSelector = null;
	var symbolSelector = null;

	Binary.Api.Client.markets(function (data)
	{
		var marketsCount = data.markets.length;
		for (var i = 0; i < data.markets.length; i++)
		{
			var market = data.markets[i];
			marketStore.add(
			{
				display_name: market.charAt(0).toUpperCase() + market.substr(1),
				market: market
			});
			Binary.Api.Client.markets.market(function (marketData, eventData)
			{
				Binary.Markets[eventData.market] = marketData.symbols;
				for (var s = 0; s < marketData.symbols.length; s++)
				{
					var symbolDetails = marketData.symbols[s];
					symbolStore.add(
					{
						market: eventData.market,
						symbol: symbolDetails.symbol,
						display_name: symbolDetails.display_name
					});
				};
				marketsCount--;
				if (marketsCount == 0)
				{
					Binary.Mediator.fireEvent('marketsAvailable', Binary.Markets);
					selectorContainer = new Ext.container.Container(
					{
						renderTo: el,
						width: '50%',
						layout: 'column',
						defaults:
						{
							columnWidth: 1 / 2,
							selectFirst: function (field, value)
							{
								if (field && value)
								{
									this.store.clearFilter();
									this.store.filter(field, value);
								}
								if (this.store.getCount() > 0)
								{
									this.setValue(this.store.getAt(0).get(this.valueField));
								}
								else
								{
									this.setValue(null);
								}
							}
						},
						listeners:
						{
							afterrender: function ()
							{
								marketSelector.selectFirst();
							}
						},
						items:
						[
							marketSelector = Ext.create('Ext.form.field.ComboBox',
							{
								valueField: 'market',
								displayField: 'display_name',
								store: marketStore,
								queryMode: 'local',
								editable: false,
								listeners:
								{
									change: function (combo, value)
									{
										Binary.Mediator.fireEvent('marketChanged', value);
										symbolSelector.selectFirst('market', value);
									}
								}
							}),
							symbolSelector = Ext.create('Ext.form.field.ComboBox',
							{
								valueField: 'symbol',
								displayField: 'display_name',
								store: symbolStore,
								editable: false,
								queryMode: 'local',
								listeners:
								{
									change: function (combo, value)
									{
										Binary.Mediator.fireEvent('symbolChanged',
										{
											symbolDetails: combo.valueModels[0].data,
											marketDetails: marketStore.findRecord('market', combo.valueModels[0].data.market).data
										});
									}
								}
							})
						]
					});
				}
			},
			market,
			{ market: market });
		}
	});
	/*
	Binary.Api.Client.offerings(function (data)
	{
		Binary.Markets = data;
		var numberOfMarketsReady = 0;
		for (var m = 0; m < data.offerings.length; m++)
		{
			var offering = data.offerings[m];
			marketStore.add(
			{
				market: offering.market
			});

			for (var sm = 0; sm < offering.available.length; sm++)
			{
				var submarket = offering.available[sm];
				submarketStore.add(
				{
					market: offering.market,
					submarket: submarket.submarket
				});

				for (var sy = 0; sy < submarket.available.length; sy++)
				{
					symbolStore.add(
					{
						submarket: submarket.submarket,
						symbol: submarket.available[sy].symbol
					});
				}
			}

			Binary.Api.Client.markets.market(function (data)
			{
				numberOfMarketsReady++;
				for (var i = 0; i < data.symbols.length; i++)
				{
					var symbolDetails = data.symbols[i];
					var rec = symbolStore.findRecord('symbol', symbolDetails.display_name);
					if (rec)
					{
						rec.set('sysName', symbolDetails.symbol);
					}
				}

				if (numberOfMarketsReady == Binary.Markets.data.offerings.length)
				{
					Binary.Mediator.fireEvent('marketsAvailable', Binary.Markets);
					selectorContainer = new Ext.container.Container(
					{
						renderTo: el,
						width: '50%',
						layout: 'column',
						defaults:
						{
							columnWidth: 1 / 3,
							selectFirst: function (field, value)
							{
								if (field && value)
								{
									this.store.clearFilter();
									this.store.filter(field, value);
								}
								if (this.store.getCount() > 0)
								{
									this.setValue(this.store.getAt(0).get(this.valueField));
								}
								else
								{
									this.setValue(null);
								}
							}
						},
						listeners:
						{
							afterrender: function ()
							{
								marketSelector.selectFirst();
							}
						},
						items:
						[
							marketSelector = Ext.create('Ext.form.field.ComboBox',
							{
								valueField: 'market',
								displayField: 'market',
								store: marketStore,
								queryMode: 'local',
								editable: false,
								listeners:
								{
									change: function (combo, value)
									{
										Binary.Mediator.fireEvent('marketChanged', value);
										submarketSelector.selectFirst('market', value);
									}
								}
							}),
							submarketSelector = Ext.create('Ext.form.field.ComboBox',
							{
								valueField: 'submarket',
								displayField: 'submarket',
								store: submarketStore,
								editable: false,
								queryMode: 'local',
								listeners:
								{
									change: function (combo, value)
									{
										Binary.Mediator.fireEvent('submarketChanged', value);
										symbolSelector.selectFirst('submarket', value);
									}
								}
							}),
							symbolSelector = Ext.create('Ext.form.field.ComboBox',
							{
								valueField: 'symbol',
								displayField: 'symbol',
								store: symbolStore,
								editable: false,
								queryMode: 'local',
								listeners:
								{
									change: function (combo, value)
									{
										Binary.Mediator.fireEvent('symbolChanged',
										{
											market: marketSelector.getValue(),
											subMarket: submarketSelector.getValue(),
											symbol: symbolSelector.getValue()
										});
									}
								}
							})
						]
					});
				}
			},
			offering.market.toLowerCase());
		};
		
		//init_contracts(false);
	});
	*/
}
