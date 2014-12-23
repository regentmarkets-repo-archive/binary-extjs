/// <reference path="../Scripts/ext-all-debug-w-comments.js" />
/// <reference path="../Scripts/Binary/Binary.Api.Client.js" />

window.Binary = window.Binary || {};

Binary.ContractsClass = function (renderTo, symbolName)
{
	var symbol = symbolName;
	var el = renderTo;
	var tabs = null;
	var any = function (array, expression)
	{
		for (var i = 0; i < array.length; i++)
		{
			if (expression(array[i])) return true;
		}
		return false;
	};

	this.update = function (symbolTitle)
	{
		if (tabs != null)
		{
			tabs.destroy();
		}

		Binary.Api.Client.offerings(function (data)
		{
			var s = data.offerings;
			var contractCategories = data.offerings[0].available[0].available[0].available;
			var items = [];
			for (var i = 0; i < contractCategories.length; i++)
			{
				var category = contractCategories[i];
				items.push(
				{
					title: category.contract_category,
					layout: 'form',
					items:
					[
						{
							labelAlign: 'right',
							labelSeparator: '',
							xtype: 'combobox',
							name: 'startTime',
							hidden: !any(category.available, function(item) { return item.is_forward_starting=="Y"; }),
							fieldLabel: 'Start Time'
						},
						{
							xtype: 'combobox',
							name: 'durationKind',
							valueField: 'duration',
							displayField: 'durationName',
							queryMode: 'local',
							value: 'Duration',
							editable: false,
							store: Ext.create('Ext.data.Store',
							{
								fields: ['durationName', 'duration'],
								data:
								[
									{
										durationName: 'Duration',
										duration: 'Duration'
									},
									{
										durationName: 'End Time',
										duration: 'EndTime'
									}
								]
							}),
							listeners:
							{
								change: function (combo, value)
								{

								}
							}
						},
						{
							xtype: 'datefield',
							name: 'durationDays'
						},
						{
							xtype: 'datefield',
							name: 'endTimeDurationDays'
						},
						{
							xtype: 'textfield',
							readonly: true,
							name: 'endTimeDurationTime'
						},
						{
							xtype: 'label',
							text: 'minimum duration'
						},
						{
							xtype: 'text',
							name: 'duration'
						},
						{
							xtype: 'combobox',
							name: 'durationType'
						},
						{
							xtype: 'text',
							name: 'spot',
							fieldLabel: 'Spot',
							width: 100
						},
						{
							xtype: 'text',
							name: 'barrierOffset',
							fieldLabel: 'Barrier offset'
						},
						{
							xtype: 'text',
							name: 'highBarrierOffset',
							fieldLabel: 'High barrier offset'
						},
						{
							xtype: 'text',
							name: 'lowBarrierOffset',
							fieldLabel: 'Low barrier offset'
						},
						{
							xtype: 'combobox',
							name: 'payoutType',
							width: 90
						},
						{
							xtype: 'combobox',
							name: 'payoutCurrency',
							width: 77
						},
						{
							xtype: 'text',
							name: 'payoutAmount',
							width: 85
						}
					]
				});
			}
			tabs = Ext.create("Ext.tab.Panel",
			{
				renderTo: el,
				border: 1,
				bodyStyle: 'padding:10px 10px 10px 10px',
				width: 400,
				items: items
			});
		},
		null, null, symbolTitle, null, null, null, null, null, null);
	};

	this.update(symbol);
};