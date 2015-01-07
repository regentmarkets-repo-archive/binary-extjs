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

	this.requestPrice = function ()
	{
		var contractData = '';
		tabs.query('field')
		Binary.Api.Client.contract(function (data)
		{
		},
		contractData);
	};

	var startTimeStore = Ext.create('Ext.data.Store',
	{
		fields: ['startTime', 'startTimeLabel'],
		data:
		[
			{
				startTime: 'Now',
				startTimeLabel: 'Now'
			}
		]
	});

	var durationTypeStore = Ext.create('Ext.data.Store',
	{
		fields: ['duration'],
		data:
		[
			{
				duration: 'days'
			},
			{
				duration: 'hours'
			},
			{
				duration: 'minutes'
			},
			{
				duration: 'seconds'
			},
			{
				duration: 'ticks'
			}
		]
	});

	this.update = function (symbolTitle)
	{
		if (tabs != null)
		{
			tabs.destroy();
		}

		var me = this;
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
					defaults:
					{
						labelSeparator: '',
						labelWidth: 70,
						anchor: '50%',
						labelAlign: 'right'
					},
					items:
					[
						{
							xtype: 'combobox',
							name: 'startTime',
							displayField: 'startTimeLabel',
							valueField: 'startTime',
							disabled: true,
							value: 'Now',
							store: startTimeStore,
							hidden: !any(category.available, function(item) { return item.is_forward_starting=="Y"; }),
							fieldLabel: 'Start Time'
						},
						{
							xtype: 'fieldcontainer',
							fieldLabel: ' ',
							layout: 'hbox',
							defaults:
							{
								flex: 1,
							},
							items:
							[
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
											var endTimeVisible = (value == 'EndTime');
											var ct = this.up();
											ct.down('[name="endDay"]').setVisible(endTimeVisible);
											ct.down('[name="endTime"]').setVisible(endTimeVisible);
											ct.down('[name="duration"]').setVisible(!endTimeVisible);
											ct.down('[name="durationType"]').setVisible(!endTimeVisible);
										}
									}
								},
								{
									xtype: 'datefield',
									hidden: true,
									name: 'endDay'
								},
								{
									xtype: 'timefield',
									hidden: true,
									name: 'endTime'
								},
								{
									xtype: 'textfield',
									name: 'duration'
								},
								{
									xtype: 'combobox',
									name: 'durationType'
								}
							]
						},
						{
							xtype: 'text',
							name: 'spot',
							fieldLabel: 'Spot',
							width: 100,
							listeners:
							{
								change: function (combo, value)
								{
									me.reqestPrice();
								}
							}
						},
						{
							xtype: 'text',
							name: 'barrierOffset',
							fieldLabel: 'Barrier offset',
							listeners:
							{
								change: function (combo, value)
								{
									me.reqestPrice();
								}
							}
						},
						{
							xtype: 'text',
							name: 'highBarrierOffset',
							fieldLabel: 'High barrier offset',
							listeners:
							{
								change: function (combo, value)
								{
									me.reqestPrice();
								}
							}
						},
						{
							xtype: 'text',
							name: 'lowBarrierOffset',
							fieldLabel: 'Low barrier offset',
							listeners:
							{
								change: function (combo, value)
								{
									me.reqestPrice();
								}
							}
						},
						{
							xtype: 'combobox',
							name: 'payoutType',
							width: 90,
							listeners:
							{
								change: function (combo, value)
								{
									me.reqestPrice();
								}
							}
						},
						{
							xtype: 'combobox',
							name: 'payoutCurrency',
							width: 77,
							listeners:
							{
								change: function (combo, value)
								{
									me.reqestPrice();
								}
							}
						},
						{
							xtype: 'text',
							name: 'payoutAmount',
							width: 85,
							listeners:
							{
								change: function (combo, value)
								{
									me.reqestPrice();
								}
							}
						}
					]
				});
			}
			tabs = Ext.create("Ext.tab.Panel",
			{
				renderTo: el,
				bodyStyle: 'padding:10px 10px 10px 10px',
				width: '100%',
				style: 'max-width:700px',
				cls: 'aaa',
				items: items
			});
		},
		null, null, symbolTitle, null, null, null, null, null, null);
	};

	this.update(symbol);
};