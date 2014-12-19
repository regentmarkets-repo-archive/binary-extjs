var isStorageSupported = function (storage)
{
	if (typeof storage === 'undefined')
	{
		return false;
	}

	var testKey = 'test';
	try
	{
		storage.setItem(testKey, '1');
		storage.removeItem(testKey);
		return true;
	} catch (e)
	{
		return false;
	}
};

var Store = function (storage)
{
	this.storage = storage;
};

Store.prototype = {
	get: function (key)
	{
		return this.storage.getItem(key) ? this.storage.getItem(key) : undefined;
	},
	set: function (key, value)
	{
		if (typeof value != "undefined")
		{
			this.storage.setItem(key, value);
		}
	},
	remove: function (key)
	{
		this.storage.removeItem(key);
	},
	clear: function ()
	{
		this.storage.clear();
	},
};

var SessionStore, LocalStore;
if (isStorageSupported(window.localStorage))
{
	LocalStore = new Store(window.localStorage);
}

if (isStorageSupported(window.sessionStorage))
{
	if (!LocalStore)
	{
		alert('LocalStore = new Store(window.sessionStorage);');
	}

	SessionStore = new Store(window.sessionStorage);
}

if (!SessionStore || !LocalStore)
{
	if (!LocalStore)
	{
		alert('LocalStore = new InScriptStore();');
	}

	if (!SessionStore)
	{
		alert('SessionStore = new InScriptStore();');
	}
}

var Markets = function (markets, market_symbols)
{
	this.all = [];
	var market_count = markets.length;
	while (market_count--)
	{
		var market_name = markets[market_count];
		var market_config = market_symbols[market_name];
		var market_obj = new Market(market_name, market_config['label'], market_config['submarkets']);
		this.all.push(market_obj);
	}
};

Markets.prototype = {
	each: function (callback)
	{
		var market_count = this.all.length;
		while (market_count--)
		{
			callback.call(this.all[market_count]);
		}
	},
	by_symbol: function (symbol)
	{
		var market_count = this.all.length;
		while (market_count--)
		{
			var found = this.all[market_count].by_symbol(symbol);
			if (found)
			{
				return found;
			}
		}
	},
	get: function (name)
	{
		var market_count = this.all.length;
		while (market_count--)
		{
			if (this.all[market_count].name == name)
			{
				return this.all[market_count];
			}
		}
	}
};

var Market = function (name, display_name, submarkets)
{
	this.name = name;
	this.display_name = display_name;
	this.submarkets = [];
	this.all_submarkets = [];
	var submarket_count = submarkets.length;
	while (submarket_count--)
	{
		var submarket = submarkets[submarket_count];
		var submarket_obj = new SubMarket(submarket['name'], submarket['label'], submarket['instruments']);
		this.submarkets.push(submarket_obj);
		this.all_submarkets.push(submarket_obj);
	}
};

Market.prototype = {
	translated_display_name: function ()
	{
		return text.localize(this.display_name);
	},
	by_symbol: function (symbol)
	{
		var count = this.submarkets.length;
		while (count--)
		{
			found = this.submarkets[count].by_symbol(symbol);
			if (found)
			{
				found['market'] = this;
				return found;
			}
		}
	},
	each: function (callback)
	{
		var count = this.all_submarkets.length;
		while (count--)
		{
			callback.call(this.all_submarkets[count]);
		}
	},
	get: function (name)
	{
		if (name.toUpperCase() == 'ALL')
		{
			return this.all_submarkets;
		}

		var count = this.submarkets.length;
		while (count--)
		{
			if (this.submarkets[count].name == name)
			{
				return this.submarkets[count];
			}
		}
	}
};

var SubMarket = function (name, display_name, underlyings)
{
	this.name = name;
	this.display_name = display_name;
	this.underlyings = [];
	var underlying_count = underlyings.length;
	while (underlying_count--)
	{
		var underlying = underlyings[underlying_count];
		var underlying_object = {
			name: underlying['label'],
			symbol: underlying['value'],
			translated_display_name: function () { return text.localize(this.name); }
		};
		this.underlyings.push(underlying_object);
	}
};

SubMarket.prototype = {
	translated_display_name: function ()
	{
		return text.localize(this.display_name);
	},
	each: function (callback)
	{
		var underlying_count = this.underlyings.length;
		while (underlying_count--)
		{
			callback.call(this.underlyings[underlying_count]);
		}
	},
	by_symbol: function (symbol)
	{
		var underlying_count = this.underlyings.length;
		while (underlying_count--)
		{
			if (this.underlyings[underlying_count].symbol == symbol)
			{
				return { submarket: this, underlying: this.underlyings[underlying_count] };
			}
		}

		return;
	},
};

var Contract = function (name)
{
	this.name = name || 'Unknown contract';
};

Contract.prototype = {
	type: function ()
	{
		return LocalStore.get('contract.form_name');
	},
	//prediction: function ()
	//{
	//	return $('[name=prediction]', this.form_selector()).val();
	//},
	market: function ()
	{
		return $('[name=market]').val();
	},
	submarket: function ()
	{
		return $('[name=submarket]').val();
	},
	underlying: function ()
	{
		return $('#underlying').val();
	},
	underlying_text: function ()
	{
		return $('#underlying option:selected').text();
	},
	start_time: function ()
	{
		return $('[name=start_time]').val();
	},
	start_time_moment: function ()
	{
		var start_time = this.start_time();
		var now = {};
		//var now = moment.utc(bom_gmt_time());
		if (typeof start_time !== 'undefined' && start_time !== 'now')
		{
			now = moment.utc(start_time * 1000);
		}

		return now;
	},
	barrier_1: function ()
	{
		return $('#high_barrier').val();
	},
	barrier_2: function ()
	{
		return $('#low_barrier').val();
	},
	pip_size: function ()
	{
		return $('[name=pip_size]').val();
	},
	barrier_type: function ()
	{
		var barriers = $('[name=high_barrier]', this.form_selector()).length + $('[name=low_barrier]', this.form_selector()).length;
		if (barriers > 0)
		{
			return $('[name=barrier_type]', this.form_selector()).val();
		}
		return;
	},
	duration_container: function ()
	{
		return $('#duration_container');
	},
	duration_amount: function ()
	{
		return $('#duration_amount').val();
	},
	duration_units: function ()
	{
		return $('[name=duration_units]').val();
	},
	duration_seconds: function ()
	{
		var duration = parseInt(parseFloat(this.duration_amount()));
		var duration_units = this.duration_units();

		if (duration_units == 'm')
		{
			return duration * 60;
		} else if (duration_units == 'h')
		{
			return duration * 3600;
		} else if (duration_units == 'd')
		{
			return duration * 86400;
		}

		return duration;
	},
	duration_string: function ()
	{
		return this.duration_amount() + this.duration_units();
	},
	minimum_duration_for: function (unit)
	{
		var duration_container = this.duration_container();
		var minimums = duration_container.find('.' + unit);
		if (minimums.html())
		{
			return parseInt(parseFloat(minimums.html().split(':')[1]));
		}

		return;
	},
	currency: function ()
	{
		return $('[name=currency]').val();
	},
	amount: function ()
	{
		var amount_str = $('#amount').val();
		if (amount_str)
		{
			amount_str = amount_str.replace(',', '.');
			amount_str = amount_str.replace(/[^\d\.]/g, '');
		}
		var amount_f = parseFloat(amount_str);
		var amount = 0;
		if (!isNaN(amount_f) && amount_f > 0)
		{
			// only keep the first 2 digits of the floating value, and only 2
			amount_f = Math.round(amount_f * 100) / 100;
			var amount_int = Math.floor(amount_f);
			var float_val = amount_f - amount_int;
			if (float_val)
			{
				amount = amount_f.toFixed(2);
			} else
			{
				amount = amount_int;
			}
		}
		return amount;
	},
	is_amount_payout: function ()
	{
		return ($('#amount_type').val() == "payout");
	},
	is_amount_stake: function ()
	{
		return ($('#amount_type').val() == "stake");
	},
	amount_type: function ()
	{
		return $('#amount_type').val();
	},
	//show_ohlc: function ()
	//{
	//	return ($('input[name="showohlc"]').val() == "yes");
	//},
	//extratab: function ()
	//{
	//	return ($('input[name="extratab"]', this.form_selector()).val());
	//},
	is_forward_starting: function ()
	{
		return (this.start_time() && this.start_time().match(/^\d+$/));
	},
	can_select: function (selector, value)
	{
		if ($('#' + selector + ' option[value="' + value + '"]').length > 0)
		{
			return true;
		} else
		{
			return false;
		}
	},
	model: function ()
	{
		return {
			form_name: function (form_name)
			{
				var fallback = 'risefall';
				if (form_name)
				{
					//Save
				}
				form_name = fallback;//get name from combo
				if (!$('#' + form_name).length)
				{
					form_name = fallback;
				}
				return form_name;
			},
			market: function ()
			{
				if (market)
				{
					LocalStore.set('contract.market', market);
				}
				return LocalStore.get('contract.market') || 'forex';
			},
			underlying: function (underlying)
			{
				var for_market = this.market();
				if (underlying)
				{
					for_market = markets.by_symbol(underlying).market.name;
					LocalStore.set('contract.underlying.' + for_market, underlying);
				}
				return LocalStore.get('contract.underlying.' + for_market);
			},
			submarket: function (submarket)
			{
				if (submarket)
				{
					LocalStore.set('contract.submarket', submarket);
				}
				return LocalStore.get('contract.submarket');
			},
			start_time: function (start_time)
			{
				if (start_time)
				{
					LocalStore.set('contract.start_time', start_time);
				}
				return this.get_setting_or_param('contract.start_time', 'date_start');
			},
			expiry_type: function (expiry_type)
			{
				if (expiry_type)
				{
					LocalStore.set('contract.expiry_type', expiry_type);
				}

				return LocalStore.get('contract.expiry_type') || 'duration';
			},
			time: function (time)
			{
				if (time)
				{
					LocalStore.set('contract.time', time);
				}

				return this.get_setting_or_param("contract.time", 'time');
			},
			barrier_1: function ()
			{
				return;
			},
			barrier_2: function ()
			{
				return;
			},
			amount: function (amount)
			{
				if (amount)
				{
					LocalStore.set('contract.amount', amount);
				}

				return this.get_setting_or_param("contract.amount", 'amount');
			},
			amount_type: function (amount_type)
			{
				if (amount_type)
				{
					LocalStore.set('contract.amount_type', amount_type);
				}

				return this.get_setting_or_param("contract.amount_type", 'amount_type');
			},
			currency: function (currency)
			{
				if (currency)
				{
					LocalStore.set('contract.currency', currency);
				}

				var session_currency = LocalStore.get('contract.currency');
				if (session_currency)
				{
					return session_currency;
				}
				return;
			},
			get_setting_or_param: function (setting_name, param_name)
			{
				var saved_param = LocalStore.get(setting_name);

				return saved_param;
			}
		};
	}()
}

window.priceCall = window.priceCall || {};

function init_contracts(use_comboboxes)
{
	//if (use_comboboxes)
	//{
	//}

	$(function ()
	{
		getPrice = function (contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, action, barrier_low, barrier_high, panel)
		{
			function showError(data)
			{
				var preventShow = false;
				var error_data_string = 'Unknown error';
				try
				{
					error_data_string = (data.fault.faultstring) ? data.fault.faultstring.toString() : error_data_string;
					if (data.fault.details)
					{
						var store_tmp = Ext.data.StoreMgr.lookup('contract_categories_StoreTmp');
						var from = 'Unknown source';
						var rec = store_tmp.findRecord('contract_up', contract_type);

						if (rec)
							from = rec.get('contract_up_name');
						else
						{
							rec = store_tmp.findRecord('contract_down', contract_type);
							from = rec.get('contract_down_name');
						}

						error_data_string = error_data_string.concat('</br>"' + from + '" contract error. </br> Details:');
						for (var key in data.fault.details)
						{
							error_data_string = error_data_string.concat('</br>', data.fault.details[key]);

							if (data.fault.details[key].indexOf('not offered') > 0)
							{
								panel.setLoading(false);
								panel.up('panel[title]').disable();
								preventShow = true;
							}
						}
					}
				}
				catch (ex)
				{
					error_data_string = (data.fault) ? data.fault.details[0].toString() : data.message.toString();
				}
				if (!Ext.getCmp('error_window') && !preventShow && !panel.isDisabled())
					Ext.Msg.show({
						id: 'error_window',
						title: 'Error!',
						msg: error_data_string,
						width: 400,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				//TODO: show text message near panel
				panel.disable();
				panel.setLoading(false);
			}

			if (action == "buy")
			{
				var display_payout = payout;

				Binary.Api.Client.contract(function (data)
				{
					var d = data;
					var html = "";
					//data =
					//{
					//	detail: 'contract has been purchased',
					//	transaction_id: '4254745568',
					//	longcode: 'USD 2.00 payout if Random 50 Index is strictly higher than entry spot at close on 2014-10-08.',
					//	price: '1.02'
					//};


					if (!data.fault)
					{
						Binary.Mediator.fireEvent('contractCompleted', this, data.detail, data.longcode, data.price);
						Ext.create('Ext.window.Window',
						{
							cmpCls: 'trade-confirm-window',
							width: 330,
							height: 220,
							header:
							{
								title: 'Trade Confirmation',
								frame: false,
								tools:
								[
									{
										type: 'close',
										handler: function ()
										{
											this.up('window').destroy();
										}
									}
								],
								cmpCls: 'header-trade-confirm-window'
							},
							collapsible: false,
							bodyPadding: '10px',
							layout: 'vbox',
							defaults: { height: 40 },
							items:
							[
								{
									xtype: 'label',
									listeners:
									{
										render: function () { (data.detail) ? this.setText(Ext.String.capitalize(data.detail.toString())) : this.setText('no data') }
									}
								},
								{
									height: 60,
									width: 310,
									cls: 'trade-confirm-longcode',
									items:
									[
										{
											xtype: 'label',
											name: 'confirm_longcode',
											listeners:
											{
												render: function () { (data.longcode) ? this.setText(data.longcode.toString()) : this.setText('no data') }
											}
										}
									]
								},
								{
									xtype: 'panel',
									width: 310,
									height: 60,
									cls: 'trade-panel-inner',
									layout: 'column',
									items:
									[
										{
											columnWidth: 0.35,
											items:
											[
												{
													cls: 'trade-panel-inner',
													style: 'text-align: center; font-weight: 600; padding-bottom: 10px; background-color: #f2f2f2 !important;',
													html: 'Potential payout',
												},
												{
													xtype: 'label',
													name: 'confirm_payout',
													style: 'padding-left: 36px !important; background-color: #f2f2f2 !important;',
													listeners:
													{
														afterrender: function ()
														{
															this.setText(parseFloat(display_payout).toFixed(2).toString());
														}
													}
												}
											]
										},
										{
											columnWidth: 0.3,
											items:
											[
												{
													html: '<div style="color: orange !important; font-weight: 600; padding-bottom: 10px;">Total Cost</div>',
													style: 'text-align: center; padding: 0px 10px !important; border-right: 1px solid black; border-left: 1px solid black;',
												},
												{
													xtype: 'label',
													name: 'confirm_price',
													style: 'color: orange !important; padding-left: 36px !important;',
													listeners:
													{
														afterrender: function ()
														{
															(data.price) ? this.setText(data.price.toString()) : this.setText('no data')
														}
													}
												}
											]
										},
										{
											columnWidth: 0.35,
											items:
											[
												{
													style: 'text-align: center; font-weight: 600; padding-bottom: 10px;',
													html: 'Potential profit',
												},
												{
													xtype: 'label',
													name: 'confirm_profit',
													style: 'padding-left: 36px !important;',
													listeners:
													{
														afterrender: function ()
														{
															(data.price) ? this.setText((parseFloat(display_payout) - parseFloat(data.price)).toString()) : this.setText('no data');
														}
													}
												}
											]
										}
									],
								},
								{
									html: 'You transaction reference number is',
									baseCls: 'background-color: grey !important;',
									name: 'confirm_reference',
									margin: 10,
									listeners:
									{
										beforerender: function ()
										{
											if (data.transaction_id)
												this.html = this.html + Ext.util.Format.format(' {0}', data.transaction_id.toString());
										}
									},
									cls: 'header-bold'
								},
								{
									layout:
									{
										type: 'hbox',
										pack: 'center',
										align: 'middle'
									},
									cls: 'trade-panel-inner',
									width: 310,
									items:
									[
										{
											xtype: 'button',
											name: 'confirm_button',
											text: 'VIEW',
											hidden: true,
											height: 35,
											baseCls: 'binary_submit_button',
											listeners:
											{
												click: function ()
												{
													this.setLoading();
												}
											}

										}
									]
								}
							]
						}).show();
					}
					else
					{
						showError(data);
					}
				}, contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, action, barrier_low, barrier_high);
			}
			else
			{
				if (symbol)
					Binary.Api.Client.contract(function (data)
					{
						if (!data.fault && !data.message)
						{
							var str = data.ask.toString();
							panel.query('label[name=longcode_label]')[0].setText(data.longcode.toString());
							panel.query('label[name=price_label]')[0].setText(data.ask.toString().split('.', 1));
							panel.query('label[name=price_label_upper]')[0].setText(str.substr(str.indexOf('.')));
							var net_profit_label = panel.query('label[name=net_profit]')[0];
							net_profit_label.setText('Net profit:' + (parseFloat(payout) - parseFloat(data.ask)).toString());
							var return_label = panel.query('label[name=return]')[0];
							return_label.setText('Return:' + (((parseFloat(payout) - parseFloat(data.ask)) / parseFloat(data.ask)).toFixed(2) * 100).toString() + "%");

							panel.enable();
							panel.setLoading(false);
						}
						else
						{
							showError(data);
						}
					}, contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, action, barrier_low, barrier_high)
			}
		}
	});

	function configureDuration(obj)
	{
		tab = obj.up('tabpanel').getActiveTab();
		var submit_duration_unit = tab.query('[name=duration_units]')[0].getValue();
		switch (submit_duration_unit)
		{
			case 'days':
				{
					obj.duration_unit = 'day',
					obj.duration = parseInt(tab.query('[name=duration_amount]')[0].getValue());
					break;
				}
			case 'hours':
				{
					obj.duration_unit = 'sec',
					obj.duration = parseInt(tab.query('[name=duration_amount]')[0].getValue()) * 3600;
					break;
				}
			case 'minutes':
				{
					obj.duration_unit = 'sec',
					obj.duration = parseInt(tab.query('[name=duration_amount]')[0].getValue()) * 60;
					break;
				}
			case 'seconds':
				{
					obj.duration_unit = 'sec',
					obj.duration = parseInt(tab.query('[name=duration_amount]')[0].getValue());
					break;
				}
			default:
				{
					//alert('Undefined chartType');
					break;
				}
		}
	};

	function doPurchase(obj, title, sentiment, contractType)
	{
		configureDuration(obj);
		if (title != "Rise/Fall") obj.contractType = contractType;
		var data =
		{
			contract_type: obj.contractType,
			symbol: (Ext.getCmp('ext_Symbol_market')) ? Ext.getCmp('ext_Symbol_market').getValue() : 'R_50',
			duration_unit: obj.duration_unit,
			duration: obj.duration,
			barrier_low: obj.barrier_low_offset,
			barrier_high: obj.barrier_high_offset,
			payout_currency: 'USD',
			payout: parseInt(obj.up('tabpanel').getActiveTab().query('[name=amount]')[0].getValue()),
			start_time: 0//parseInt($("#start_time").val())
		};
		getPrice(data.contract_type, data.symbol, data.duration_unit, data.duration, data.payout_currency, data.payout, data.start_time, "buy", data.barrier_low, data.barrier_high, null);
	};

	function updateContractInfo(instrument)
	{
		var tabpanel = Ext.ComponentQuery.query('[name=tradePanel_container]')[0].down('tabpanel');
		var contract_category = Ext.data.StoreMgr.lookup('contract_categories_StoreTmp').findRecord('display_name', tabpanel.getActiveTab().title).get('used_name');
		Binary.Api.Client.markets.contract_categories.contract_category(
			function (data)
			{
				var btn = Ext.ComponentQuery.query('[name=contract_buy_panel]')[0].query('button')[0];
				var records = Ext.data.StoreMgr.lookup('contract_categories_StoreTmp').findRecord('display_name', tabpanel.getActiveTab().title);
				if (tabpanel.getActiveTab().title != "Rise/Fall") var contractType = records.get('contract_up');
				else
				{
					var contractType = btn.contractType = (btn.sentiment == 'up') ? records.get('contract_up') : records.get('contract_down');
				}
				if (data[contractType].daily_durations && data[contractType].intraday_durations)
				{
					tabpanel.getActiveTab().down('[name=duration_units]').bindStore(['days', 'hours', 'minutes', 'seconds']);
					tabpanel.getActiveTab().down('[name=duration_units]').setValue('days');
					var dd_min = data[contractType].daily_durations.min;
					tabpanel.down('[name=duration_min]').setValue(dd_min);
					if (tabpanel.down('[name=duration]').getValue() < dd_min)
						tabpanel.down('[name=duration]').setValue(dd_min);
				}
				else if (data[contractType].intraday_durations)
				{
					tabpanel.getActiveTab().down('[name=duration_units]').bindStore(['hours', 'minutes', 'seconds']);
					tabpanel.getActiveTab().down('[name=duration_units]').setValue('seconds');
					var id_min = data[contractType].intraday_durations.min;
					tabpanel.down('[name=duration_min]').setValue(id_min);
					if (tabpanel.down('[name=duration]').getValue() < id_min)
						tabpanel.down('[name=duration]').setValue(id_min);
				}
			},
			Ext.ComponentQuery.query('[id=ext_Market_market]')[0].getValue(),
			contract_category,
			instrument
			)
	}
	function setTabs(store, tabpanel)
	{
		// Init the singleton.  Any tag-based quick tips will start working.
		Ext.tip.QuickTipManager.init();

		// Apply a set of config properties to the singleton
		Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
			maxWidth: 200,
			minWidth: 100,
			showDelay: 50      // Show 50ms after entering target
		});
		store.each(function (records)
		{
			var id = 'ext_tab_' + records.get('display_name');
			var inner_tab =
			{
				title: records.get('display_name'),
				items:
				[
					{
						layout: 'hbox',
						height: 400,
						items:
						[
							{
								layout: 'vbox',
								height: 400,
								items:
								[
									{
										xtype: 'timefield',
										name: 'start_time',
										fieldLabel: 'Start time:',
										labelWidth: 95,
										format: 'H:i',
										increment: 5,
										width: 190,
										margin: '5px 5px',
										hidden: true,
										handler: function (obj, date)
										{ },
										listeners:
										{
											beforerender: function ()
											{
												var now = new Date();
												this.setMinValue(new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDay(), now.getUTCHours(), now.getUTCMinutes()));
												this.setMaxValue(new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDay(), now.getUTCHours() + 4, now.getUTCMinutes()));
											},
											render: function ()
											{
												this.setRawValue('Now');
											},
											change: function (obj, oldval, newval)
											{
												if (this.getRawValue() != 'Now')
												{
													Ext.ComponentQuery.query('[name=contract_buy_panel]')[0].query('button')[0].contractType = 'INTRADU';
													Ext.ComponentQuery.query('[name=contract_buy_panel]')[1].query('button')[0].contractType = 'INTRADD';
													var duration_combo = Ext.ComponentQuery.query('[name=duration_units]')[0];
													duration_combo.bindStore(['hours', 'minutes']);
													duration_combo.setValue('hours');
												}
												else
												{
												}
											}
										}
									},
									{
										layout: 'hbox',
										defaults: { width: 90, margin: '5px 5px' },
										items: [
										{
											xtype: 'combo',
											name: 'duration',
											queryMode: 'local',
											store: ['Duration'],//, 'End time'],
											displayField: 'duration',
											autoSelect: true,
											forceSelection: true,
											value: 'Duration'
										},
										{
											xtype: 'field',
											name: 'duration_amount',
											value: '1'
										},
										{
											xtype: 'combo',
											name: 'duration_units',
											store: ['days', 'hours', 'minutes', 'seconds'],
											displayField: 'duration_units',
											autoSelect: true,
											forceSelection: true,
											value: 'days',
											listeners:
											{
												change: function (obj, val)
												{
													var tab = this.up('tabpanel').getActiveTab();
													if (val == 'days')
													{
														tab.query('[name=contract_buy_panel]')[0].query('button')[0].contractType = 'DOUBLEUP';
														tab.query('[name=contract_buy_panel]')[1].query('button')[0].contractType = 'DOUBLEDOWN';
														var me = this;
														Binary.Api.Client.markets.contract_categories.contract_category(
															function (data)
															{
																me.up().down('[name=duration_min]').setValue(data[tab.query('[name=contract_buy_panel]')[0].query('button')[0].contractType].daily_durations);
															},
															Ext.ComponentQuery.query('[id=ext_Market_market]')[0].getValue(),
															'risefall',
															Ext.ComponentQuery.query('[id=ext_Symbol_market]')[0].getValue()
														)
													}
													else
													{
														var me = this;
														if (tab.query('[name=contract_buy_panel]')[0].query('button')[0].contractType != 'FLASHU')
															var contract_category = Ext.data.StoreMgr.lookup('contract_categories_StoreTmp').findRecord('contract_up', tab.query('[name=contract_buy_panel]')[0].query('button')[0].contractType).get('used_name');
														else
															var contract_category = 'risefall';

														Binary.Api.Client.markets.contract_categories.contract_category(
															function (data)
															{
																if (contract_category != 'risefall')
																	for (var el in data)
																		if (data[el].sentiment == "up" || data[el].sentiment == "low_vol")
																		{
																			tab.query('[name=contract_buy_panel]')[0].query('button')[0].contractType = el.toString();
																		}
																		else if (data[el].sentiment == "down" || data[el].sentiment == "high_vol")
																		{
																			tab.query('[name=contract_buy_panel]')[1].query('button')[0].contractType = el.toString();
																		}

																var responseMin = data[tab.query('[name=contract_buy_panel]')[0].query('button')[0].contractType].intraday_durations.min;
																var duration_units = me.up().down('[name=duration_units]');
																var duration_min = me.up().down('[name=duration_min]');

																if (duration_units.getValue() == 'seconds')
																	duration_min.setValue(responseMin);
																if (duration_units.getValue() == 'minutes')
																{
																	if (responseMin / 60 < 1)
																		duration_min.setValue(1);
																	else
																		duration_min.setValue(responseMin / 60);
																}
																if (duration_units.getValue() == 'hours')
																{
																	if (responseMin / 3600 < 1)
																		duration_min.setValue(1);
																	else
																		duration_min.setValue(responseMin / 3600);
																}
															},
															Ext.ComponentQuery.query('[id=ext_Market_market]')[0].getValue(),
															contract_category,
															Ext.ComponentQuery.query('[id=ext_Symbol_market]')[0].getValue()
														);
														if (this.up('panel').up('panel').down('[name=start_time]').getRawValue() == 'Now' || this.up('panel').up('panel').down('[name=start_time]').isHidden())
														{
															tab.query('[name=contract_buy_panel]')[0].query('button')[0].contractType = 'FLASHU';
															tab.query('[name=contract_buy_panel]')[1].query('button')[0].contractType = 'FLASHD';
														}
													}
												}
											}
										},
										{
											xtype: 'field',
											name: 'duration_min',
											margin: '5px -5px',
											fieldLabel: 'min:',
											labelWidth: 20,
											width: 60,
											value: '1',
											disabled: true
										}]
									},
									{
										xtype: 'field',
										name: 'spot',
										fieldLabel: 'Spot:',
										labelWidth: 95,
										width: 190,
										margin: '5px 5px',
										disabled: true,
										listeners: {
											change: function ()
											{
												var s_o = this.up().down('[name=spot_offset]');
												var b_o = this.up().down('[name=barrier_offset]');
												s_o.setRawValue(Ext.util.Format.currency(parseFloat(this.getValue()) + parseFloat(b_o.getValue()), ' ', 4));
											}
										}
									},
									{
										layout: 'hbox',
										name: 'offset',
										defaults:
										{
											width: 190,
											margin: '5px 5px'
										},
										items:
										[
											{
												xtype: 'precisionNumberfield',
												fieldLabel: 'Barrier:',
												name: 'barrier_offset',
												labelWidth: 95,
												value: '0.0000',
												decimalPrecision: 4,
												step: 0.0001,
												listeners:
												{
													render: function ()
													{
														if (this.up('tabpanel').getActiveTab().title == 'Touch/No Touch')
														{
															this.setValue('13.0043');
															this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[0].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', (this.getValue() * 10000));
															this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[1].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', (this.getValue() * 10000));
														}
													},
													spin:
													{
														fn: function (obj, direction, eOpts)
														{
															var s_o = this.up().down('[name=spot_offset]');
															var spot = this.up().up().down('[name=spot]');
															s_o.setRawValue(Ext.util.Format.number(parseFloat(spot.getValue()) + parseFloat(this.getValue()), '0.0000'));
															//function setBarriers(val)
															//{
															this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[0].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', (this.getValue() * 10000));
															this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[1].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', (this.getValue() * 10000));
															//}
															//TIP - buffer alternate
															//if (direction == "up")
															//	setBarriers(1);
															//else
															//	setBarriers(-1)
														},
														buffer: 300
													}
												}
											},
										{
											xtype: 'field',
											name: 'spot_offset',
											disabled: true,
											width: 90
										}]
									},
									{
										name: 'barriers',
										defaults:
										{
											width: 190,
											margin: '5px 5px',
											decimalPrecision: 4,
											step: 0.0001
										},
										items:
										[
											{
												xtype: 'precisionNumberfield',
												fieldLabel: 'High barrier:',
												name: 'barrier_high',
												labelWidth: 95,
												value: '0.0000',
												listeners:
												{
													render: function ()
													{
														if (this.up('tabpanel').getActiveTab().title == 'In/Out')
														{
															this.setValue('0.4719');
															this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[0].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', (this.getValue() * 10000));
															this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[1].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', (this.getValue() * 10000));
														}
													},
													spin:
													{
														fn: function (obj, direction, eOpts)
														{
															this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[0].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', this.getValue() * 1000);
															this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[1].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', this.getValue() * 1000);
														},
														buffer: 300
													}
												}
											},
										{
											xtype: 'precisionNumberfield',
											fieldLabel: 'Low barrier:',
											name: 'barrier_low',
											labelWidth: 95,
											value: '0.0000',
											listeners:
											{
												render: function ()
												{
													if (this.up('tabpanel').getActiveTab().title == 'In/Out')
													{
														this.setValue('-0.4710');
														this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[0].down('button').barrier_low_offset = Ext.util.Format.format('S{0}P', (this.getValue() * 10000));
														this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[1].down('button').barrier_low_offset = Ext.util.Format.format('S{0}P', (this.getValue() * 10000));
													}
												},
												spin:
												{
													fn: function (obj, direction, eOpts)
													{
														this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[0].down('button').barrier_low_offset = Ext.util.Format.format('S{0}P', this.getValue() * 1000);
														this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[1].down('button').barrier_low_offset = Ext.util.Format.format('S{0}P', this.getValue() * 1000);
													},
													buffer: 300
												}
											}
										}]
									},
									{
										xtype: 'combo',
										name: 'last_digit_prediction',
										queryMode: 'local',
										fieldLabel: 'Last Digit Prediction:',
										labelWidth: 95,
										width: 190,
										margin: '5px 5px',
										store: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
										displayField: 'last_digit_prediction',
										autoSelect: true,
										forceSelection: true,
										value: 4,
										hidden: true,
										listeners:
											{
												render: function ()
												{
													if (this.up('tabpanel').getActiveTab().title == 'Digits')
													{
														this.setValue('4');
														this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[0].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', (this.getValue()));
														this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[1].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', (this.getValue()));
													}
												},
												change: function (obj, direction, eOpts)
												{
													this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[0].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', this.getValue());
													this.up('tabpanel').getActiveTab().query('[name=contract_buy_panel]')[1].down('button').barrier_high_offset = Ext.util.Format.format('S{0}P', this.getValue());
												}
											}
									},
									{
										layout: 'hbox',
										style: 'margin-bottom: 20px !important;',
										defaults: { width: 90, margin: '5px 5px' },
										items: [
										{
											xtype: 'combo',
											name: 'payout',
											queryMode: 'local',
											store: ['Payout'],//, 'Stake'],
											displayField: 'payout',
											autoSelect: true,
											forceSelection: true,
											value: 'Payout',
										},
										{
											xtype: 'combo',
											name: 'payout_units',
											queryMode: 'local',
											store: ['USD'],
											displayField: 'payout_units',
											autoSelect: true,
											forceSelection: true,
											value: 'USD'
										},
										{
											xtype: 'field',
											name: 'amount',
											value: '20'
										}]
									},
									{
										xtype: 'button',
										text: 'GET PRICES',
										style: 'margin-left: 10px;',
										baseCls: 'binary_submit_button',
										sendPriceCall: function (obj, interval, masked)
										{
											if (window.priceCall)
												clearInterval(window.priceCall);
											function getNewPrice(masked)
											{
												var a_tab = obj.up('tabpanel').getActiveTab();
												var up_panel = a_tab.query('[name=contract_buy_panel]')[0];
												var down_panel = a_tab.query('[name=contract_buy_panel]')[1];
												if (masked)
												{
													up_panel.setLoading(true);
													down_panel.setLoading(true);
												}
												up_panel.fireEvent('updatePrices', up_panel);
												down_panel.fireEvent('updatePrices', down_panel);
											};
											if (interval)
											{
												window.priceCall = setInterval(function () { getNewPrice(masked) }, 3000)
											}
											else
												window.priceCall = getNewPrice(masked);
										},
										listeners:
										{
											render: function ()
											{
												this.sendPriceCall(this, false, true);
											},
											afterrender: function ()
											{
												this.sendPriceCall(this, true, false);
											},
											click: function ()
											{
												var a_tab = this.up('tabpanel').getActiveTab();
												var up_panel = a_tab.query('[name=contract_buy_panel]')[0];
												var down_panel = a_tab.query('[name=contract_buy_panel]')[1];
												up_panel.setLoading(true);
												down_panel.setLoading(true);
												this.sendPriceCall(this, true, false);
											}
										}
									}
								]
							},
							{
								defaults: { margin: 5/*, height: 140 */ },
								items:
								[
									{
										xtype: 'panel',
										name: 'contract_buy_panel',
										frame: true,
										cmpCls: 'contract-panel',
										layout: 'vbox',
										bodyPadding: 5,
										items:
										[
											{
												layout: 'hbox',
												defaults: { margin: '5px 12px' },
												items:
												[
													{
														xtype: 'image',
														src: records.get('contract_up_image')
													},
													{
														xtype: 'label',
														cls: 'contract-buy-panel-title',
														text: records.get('contract_up_name')
													}
												]
											},
											{
												xtype: 'panel',
												bodyPadding: 5,
												layout: 'hbox',
												items:
												[
													{
														height: 60,
														items:
														[
															{
																layout: 'hbox',
																style: 'margin-bottom: 20px;',
																items:
																[
																	{
																		xtype: 'label',
																		width: 40,
																		cls: 'contract-buy-panel-price',
																		name: 'currency_label',
																		text: 'USD'
																	},
																	{
																		xtype: 'label',
																		cls: 'contract-buy-panel-price',
																		name: 'price_label'
																	},
																	{
																		xtype: 'label',
																		cls: 'contract-buy-panel-price-upper',
																		name: 'price_label_upper'
																	}
																]
															},
															{
																xtype: 'button',
																text: 'PURCHASE',
																sentiment: 'up',
																contractType: 'DOUBLEUP',
																duration_unit: 'day',
																barrier_high_offset: 'S0P',
																barrier_low_offset: 'S0P',
																duration: 1,
																baseCls: 'binary_submit_button',
																listeners:
																{
																	click: function (obj) { doPurchase(obj, records.get('display_name'), obj.sentiment, contractType = (obj.sentiment == 'up') ? records.get('contract_up') : records.get('contract_down')); }
																}
															}
														]
													},
													{
														xtype: 'label',
														width: 150,
														style: 'margin-left:5px; font-size:12px',
														name: 'longcode_label'
													}
												]
											}
										],
										listeners:
										{
											render: function (panel)
											{
												setTimeout(function ()
												{
													panel.setLoading(true);
												}, 500);
												var obj = panel.query('button')[0];
												configureDuration(obj);
												if (records.get('display_name') != "Rise/Fall") obj.contractType = (obj.sentiment == 'up') ? records.get('contract_up') : records.get('contract_down');
												var data =
												{
													contract_type: obj.contractType,
													symbol: (Ext.getCmp('ext_Symbol_market')) ? Ext.getCmp('ext_Symbol_market').getValue() : 'R_50',
													duration_unit: obj.duration_unit,
													duration: obj.duration,
													barrier_low: obj.barrier_low_offset,
													barrier_high: obj.barrier_high_offset,
													payout_currency: 'USD',
													payout: parseInt(panel.up('tabpanel').getActiveTab().query('[name=amount]')[0].getValue()),
													start_time: 0
												};
												getPrice(data.contract_type, data.symbol, data.duration_unit, data.duration, data.payout_currency, data.payout, data.start_time, "show", data.barrier_low, data.barrier_high, panel);
											},
											updatePrices: function (panel)
											{
												var obj = panel.query('button')[0];
												configureDuration(obj);
												if (this.up('tabpanel').getActiveTab().title != "Rise/Fall") obj.contractType = (obj.sentiment == 'up') ? records.get('contract_up') : records.get('contract_down');

												var start_time = 0;
												if (!this.up('tabpanel').getActiveTab().down('[name=start_time]').isHidden() && this.up('tabpanel').getActiveTab().down('[name=start_time]').getRawValue() != 'Now')
												{
													var now = new Date();
													var t = this.up('tabpanel').getActiveTab().down('[name=start_time]').getValue();
													start_time = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), new Date(t).getHours(), new Date(t).getMinutes()) / 1000;
												};
												var data =
												{
													contract_type: obj.contractType,
													symbol: (Ext.getCmp('ext_Symbol_market')) ? Ext.getCmp('ext_Symbol_market').getValue() : 'R_50',
													duration_unit: obj.duration_unit,
													duration: obj.duration,
													barrier_low: obj.barrier_low_offset,
													barrier_high: obj.barrier_high_offset,
													payout_currency: 'USD',
													payout: parseInt(panel.up('tabpanel').getActiveTab().query('[name=amount]')[0].getValue()),
													start_time: start_time
												};
												getPrice(data.contract_type, data.symbol, data.duration_unit, data.duration, data.payout_currency, data.payout, data.start_time, "show", data.barrier_low, data.barrier_high, panel);
											}
										},
										dockedItems:
										[
											{
												xtype: 'panel',
												height: 20,
												baseCls: 'purchase_docked_panel',
												dock: 'bottom',
												layout:
												{
													type: 'hbox',
													align: 'center',
													pack: 'center'
												},
												items:
												[
													{
														xtype: 'label',
														text: 'Net profit:',
														name: 'net_profit'
													},
													{
														xtype: 'label',
														text: '|'
													},
													{
														xtype: 'label',
														text: 'Return:',
														name: 'return'
													}
												]
											}
										]
									},
									{
										xtype: 'panel',
										name: 'contract_buy_panel',
										frame: true,
										cmpCls: 'contract-panel',
										layout: 'vbox',
										bodyPadding: 5,
										items:
										[
											{
												layout: 'hbox',
												defaults: { margin: '5px 12px' },
												items:
												[
													{
														xtype: 'image',
														src: records.get('contract_down_image')
													},
													{
														xtype: 'label',
														cls: 'contract-buy-panel-title',
														text: records.get('contract_down_name')
													}
												]
											},
											{
												xtype: 'panel',
												bodyPadding: 5,
												layout: 'hbox',
												items:
												[
													{
														height: 60,
														items:
														[
															{
																layout: 'hbox',
																style: 'margin-bottom: 20px;',
																items:
																[
																	{
																		xtype: 'label',
																		width: 40,
																		cls: 'contract-buy-panel-price',
																		name: 'currency_label',
																		text: 'USD'
																	},
																	{
																		xtype: 'label',
																		cls: 'contract-buy-panel-price',
																		name: 'price_label'
																	},
																	{
																		xtype: 'label',
																		cls: 'contract-buy-panel-price-upper',
																		name: 'price_label_upper'
																	}
																]
															},
															{
																xtype: 'button',
																text: 'PURCHASE',
																sentiment: 'down',
																contractType: 'DOUBLEDOWN',
																duration_unit: 'day',
																duration: 1,
																baseCls: 'binary_submit_button',
																listeners:
																{
																	click: function (obj) { doPurchase(obj, records.get('display_name'), obj.sentiment, contractType = (obj.sentiment == 'up') ? records.get('contract_up') : records.get('contract_down')); }
																}
															}
														]
													},
													{
														xtype: 'label',
														width: 150,
														style: 'margin-left:5px; font-size:12px',
														name: 'longcode_label'
													}
												]
											}
										],
										listeners:
										{
											render: function (panel)
											{
												setTimeout(function ()
												{
													panel.setLoading(true);
												}, 500);
												var obj = panel.query('button')[0];
												configureDuration(obj);
												if (this.up('tabpanel').getActiveTab().title != "Rise/Fall") obj.contractType = (obj.sentiment == 'up') ? records.get('contract_up') : records.get('contract_down');
												var data =
												{
													contract_type: obj.contractType,
													symbol: (Ext.getCmp('ext_Symbol_market')) ? Ext.getCmp('ext_Symbol_market').getValue() : 'R_50',
													duration_unit: obj.duration_unit,
													duration: obj.duration,
													barrier_low: obj.barrier_low_offset,
													barrier_high: obj.barrier_high_offset,
													payout_currency: 'USD',
													payout: parseInt(panel.up('tabpanel').getActiveTab().query('[name=amount]')[0].getValue()),
													start_time: 0
												};
												getPrice(data.contract_type, data.symbol, data.duration_unit, data.duration, data.payout_currency, data.payout, data.start_time, "show", data.barrier_low, data.barrier_high, panel);
											},
											updatePrices: function (panel)
											{
												var obj = panel.query('button')[0];
												configureDuration(obj);
												if (this.up('tabpanel').getActiveTab().title != "Rise/Fall") obj.contractType = (obj.sentiment == 'up') ? records.get('contract_up') : records.get('contract_down');

												var start_time = 0;
												if (!this.up('tabpanel').getActiveTab().down('[name=start_time]').isHidden() && this.up('tabpanel').getActiveTab().down('[name=start_time]').getRawValue() != 'Now')
												{
													var now = new Date();
													var t = this.up('tabpanel').getActiveTab().down('[name=start_time]').getValue();
													start_time = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), new Date(t).getHours(), new Date(t).getMinutes()) / 1000;
												};
												var data =
												{
													contract_type: obj.contractType,
													symbol: (Ext.getCmp('ext_Symbol_market')) ? Ext.getCmp('ext_Symbol_market').getValue() : 'R_50',
													duration_unit: obj.duration_unit,
													duration: obj.duration,
													barrier_low: obj.barrier_low_offset,
													barrier_high: obj.barrier_high_offset,
													payout_currency: 'USD',
													payout: parseInt(panel.up('tabpanel').getActiveTab().query('[name=amount]')[0].getValue()),
													start_time: start_time
												};
												getPrice(data.contract_type, data.symbol, data.duration_unit, data.duration, data.payout_currency, data.payout, data.start_time, "show", data.barrier_low, data.barrier_high, panel);
											}
										},
										dockedItems:
										[
											{
												xtype: 'panel',
												height: 20,
												baseCls: 'purchase_docked_panel',
												dock: 'bottom',
												layout:
												{
													type: 'hbox',
													align: 'center',
													pack: 'center'
												},
												items:
												[
													{
														xtype: 'label',
														text: 'Net profit:',
														name: 'net_profit'
													},
													{
														xtype: 'label',
														text: '|'
													},
													{
														xtype: 'label',
														text: 'Return:',
														name: 'return'
													}
												]
											}
										]
									}
								]
							}
						]
					}
				],
				listeners:
				{
					activate: function ()
					{

					}
				}
			};
			//if (records.get('display_name') != 'Asian Up/Down' || records.get('display_name') != 'Digit Match/Differ')
			tabpanel.add(inner_tab);
		});
		tabpanel.doLayout();
		Ext.tip.QuickTipManager.register({
			target: 'ext_contract_startTime',
			title: 'Rise/Fall contracts of less than 5 minutes duration are only available when you select &quot;Now&quot; as the start time.',
			width: 100,
			dismissDelay: 10000 // Hide after 10 seconds hover
		});
	};

	Ext.create('Ext.container.Container',
	{
		height: 400,
		flex: 1,
		name: 'tradePanel_container',
		renderTo: document.body,
		layout:
		{
			type: 'hbox',
			align: 'stretch',
			padding: 5
		},
		items: [
		{
			xtype: 'tabpanel',
			flex: 1,
			plain: true,
			items: [],
			cloneStore: function (originStore, newStore)
			{

				if (!newStore)
				{
					newStore = Ext.create('Ext.data.Store', {
						model: originStore.model
					});
				} else
				{
					newStore.removeAll(true);
				}

				var records = [], originRecords = originStore.getRange(), i, newRecordData;
				for (i = 0; i < originRecords.length; i++)
				{
					newRecordData = Ext.ux.clone(originRecords[i].copy().data);
					newStore.add(new newStore.model(newRecordData, newRecordData.id));
				}

				newStore.fireEvent('load', newStore);

				return newStore;
			},
			listeners: {
				tabchange: function ()
				{
					function setContractBuyImage(obj, st)
					{
						//obj.query('[name=contract_buy_panel]')[0].setLoading(true);
						//obj.query('[name=contract_buy_panel]')[1].setLoading(true);
						//obj.query('[name=contract_buy_panel]')[0].down('image').setSrc(st.findRecord('display_name', obj.title).get('contract_up_image'));
						//obj.query('[name=contract_buy_panel]')[1].down('image').setSrc(st.findRecord('display_name', obj.title).get('contract_down_image'));
						//obj.query('[name=contract_buy_panel]')[0].setLoading(false);
						//obj.query('[name=contract_buy_panel]')[1].setLoading(false);
					};
					var st = Ext.data.StoreMgr.lookup('contract_categories_StoreTmp');
					var current_tab_resord = st.findRecord('display_name', this.getActiveTab().title);
					var tab = this.getActiveTab();

					if (tab.title == "Rise/Fall")
					{
						tab.down('[name=offset]').hide();//get_form_method
						tab.down('[name=barriers]').hide();
						tab.down('[name=start_time]').show();
					};
					if (tab.title == "Higher/Lower" || tab.title == "Touch/No Touch")
					{
						tab.down('[name=barriers]').hide();//get_form_method
						setContractBuyImage(tab, st);
					};
					if (tab.title == "In/Out")
					{
						tab.down('[name=offset]').hide();//get_form_method
						setContractBuyImage(tab, st);
					};
					if (tab.title == "Asians")
					{
						tab.down('[name=offset]').hide();
						tab.down('[name=barriers]').hide();
						setContractBuyImage(tab, st);
					};
					if (tab.title == "Digits")
					{
						tab.down('[name=offset]').hide();
						tab.down('[name=barriers]').hide();
						tab.down('[name=last_digit_prediction]').show();
						setContractBuyImage(tab, st);
					};
				},
				render: function (tabpanel)
				{
					if (tabpanel.items.length == 0)
					{
						var st = Ext.create('Ext.data.Store',
						{
							id: 'contract_categories_StoreTmp',
							model: Ext.define('Market',
							{
								extend: 'Ext.data.Model',
								fields: ['display_name', 'used_name', { name: 'contract_up', type: 'auto' }, { name: 'contract_up_name', type: 'auto' }, { name: 'contract_up_image', type: 'auto' }, { name: 'contract_down', type: 'auto' }, { name: 'contract_down_name', type: 'auto' }, { name: 'contract_down_image', type: 'auto' }]
							}),
							proxy:
							{
								type: 'memory',
								reader: { type: 'array' }
							}
						});
						var images_trade_url = 'https://static.binary.com/images/pages/trade/{0}';
						var cat_names_tmp = []
						st.add([
							{
								display_name: 'Rise/Fall', used_name: 'risefall',
								contract_up: 'DOUBLEUP',/*much more contract types*/ contract_up_name: 'Rise', contract_up_image: Ext.String.format(images_trade_url, 'rise_1.png'),
								contract_down: 'DOUBLEDOWN', contract_down_name: 'Fall', contract_down_image: Ext.String.format(images_trade_url, 'fall_1.png')
							},
							{
								display_name: 'Higher/Lower', used_name: 'higherlower',
								contract_up: 'CALL', contract_up_name: 'Higher', contract_up_image: Ext.String.format(images_trade_url, 'higher_1.png'),
								contract_down: 'PUT', contract_down_name: 'Lower', contract_down_image: Ext.String.format(images_trade_url, 'lower_1.png')
							},
							{
								display_name: 'Touch/No Touch', used_name: 'touchnotouch',
								contract_up: 'NOTOUCH', contract_up_name: 'Does Not Touch', contract_up_image: 'https://static.binary.com/images/pages/trade/touch_1.png',
								contract_down: 'ONETOUCH', contract_down_name: 'Touches', contract_down_image: 'https://static.binary.com/images/pages/trade/no-touch_1.png'
							},
							//{ display_name: 'Ends Between/Outside', used_name: 'endsinout', contract_up: 'EXPIRYRANGE', contract_up_name: 'Ends Between', contract_down: 'EXPIRYMISS', contract_down_name: 'Ends Outside' },
							//{ display_name: 'Stays Between/Goes Outside', used_name: 'staysinout', contract_up: 'RANGE', contract_up_name: 'Stays Between', contract_down: 'UPORDOWN', contract_down_name: 'Goes Outside' },
							{
								display_name: 'In/Out', used_name: 'staysinout',
								//contract_up: ['RANGE', 'EXPIRYRANGE'], contract_up_name: 'Stays Between', contract_up_image: 'https://static.binary.com/images/pages/trade/stay-in-between_1.png',
								contract_up: 'RANGE', contract_up_name: 'Stays Between', contract_up_image: 'https://static.binary.com/images/pages/trade/stay-in-between_1.png',
								//contract_down: ['UPORDOWN', 'EXPIRYMISS'], contract_down_name: 'Goes Outside', contract_down_image: 'https://static.binary.com/images/pages/trade/stay-out_1.png'
								contract_down: 'UPORDOWN', contract_down_name: 'Goes Outside', contract_down_image: 'https://static.binary.com/images/pages/trade/stay-out_1.png'
							},
							{
								display_name: 'Asians', used_name: 'asian',
								contract_up: 'ASIANU', contract_up_name: 'Asian Up', contract_up_image: 'https://static.binary.com/images/pages/trade/asian-u_1.svg',
								contract_down: 'ASIAND', contract_down_name: 'Asian Down', contract_down_image: 'https://static.binary.com/images/pages/trade/asian-d_1.svg'
							},
							{
								display_name: 'Digits', used_name: 'digits',

								contract_down: 'DIGITMATCH', contract_up_name: 'Matches', contract_up_image: 'https://static.binary.com/images/pages/trade/differs_1.svg',
								contract_up: 'DIGITDIFF', contract_down_name: 'Differs', contract_down_image: 'https://static.binary.com/images/pages/trade/matches_1.svg'
							},
						]);
						setTabs(st, tabpanel);
						tabpanel.doLayout();
					}
					tabpanel.setActiveTab(0);
					if (!(Binary.Mediator.events.symbolchanged.listeners))
						Binary.Mediator.on('instrumentchanged', function ()
						{
							updateContractInfo(Ext.getCmp('ext_Symbol_market').getValue())
						});
				},
				afterrender: function (tabpanel)
				{
				},
			}
		}]
	});
}

function resetTabs()
{
	var t_panel = Ext.ComponentQuery.query('[name=tradePanel_container]')[0].items.items[0].items.items;
	for (var t in t_panel)
	{
		t_panel[t].disable();
	}
	Binary.Api.Client.markets.contract_categories(
	function (categories)
	{
		for (var category in categories)
		{
			var r = Ext.data.StoreMgr.lookup('contract_categories_StoreTmp').findRecord('used_name', category);
			if (r)
			{
				for (var t in t_panel)
				{
					if (t_panel[t].title == r.get('display_name'))
						t_panel[t].enable();
				}
			}
		}
	},
	Ext.getCmp('ext_Market_market').getValue()
	)
}