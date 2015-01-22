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
	var priceRequestData = null;
	var refreshPrice = function (tabPanel, callback)
	{
		var requestData = tabPanel.getActiveTab().getValues();
		priceRequestData =
		{
			requestData: requestData,
			requestCount: requestData.contractTypes.length,
			responses: {},
			getCalling: function ()
			{
				return this.requestData.contractTypes[this.requestCount - 1];
			}
		};
		var contractCall = function ()
		{
			Binary.Api.Client.contract(function (contractData, eventData)
			{
				//http://rmg-prod.apigee.net/v1/binary/contract/INTRADU/R_100/sec/30/USD/20/0/0/0
				eventData.responses[eventData.getCalling().contract_name] = contractData;
				eventData.requestCount--;
				if (eventData.requestCount == 0)
				{
					priceRequestData = null;
					callback(eventData);
				}
				else
				{
					contractCall();
				}
			},
			priceRequestData.getCalling().contract_name,
			requestData.symbol,
			requestData.durationUnit,
			requestData.duration,
			requestData.payoutCurrency,
			requestData.payoutAmount,
			requestData.startTime,
			requestData.barrierLow,
			requestData.barrierHigh,
			"info",
			priceRequestData);
		};
		contractCall();
	};

	var timers = [];

	var startTimeStore = Ext.create('Ext.data.Store',
	{
		fields: ['startTime', 'startTimeLabel', 'startDate'],
		data: []
	});

	var displayCurrentUTC = function (tabPanel)
	{
		var utcNow = Date.getUtcDate();
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
		var startMinute = Math.floor(Date.getUtcDate().getMinutes() / 5 + 1) * 5;
		var utcNow = Date.getUtcDate(null, null, null, null, startMinute, 0);
		Ext.each(tabPanel.query('[name="endTime"]'), function (endTimeField)
		{
			endTimeField.setMinValue(utcNow);
			endTimeField.setMaxValue(Date.getUtcDate(null, null, null, 23, 55, 0));
			if (endTimeField.getValue() == null)
			{
				endTimeField.setValue(utcNow);
			}
			endTimeField.validate();
		});

		var utcToday = Date.getUtcDate().getDatePart();
		Ext.each(tabPanel.query('[name="endDay"]'), function (endDayField)
		{
			endDayField.setMinValue(utcToday);
			if (endDayField.getValue() == null)
			{
				endDayField.setValue(utcToday);
			}
			endDayField.validate();
		});
		
		startTimeStore.removeAll();
		startTimeStore.add(
			{
				startTime: 'Now',
				startTimeLabel: 'Now',
				startDate: null
			});

		var tomorrow = utcNow.addDays(1);
		while(utcNow < tomorrow)
		{
			startTimeStore.add(
			{
				startTime: utcNow,
				startTimeLabel: String.format("{0}:{1}", Number.zeroFill(utcNow.getHours(), 2), Number.zeroFill(utcNow.getMinutes(), 2)),
				startDate: utcNow
			});
			startMinute += 5;
			utcNow = Date.getUtcDate(null, null, null, null, startMinute, null);
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
					contractMetadata: Ext.apply(category, Binary.Api.ContractTypes[category.contract_category]),
					symbolData: symbolInfo,
					endTimeMode: false,
					isForward: false,
					isForwardStarting: function()
					{
						return this.isForward ? 'Y' : 'N';
					},
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
					getEndTimeField: function()
					{
						return this.down('[name="endTime"]');
					},
					getStartTimeCombo: function()
					{
						return this.down('[name="startTime"]');
					},
					getPayoutCurrency: function()
					{
						return this.down('[name="payoutCurrency"]').getValue();
					},
					getPayoutAmount: function()
					{
						return this.down('[name="payoutAmount"]').getValue();
					},
					getValues: function()
					{
						var me = this;
						var durationTypeCombo = me.getDurationTypeCombo();
						var selectedDuration = durationTypeCombo.store.findRecord('durationName', durationTypeCombo.getRawValue());
						
						var durationUnit = 'sec';
						var duration = 100;
						var utcNow = Date.getUtcDate();
						if (me.endTimeMode)
						{
							if (me.getEndDayField().getValue() > utcNow)
							{
								durationUnit = 'day';
								duration = new Date(me.getEndDayField().getValue() - utcNow).getDate();
							}
							else
							{
								var endDate = me.getEndDayField().getValue().addTime(me.getEndTimeField().getValue());
								var startDate = me.getEndDayField().getValue().addTime(me.getStartTimeCombo().getValue());
								duration = (startDate - endDate) / 1000;
							}
						}
						else
						{
							durationUnit = selectedDuration.data.durationType == 'daily' ?
								'day' : (selectedDuration.data.durationType == 'intraday' ? 'sec' : 'tick');

							var durationValue = me.getDurationField().getValue();
							duration = (durationUnit == 'tick' || durationUnit == 'daily') ? durationValue : durationValue * selectedDuration.data.timeInterval;
						}

						var requestValues =
						{
							contractTypes: linq.where(me.contractMetadata.available, function (c)
							{
								return c.is_forward_starting == me.isForwardStarting() && c.expiry_type == selectedDuration.data.durationType;
							}),
							symbol: me.symbolData.symbolDetails.symbol,
							durationUnit: durationUnit,
							duration: duration,
							payoutCurrency: me.getPayoutCurrency(),
							payoutAmount: me.getPayoutAmount(),
							startTime: me.isForward ? Math.round(me.getStartTimeCombo().getValue().getTime() / 1000) : 0,
							barrierLow: 0,
							barrierHigh: 0
						};
						return requestValues;
					},
					updateUI: function()
					{
						var cm = this.contractMetadata;
						var me = this;

						me.getStartTimeCombo().setVisible(
							linq.any(cm.available, function (item) { return item.is_forward_starting == "Y"; }));

						me.getDurationField().setVisible(!me.endTimeMode);

						var durationTypeCombo = me.getDurationTypeCombo();
						durationTypeCombo.setVisible(!me.endTimeMode);

						var endDayField = me.getEndDayField();
						endDayField.setVisible(me.endTimeMode);

						var endTimeField = me.getEndTimeField();
						endTimeField.setVisible(me.endTimeMode);

						var utcNow = Date.getUtcDate();
						var utcTomorrow = utcNow.addDays(1);

						if (me.isForward)
						{
							endDayField.setMaxValue(utcTomorrow);
							endDayField.validate();
							/*
							if (endDayField.getValue().getDate() == utcNow.getDate())
							{

							}
							*/
						}
						else
						{
							endDayField.setMaxValue(Date.getUtcDate(null, 12, 31, 24));
						}

						if (endDayField.getValue() > Date.getUtcDate() && !me.isForward)
						{
							if (!endTimeField.oldValue)
							{
								endTimeField.oldValue = endTimeField.getValue();
							}
							endTimeField.setValue('11:59 PM');
							endTimeField.disable();
						}
						else
						{
							if (endTimeField.oldValue)
							{
								endTimeField.setValue(endTimeField.oldValue);
								endTimeField.oldValue = null;
							}
							endTimeField.enable();
						}

						if (!me.endTimeMode)
						{
							durationTypeCombo.store.clearFilter();
							durationTypeCombo.store.filter(
							[
								{
									filterFn: function (rec)
									{
										return linq.any(cm.available, function (cType)
										{
											return rec.data.durationType == cType.expiry_type && cType.is_forward_starting == me.isForwardStarting();
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
							}
							rec = durationTypeCombo.valueModels[0];

							var durationField = this.getDurationField();
							var contract = linq.first(cm.available, function(c)
							{
								return c.expiry_type == selectedDurationType && c.is_forward_starting == me.isForwardStarting();
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
							durationField.validate();
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
									style: 'margin-right:5px',
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
									style: 'margin-right:5px',
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
									name: 'endDay',
									listeners:
									{
										change: function ()
										{
											this.getContainer().updateUI();
										}
									}
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
												durationName: 'ticks',
												timeInterval: 1
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
							xtype: 'fieldcontainer',
							fieldLabel: 'Spot',
							layout: 'hbox',
							defaults:
							{
								flex: 1,
								height: 80,
								getContainer: function()
								{
									return this.up().getContainer();
								}
							},
							items:
							[
								{
									xtype: 'textfield',
									fieldStyle: 'font-size:20px',
									labelStyle: 'margin-top:10px',
									style: 'margin-right:5px',
									anchor: null,
									name: 'spot'
								},
								{
									xtype: 'container',
									name: 'pair0',
									cls: 'contract-container',
									html: '123',
									style: 'border: solid 1px #AAAAAA; margin-right:5px'
								},
								{
									xtype: 'container',
									name: 'pair1',
									cls: 'contract-container',
									html: '456',
									style: 'border: solid 1px #AAAAAA'
								}
							]
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
									xtype: 'numberfield',
									value: 30,
									minValue: 5,
									maxValue: 15,
									allowDecimals: true,
									hideTrigger:true,
									name: 'payoutAmount'
								}
							]
						},
						{
							xtype: 'button',
							text: 'Get Prices',
							handler: function ()
							{
								var me = this;
								var values = tabs.getActiveTab().getValues();
								values = JSON.stringify(values);
								refreshPrice(tabs, function (data)
								{
									me.up().down('[name="test"]').update(values + "<br/>" + JSON.stringify(data));
									var contractMetadata = me.getContainer().contractMetadata;
									var i = 0;
									for(var p in data.responses)
									{
										var contractPart = linq.first(contractMetadata.contractPair, function(pair)
										{
											return pair.use.indexOf(p)>-1;
										});

										me.getContainer().down('[name="pair' + i + '"]').update(String.format(
											'<img src="{0}" class="contract-image" /><div class="contract-name">{1}</div><div class="contract-description">{2}</div>',
											contractPart.img,
											contractPart.displayName,
											data.responses[p].longcode || data.responses[p].fault.faultstring));
										i++;
									};
								});
							}
						},
						{
							xtype: 'container',
							name: 'test',
							html: ''
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
						refreshPrice(this, function () { });
						this.timers.push(window.setInterval(refreshTimePickers, 5 * 60 * 1000, this));
						this.timers.push(window.setInterval(displayCurrentUTC, 1000, this));
						//this.timers.push(window.setInterval(refreshPrice, 3000, this));
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
