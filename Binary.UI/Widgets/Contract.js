/// <reference path="../Scripts/ext-all-debug-w-comments.js" />
/// <reference path="../Scripts/Binary/Binary.Core.js" />
/// <reference path="../Scripts/Binary/Binary.Api.Client.js" />
/// <reference path="../Scripts/Binary/Linq.js" />

window.Binary = window.Binary || {};

Binary.ContractsClass = function (renderTo, symbolData)
{
	var symbolInfo = symbolData;
	var currentContract = null;
	var el = renderTo;
	var tabs = null;
	var payoutCurrencies = ["USD"];
	var me = this;

	var symbolCache = {};
	var requestPrice = function ()
	{
		Binary.Api.Client.contract(function (contractData)
		{
			//http://rmg-prod.apigee.net/v1/binary/contract/INTRADU/R_100/sec/30/USD/20/0/0/0
		},
		contractData);
	};

	var startTimeStore = Ext.create('Ext.data.Store',
	{
		fields: ['startTime', 'startTimeLabel'],
		data: []
	});

	var refreshStartTime = function()
	{
		startTimeStore.removeAll();
		startTimeStore.add(
			{
				startTime: 'Now',
				startTimeLabel: 'Now'
			});
		var now = new Date();
		var minutes = Math.floor(now.getUTCMinutes() / 5);
		var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), minutes, now.getUTCSeconds());

		//for(var i=0;i<new Date().getUTCDate()
	};
	refreshStartTime();

	//window.setInterval(refreshStartTime, 5*60*1000);

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
					symbolData: symbolInfo,
					symbolContractData: null,
					endTimeMode: false,
					defaults:
					{
						labelSeparator: '',
						labelWidth: 65,
						anchor: '100%',
						labelAlign: 'right',
						getContainer: function()
						{
							return this.up();	//'[name="contractContainer"]'
						}
					},
					listeners:
					{
						afterrender: function ()
						{
							var me = this;
							var contractTypeName = me.title;
							var contractType = Binary.Api.ContractTypes[contractTypeName].name;
							var cacheKey = contractType + me.symbolData.symbolDetails.symbol;
							if (symbolCache[cacheKey])
							{
								me.symbolContractData = symbolCache[cacheKey];
								me.updateUI();
							}
							else
							{
								me.setLoading(true);
								Binary.Api.Client.markets.contract_categories.contract_category(function (data)
								{
									me.setLoading(false);
									me.symbolContractData = symbolCache[cacheKey] = data;
									me.updateUI();
								},
								me.symbolData.marketDetails.market,
								contractType,
								me.symbolData.symbolDetails.symbol);
							}
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
					getEndDayField: function()
					{
						return this.down('[name="endDay"]');
					},
					getEndTimefield: function()
					{
						return this.down('[name="endTime"]');
					},
					
					getValues: function()
					{
						var me = this;
						var requestValues =
						{
							contractType: linq.first(Binary.Api.ContractTypes[this.title].contracts, function(c)
							{
								return c.is_forward_starting == me.endTimeMode;
							}),
							start: me.endTimeMode ? 
						};
					},
					updateUI: function(offering)
					{
						var cm = this.contractMetedata = (offering || this.contractMetedata);
						//var me = this;
						this.down('[name="startTime"]').setVisible(
							linq.any(cm.available, function (item) { return item.is_forward_starting == "Y"; }));

						var durationKindCombo=this.getDurationKindCombo();
						this.getEndDayField().setVisible(this.endTimeMode);
						this.getEndTimefield().setVisible(this.endTimeMode);
						this.getDurationField().setVisible(!this.endTimeMode);

						var durationTypeCombo = this.getDurationTypeCombo();
						durationTypeCombo.setVisible(!me.endTimeMode);

						if (!this.endTimeMode)
						{
							durationTypeCombo.store.clearFilter();
							durationTypeCombo.store.filter(
							[
								{
									filterFn: function (rec)
									{
										return linq.any(cm.available, function (item) { return rec.data.durationType==item.expiry_type; });
									}
								}
							]);
							var selectedDurationType = durationTypeCombo.store.last().get(durationTypeCombo.valueField);
							durationTypeCombo.suspendEvents(false);
							durationTypeCombo.setValue(selectedDurationType);
							durationTypeCombo.resumeEvents();

							if (this.symbolContractData && false)
							{
								var durationField = this.getDurationField();
								var minValue = 5;
								var maxValue = 15;
								if (selectedDurationType != 'ticks')
								{
									//var property
									for (var p in this.symbolContractData)
									{
										//if (this.symbolContractData[p][
									}
								}
								durationField.setValue(minValue);
								durationField.setMinValue(minValue);
								durationField.setMaxValue(maxValue);
							}
						}
					},
					items:
					[
						{
							xtype: 'combobox',
							name: 'startTime',
							displayField: 'startTimeLabel',
							valueField: 'startTime',
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
								flex: 1,
								getContainer: function()
								{
									return this.up().getContainer();
								}
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
											var container = this.getContainer();
											container.endTimeMode = (value == 'EndTime');
											container.updateUI();
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
									xtype: 'numberfield',
									style: 'margin-right:5px',
									value: 5,
									minValue: 5,
									maxValue: 15,
									allowDecimals: false,
									hideTrigger:true,
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
										fields: ['durationType', 'durationName', 'timeInterval'],
										data:
										[
											{
												durationType: 'daily',
												durationName: 'days',
												timeInterval: 1*60*60*24
											},
											{
												durationType: 'intraday',
												durationName: 'hours',
												timeInterval: 60*60
											},
											{
												durationType: 'intraday',
												durationName: 'minutes',
												timeInterval: 60
											},
											{
												durationType: 'intraday',
												durationName: 'seconds',
												timeInterval: 1
											},
											{
												durationType: 'ticks',
												durationName: 'ticks'
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
									listeners:
									{
										afterrender: function()
										{
											this.setValue(this.store.first());
										}
									},
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
		},
		null, null, symbolInfo.symbolDetails.displayName, null, null, null, null, null, null);
	};

	Binary.Api.Client.payout_currencies(function (data)
	{
		payoutCurrencies = data.payout_currencies;
		me.update(symbolInfo);
	});
};
