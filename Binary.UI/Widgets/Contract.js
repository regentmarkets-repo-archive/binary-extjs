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

	var timers = [];

	var startTimeStore = Ext.create('Ext.data.Store',
	{
		fields: ['startTime', 'startTimeLabel', 'startDate'],
		data: []
	});

	var displayCurrentUTC = function (tabPanel)
	{
		var utcNow=Binary.getUtcDate();
		Ext.each(tabPanel.query('[name="utcNow"]'), function (utcNowField)
		{
			utcNowField.setValue(String.format("{0}:{1}:{2}", Number.zeroFill(utcNow.getHours(), 2), Number.zeroFill(utcNow.getMinutes(), 2), Number.zeroFill(utcNow.getSeconds(), 2)));
		});
		var now = new Date();
		Ext.each(tabPanel.query('[name="localNow"]'), function (localNowField)
		{
			localNowField.setValue(String.format("{0}:{1}:{2}", Number.zeroFill(now.getHours(), 2), Number.zeroFill(now.getMinutes(), 2), Number.zeroFill(now.getSeconds(), 2)));
		});
	};
	var refreshTimePickers = function (tabPanel)
	{
		var now = new Date();
		var startMinute = Math.floor(now.getUTCMinutes() / 5 + 1) * 5;
		var utcNow = Binary.getUtcDate(null, null, null, null, startMinute, null);
		var startTimeComboboxes = tabPanel.query('[name="startTime"]');

		Ext.each(tabPanel.query('[name="endTime"]'), function (endTimeField)
		{
			endTimeField.setMinValue(utcNow);
			endTimeField.setMaxValue(Binary.getUtcDate(null, null, null, 24, 0, 0));
		});

		startTimeStore.removeAll();
		startTimeStore.add(
			{
				startTime: 'Now',
				startTimeLabel: 'Now',
				startDate: null
			});

		var tomorrow = Binary.getUtcDate(null, null, now.getUTCDate() + 1, 0, 0, 0);
		while(utcNow < tomorrow)
		{
			startTimeStore.add(
			{
				startTime: Math.floor(utcNow.getTime() / 1000),
				startTimeLabel: String.format("{0}:{1}", Number.zeroFill(utcNow.getHours(), 2), Number.zeroFill(utcNow.getMinutes(), 2)),
				startDate: utcNow
			});
			startMinute += 5;
			utcNow = Binary.getUtcDate(null, null, null, null, startMinute, null);
		}
	};

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
					contractMetedata: Ext.apply(category, Binary.Api.ContractTypes[category.contract_category]),
					symbolData: symbolInfo,
					endTimeMode: false,
					isForward: false,
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
							start: me.endTimeMode
						};
					},
					updateUI: function()
					{
						var cm = this.contractMetedata;
						//var me = this;
						this.down('[name="startTime"]').setVisible(
							linq.any(cm.available, function (item) { return item.is_forward_starting == "Y"; }));

						var durationKindCombo=this.getDurationKindCombo();
						this.getEndDayField().setVisible(this.endTimeMode);
						this.getEndTimefield().setVisible(this.endTimeMode);
						this.getDurationField().setVisible(!this.endTimeMode);
						//this.getDurationTypeCombo().setVisible(!this.endTimeMode);

						var durationTypeCombo = this.getDurationTypeCombo();
						durationTypeCombo.setVisible(!this.endTimeMode);

						var fwdString = this.isForward ? 'Y' : 'N';
						if (!this.endTimeMode)
						{
							durationTypeCombo.store.clearFilter();
							durationTypeCombo.store.filter(
							[
								{
									filterFn: function (rec)
									{
										return linq.any(cm.available, function (cType)
										{
											return rec.data.durationType == cType.expiry_type && cType.is_forward_starting == fwdString;
										});
									}
								}
							]);

							//if no record found, selected duration is invalid - select another
							var selectedDurationType = durationTypeCombo.getValue();
							var rec = durationTypeCombo.store.findRecord(durationTypeCombo.valueField, durationTypeCombo.getValue());
							if (!rec)
							{
								selectedDurationType = durationTypeCombo.store.last().get(durationTypeCombo.valueField);
								durationTypeCombo.suspendEvents(false);
								durationTypeCombo.setValue(selectedDurationType);
								durationTypeCombo.resumeEvents();
								rec = durationTypeCombo.store.findRecord(durationTypeCombo.valueField, durationTypeCombo.getValue());
							}

							var durationField = this.getDurationField();
							var contract = linq.first(cm.available, function(c)
							{
								return c.expiry_type == selectedDurationType && c.is_forward_starting == fwdString;
							});

							if (selectedDurationType == 'intraday')
							{
								durationField.setMinValue(contract.durations.min / rec.get('timeInterval'));
								durationField.setMaxValue(contract.durations.max / rec.get('timeInterval'));
							}
							else
							{
								durationField.setMinValue(contract.durations.min);
								durationField.setMaxValue(contract.durations.max);
							}
						}
					},
					items:
					[
						{
							xtype: 'fieldcontainer',
							fieldLabel: 'Start Time',
							layout: 'hbox',
							defaults:
							{
								flex: 1
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
									queryMode: 'local',
									editable: false,
									listeners:
									{
										change: function (combo, value)
										{
											var container = this.up().getContainer();
											container.isForward = (value != 'Now');
											container.updateUI();
										}
									}
								},
								{
									xtype: 'textfield',
									disabled: true,
									labelStyle:'margin-left:6px;',
									labelWidth: 30,
									name: 'utcNow',
									fieldLabel: 'UTC'
								},
								{
									xtype: 'textfield',
									disabled: true,
									labelStyle: 'margin-left:3px;',
									labelWidth: 30,
									name: 'localNow',
									fieldLabel: 'Now'
								}
							]
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
									editable: false,
									value: 'Duration',
									style: 'margin-right:5px',
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
									editable: false,
									style: 'margin-right:5px',
									name: 'endDay'
								},
								{
									xtype: 'timefield',
									hidden: true,
									editable: false,
									increment: 5,
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
												durationType: 'tick',
												durationName: 'ticks'
											}
										]
									}),
									listeners:
									{
										change: function ()
										{
											this.getContainer().updateUI();
										}
									}
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
									editable: false,
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
				style: 'padding: 7px 5px 7px 3px;',
				width: '100%',
				items: items,
				timers: [],
				listeners:
				{
					afterrender: function ()
					{
						refreshTimePickers(this);
						displayCurrentUTC(this);
						this.timers.push(window.setInterval(displayCurrentUTC, 1000, this));
						this.timers.push(window.setInterval(refreshTimePickers, 5 * 60 * 1000, this));
					},
					beforedestroy: function ()
					{
						for (var i = 0; i < this.timers.length; i++)
						{
							window.clearInterval(this.timers[i]);
						}
					}
				}
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
