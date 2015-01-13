/// <reference path="../Scripts/ext-all-debug-w-comments.js" />
/// <reference path="../Scripts/Binary/Binary.Core.js" />
/// <reference path="../Scripts/Binary/Binary.Api.Client.js" />

window.Binary = window.Binary || {};

Binary.ContractsClass = function (renderTo, symbolData)
{
	var symbolInfo = symbolData;
	var currentContract = null;
	var el = renderTo;
	var tabs = null;
	var payoutCurrencies = ["USD"];
	var me = this;
	var any = function (array, expression)
	{
		for (var i = 0; i < array.length; i++)
		{
			if (expression(array[i])) return true;
		}
		return false;
	};

	var priceRequest = function()
	{
		Binary.Api.Client.contract(function (contractData)
		{

		},
		contractData);
	};

	var symbolDataRequestCompleted = function (data)
	{
		var tab = tabs.getActiveTab();
		//set duration kind 'Duration'
		tab.getDurationKindCombo().setValue('Duration');

		//set minimum duration type for symbol
		var durationTypeCombo = tab.getDurationTypeCombo();
		var minStoreTime = Number.MAX_VALUE;
		var minRecord = null;
		durationTypeCombo.store.each(function(rec)
		{
			if (minStoreTime > rec.get('tick'))
			{
				minStoreTime = rec.get('tick');
				minRecord = rec;
			}
		});
		durationTypeCombo.setValue(minRecord.get(durationTypeCombo.valueField));
		//set minimal value
		//var minDurationValue = ;
		var minIntradayDuration = Number.MAX_VALUE;
		for (var p in data)
		{
			if (data[p].intraday_durations && minIntradayDuration > data[p].intraday_durations.min)
			{
				minIntradayDuration = data[p].intraday_durations.min;
			}
		}
		tab.getDurationField().setValue(minIntradayDuration / minStoreTime);
	};
	//http://rmg-prod.apigee.net/v1/binary/contract/INTRADU/R_100/sec/30/USD/20/0/0/0
	var symbolCache = {};
	var requestPrice = function ()
	{
		var contractData = '';
		var contractTypeName = tabs.getActiveTab().title;
		var contractType = Binary.Api.ContractTypes[contractTypeName].name;
		var cacheKey = contractType + symbolInfo.symbolDetails.symbol;
		if (symbolCache[cacheKey])
		{
			symbolDataRequestCompleted(symbolCache[cacheKey]);
		}
		else
		{
			Binary.Api.Client.markets.contract_categories.contract_category(function (data)
			{
				symbolCache[cacheKey] = data;
				symbolDataRequestCompleted(symbolCache[cacheKey]);
			},
			symbolInfo.marketDetails.market,
			contractType,
			symbolInfo.symbolDetails.symbol);
		}
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

	this.update = function (symbolInfo)
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
					getDurationKindCombo: function()
					{
						return this.down('[name="durationKind"]');
					},
					getDurationTypeCombo: function()
					{
						return this.down('[name="durationType"]');
					},
					getDurationField: function()
					{
						return this.down('[name="duration"]');
					},
					updateUI: function(offering)
					{
						var cm = this.contractMetedata = (offering || this.contractMetedata);
						this.down('[name="startTime"]').setVisible(
							any(cm.available, function (item) { return item.is_forward_starting == "Y"; }));

						var durationKindCombo=this.getDurationKindCombo();
						var endTimeVisible = (durationKindCombo.getValue() == 'EndTime');
						this.down('[name="endDay"]').setVisible(endTimeVisible);
						this.down('[name="endTime"]').setVisible(endTimeVisible);
						this.getDurationField().setVisible(!endTimeVisible);

						var durationTypeCombo = this.getDurationTypeCombo();
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
										fields: ['durationType', 'durationName', 'applicableFor', 'tick'],
										data:
										[
											{
												durationType: 'days',
												durationName: 'days',
												tick: 1*60*60*24,
												applicableFor: { daily: true }
											},
											{
												durationType: 'hours',
												durationName: 'hours',
												tick: 60*60,
												applicableFor: { daily: true, intraday: true }
											},
											{
												durationType: 'minutes',
												durationName: 'minutes',
												tick: 60,
												applicableFor: { daily: true, intraday: true }
											},
											{
												durationType: 'seconds',
												durationName: 'seconds',
												tick: 1,
												applicableFor: { daily: true, intraday: true }
											},
											{
												durationType: 'ticks',
												durationName: 'ticks',
												tick: 3,
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
				style: 'padding: 7px 5px 7px 3px; max-width:700px',
				width: '100%',
				items: items
			});
			requestPrice();
		},
		null, null, symbolInfo.symbolDetails.displayName, null, null, null, null, null, null);
	};

	Binary.Api.Client.payout_currencies(function (data)
	{
		payoutCurrencies = data.payout_currencies;
		me.update(symbolInfo);
	});
};
