/// <reference path="../Scripts/ext-all-debug-w-comments.js" />
/// <reference path="../Scripts/Binary/Binary.Api.Client.js" />

window.Binary = window.Binary || {};

Binary.ContractsClass = function (renderTo, symbolName)
{
	var symbol = symbolName;
	var currentContract = null;
	var el = renderTo;
	var tabs = null;
	var payoutCurrencies = ["USD"];
	var me=this;
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

	this.update = function (symbolTitle)
	{
		if (tabs != null)
		{
			tabs.destroy();
		}

		Binary.Api.Client.offerings(function (data)
		{
			var contractCategories = data.offerings[0].available[0].available[0].available;
			var items = [];
			for (var i = 0; i < contractCategories.length; i++)
			{
				var category = contractCategories[i];
				items.push(
				{
					title: category.contract_category,
					//layout: 'form',
					xtype: 'form',
					name: 'contractContainer',
					bodyStyle: 'background-color:rgb(245,245,245)',
					contractMetedata: category,
					defaults:
					{
						labelSeparator: '',
						labelWidth: 65,
						anchor: '100%',
						labelAlign: 'right'
					},
					listeners:
					{
						afterrender: function ()
						{
							this.updateUI();
						}
					},
					updateUI: function(offering)
					{
						var cm = this.contractMetedata = (offering || this.contractMetedata);
						this.down('[name="startTime"]').setVisible(
							any(cm.available, function (item) { return item.is_forward_starting == "Y"; }));

						var durationKindCombo=this.down('[name="durationKind"]');
						var endTimeVisible = (durationKindCombo.getValue() == 'EndTime');
						this.down('[name="endDay"]').setVisible(endTimeVisible);
						this.down('[name="endTime"]').setVisible(endTimeVisible);
						this.down('[name="duration"]').setVisible(!endTimeVisible);

						var durationTypeCombo = this.down('[name="durationType"]');
						durationTypeCombo.setVisible(!endTimeVisible);
						durationTypeCombo.store.clearFilter();

						if (!endTimeVisible)
						{
							durationTypeCombo.store.filter(
							[
								{
									filterFn: function (rec)
									{
										return any(cm.available, function (item) { return !!rec.data.applicableFor[item.expiry_type]; });
									}
								}
							]);
						}
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
							fieldLabel: 'Start Time'
						},
						{
							xtype: 'fieldcontainer',
							fieldLabel: ' ',
							layout: 'hbox',
							defaults:
							{
								flex: 1
							},
							items:
							[
								{
									xtype: 'combobox',
									name: 'durationKind',
									valueField: 'durationKind',
									displayField: 'durationName',
									queryMode: 'local',
									value: 'Duration',
									style: 'margin-right:5px',
									editable: false,
									store: Ext.create('Ext.data.Store',
									{
										fields: ['durationKind', 'durationName'],
										data:
										[
											{
												durationName: 'Duration',
												durationKind: 'Duration'
											},
											{
												durationName: 'End Time',
												durationKind: 'EndTime'
											}
										]
									}),
									listeners:
									{
										change: function (combo, value)
										{
											this.up('[name="contractContainer"]').updateUI();
										}
									}
								},
								{
									xtype: 'datefield',
									hidden: true,
									style: 'margin-right:5px',
									name: 'endDay'
								},
								{
									xtype: 'timefield',
									hidden: true,
									name: 'endTime'
								},
								{
									xtype: 'textfield',
									style: 'margin-right:5px',
									value: 5,
									name: 'duration'
								},
								{
									xtype: 'combobox',
									name: 'durationType',
									valueField: 'durationType',
									displayField: 'durationName',
									queryMode: 'local',
									value: 'ticks',
									editable: false,
									store: Ext.create('Ext.data.Store',
									{
										fields: ['durationType', 'durationName', 'applicableFor'],
										data:
										[
											{
												durationType: 'days',
												durationName: 'days',
												applicableFor: { daily: true }
											},
											{
												durationType: 'hours',
												durationName: 'hours',
												applicableFor: { daily: true, intraday: true }
											},
											{
												durationType: 'minutes',
												durationName: 'minutes',
												applicableFor: { daily: true, intraday: true }
											},
											{
												durationType: 'seconds',
												durationName: 'seconds',
												applicableFor: { daily: true, intraday: true }
											},
											{
												durationType: 'ticks',
												durationName: 'ticks',
												applicableFor: { daily: true, intraday: true, tick: true }
											}
										]
									})
								}
							]
						},
						{
							xtype: 'textfield',
							height: 40,
							width: 200,
							fieldStyle: 'font-size:20px',
							labelStyle: 'margin-top:10px',
							anchor: null,
							name: 'spot',
							fieldLabel: 'Spot'
						},
						{
							xtype: 'textfield',
							name: 'barrierOffset',
							hidden: true,
							fieldLabel: 'Barrier offset'
						},
						{
							xtype: 'textfield',
							name: 'highBarrierOffset',
							hidden: true,
							fieldLabel: 'High barrier offset'
						},
						{
							xtype: 'textfield',
							name: 'lowBarrierOffset',
							hidden: true,
							fieldLabel: 'Low barrier offset'
						},
						{
							xtype: 'fieldcontainer',
							fieldLabel: ' ',
							layout: 'hbox',
							defaults:
							{
								flex: 1
							},
							items:
							[
								{
									xtype: 'combobox',
									name: 'payoutType',
									valueField: 'payoutType',
									displayField: 'payoutName',
									queryMode: 'local',
									value: 'Payout',
									style: 'margin-right:5px',
									editable: false,
									store: Ext.create('Ext.data.Store',
									{
										fields: ['payoutType', 'payoutName'],
										data:
										[
											{
												payoutType: 'Stake',
												payoutName: 'Stake'
											},
											{
												payoutType: 'Payout',
												payoutName: 'Payout'
											}
										]
									})
								},
								{
									xtype: 'combobox',
									name: 'payoutCurrency',
									style: 'margin-right:5px',
									store: payoutCurrencies
								},
								{
									xtype: 'textfield',
									value: 30,
									name: 'payoutAmount'
								}
							]
						}
					]
				});
			}
			tabs = Ext.create("Ext.tab.Panel",
			{
				renderTo: el,
				style: 'padding: 7px 3px 7px 3px; max-width:700px',
				width: '100%',
				items: items
			});
		},
		null, null, symbolTitle, null, null, null, null, null, null);
	};

	Binary.Api.Client.payout_currencies(function (data)
	{
		payoutCurrencies = data.payout_currencies;
		me.update(symbol);
	});
};