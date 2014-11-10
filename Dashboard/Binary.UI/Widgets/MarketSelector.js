/// <reference path="../../../Dashboard/Ext.Dashboard/Scripts/ext-all-debug-w-comments.js" />
Binary = Binary || {};

Binary.MarketSelectorClass = function (el)
{
	var marketStore = Ext.create('Ext.data.Store',
	{
		fields: ['market']
	});

	var submarketStore = Ext.create('Ext.data.Store',
	{
		fields: ['market', 'submarket']
	});

	var symbolStore = Ext.create('Ext.data.Store',
	{
		fields: ['submarket', 'symbol']
	});

	Binary.Markets = {};
	var selectorContainer = null;
	var marketSelector = null;
	var submarketSelector = null;
	var symbolSelector = null;

	Binary.Api.Client.offerings(function (data)
	{
		Binary.Markets = data;
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
		}
		
		Binary.Mediator.fireEvent('marketsAvailable', Binary.Markets);
		
		//init_contracts(false);
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
				afterrender: function()
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
							Binary.Mediator.fireEvent('symbolChanged', value);
						}
					}
				})
			]
		});
	});
}
