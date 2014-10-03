var LiveChart = function (config)
{
	//Required for inheritence.
	if (!config) return;

	this.config = config;
	this.shift = false;
};

window.chartCreated = false;

LiveChartConfig = function (params)
{
	params = params || {};
	this.painted = false;
	this.renderTo = params['renderTo'] || 'live_chart_div';
	this.renderHeight = params['renderHeight'] || 450;
	this.shift = typeof params['shift'] !== 'undefined' ? params['shift'] : 1;
	this.with_trades = typeof params['with_trades'] !== 'undefined' ? params['with_trades'] : 1;
	this.ticktrade_chart = typeof params['ticktrade_chart'] !== 'undefined' ? params['ticktrade_chart'] : 0;
	this.with_marker = typeof params['with_marker'] !== 'undefined' ? params['with_marker'] : 0;
	this.contract_start_time = typeof params['contract_start_time'] !== 'undefined' ? params['contract_start_time'] : 0;
	this.how_many_ticks = typeof params['how_many_ticks'] !== 'undefined' ? params['how_many_ticks'] : 0;
	this.with_tick_config = typeof params['with_tick_config'] !== 'undefined' ? params['with_tick_config'] : 0;
	this.with_entry_spot = typeof params['with_entry_spot'] !== 'undefined' ? params['with_entry_spot'] : 0;

	this.indicators = [];
	this.resolutions = {
		'tick': { seconds: 0, interval: 3600 },
		'M1': { seconds: 60, interval: 86400 },
		'M5': { seconds: 300, interval: 7 * 86400 },
		'M30': { seconds: 1800, interval: 31 * 86400 },
		'H1': { seconds: 3600, interval: 62 * 86400 },
		'H8': { seconds: 8 * 3600, interval: 183 * 86400 },
		'D': { seconds: 86400, interval: 366 * 3 * 86400 }
	};
	this.resolution = 'tick';
	this.with_markers = typeof params['with_markers'] !== 'undefined' ? params['with_markers'] : false;
};

LiveChartConfig.prototype = {
	add_indicator: function (indicator)
	{
		this.indicators.push(indicator);
	},
	remove_indicator: function (name)
	{
		var deleted_indicator;
		var indicator = this.indicators.length;
		while (indicator--)
		{
			if (this.indicators[indicator].name == name)
			{
				deleted_indicator = this.indicators[indicator];
				this.indicators.splice(indicator, 1);
			}
		}
		return deleted_indicator;
	},
	has_indicator: function (name)
	{
		var indicator = this.indicators.length;
		while (indicator--)
		{
			if (this.indicators[indicator].name == name)
			{
				return true;
			}
		}
		return false;
	},
	repaint_indicators: function (chart)
	{
		var indicator = this.indicators.length;
		while (indicator--)
		{
			this.indicators[indicator].repaint(chart);
		}
	},
	calculate_from: function (len)
	{
		var now = new Date();
		var epoch = Math.floor(now.getTime() / 1000);
		var units = { min: 60, h: 3600, d: 86400, w: 86400 * 7, m: 86400 * 31, y: 86400 * 366 };
		var res = len.match(/^([0-9]+)([hdwmy]|min)$/);

		return res ? epoch - parseInt(res[1]) * units[res[2]] : undefined;
	},
	update: function (opts)
	{
		if (opts.interval)
		{
			var from = parseInt(opts.interval.from.getTime() / 1000);
			var to = parseInt(opts.interval.to.getTime() / 1000);
			var length = to - from;
			this.resolution = this.best_resolution(from, to);
			delete opts.interval;
			this.from = from;
			this.to = to;
			delete this.live;
		}
		if (opts.live)
		{
			delete this.to;
			LocalStore.remove('live_chart.to');
			LocalStore.remove('live_chart.from');
			this.from = this.calculate_from(opts.live);
			this.live = opts.live;
			LocalStore.set('live_chart.live', opts.live);
			this.resolution = this.best_resolution(this.from, new Date().getTime() / 1000);
		}
		if (opts.symbol)
		{
			var symbol = markets.by_symbol(opts.symbol);
			if (symbol)
			{
				this.symbol = symbol.underlying;
				this.market = symbol.market;
				LocalStore.set('live_chart.symbol', symbol.symbol);
			}
		}

		if (opts.update_url)
		{
			var hash = "#";

			if (this.from && this.to)
			{
				hash += this.symbol.symbol + ":" + this.from + "-" + this.to;
			} else
			{
				hash += this.symbol.symbol + ":" + this.live;
			}

			var url = window.location.pathname + window.location.search + hash;
			page.url.update(url);
		}
		if (opts.shift)
		{
			this.shift = opts.shift;
		}
		if (opts.with_trades)
		{
			this.with_trades = opts.with_trades;
		}
		if (opts.with_markers)
		{
			this.with_markers = opts.with_markers;
		}
	},
	best_resolution: function (from, to)
	{
		var length = parseInt(to - from);
		for (var resolution in this.resolutions)
		{
			if (this.resolutions[resolution].interval >= length)
			{
				return resolution;
			}
		}
		return '1d';
	},
	resolution_seconds: function (resolution)
	{
		resolution = typeof resolution !== 'undefined' ? resolution : this.resolution;
		return this.resolutions[resolution]['seconds'];

	},
};

LiveChart.prototype = {
	close_chart: function ()
	{
		this.chart.destroy();
	},
	show_chart: function ()
	{
		this.chart = new Highcharts.StockChart(this.chart_params());
		this.chart.showLoading();
		window.CurrentChart.chart = new Highcharts.StockChart(this.chart_params());
	},
	add_indicator: function (indicator)
	{
		this.config.add_indicator(indicator);
		indicator.paint(this);
	},
	remove_indicator: function (indicator)
	{
		//var indicator = this.config.remove_indicator(name);
		//if (indicator)
		//{
		indicator.remove(this);
		//}
	},
	repaint_indicator: function (name)
	{
		if (indicator)
		{
			indicator.repaint(this);
		}
	},
	exporting_menu: function ()
	{
		var $self = this;
		var menuItems = [];

		var defaultOptions = Highcharts.getOptions();
		var defaultMenu = defaultOptions.exporting.buttons.contextButton.menuItems;
		for (var i = 0; i < defaultMenu.length; i++)
		{
			menuItems.push(defaultMenu[i]);
		}

		return menuItems;
	},
	process_contract: function (trade)
	{
	},
	chart_params: function ()
	{
		var $self = this;
		var chart_params =
		{
			chart:
			{
				height: this.config.renderHeight,
				renderTo: this.config.renderTo,
				events:
				{
					load: function ()
					{
						window.chartCreated = true;
						//if (window.chartCreated) window.chartCreated(this);
					}
				}
			},
			credits:
			{
				enabled: false
			},
			exporting:
			{
				buttons:
				{
					contextButton:
					{
						menuItems: this.exporting_menu()
					}
				},
				enabled: true
			},
			plotOptions:
			{
				series:
				{
					animation: false,
					dataGrouping:
					{
						dateTimeLabelFormats:
						{
							millisecond: ['%A, %b %e, %H:%M:%S.%L GMT', '%A, %b %e, %H:%M:%S.%L', '-%H:%M:%S.%L GMT'],
							second: ['%A, %b %e, %H:%M:%S GMT', '%A, %b %e, %H:%M:%S', '-%H:%M:%S GMT'],
							minute: ['%A, %b %e, %H:%M GMT', '%A, %b %e, %H:%M', '-%H:%M GMT'],
							hour: ['%A, %b %e, %H:%M GMT', '%A, %b %e, %H:%M', '-%H:%M GMT'],
							day: ['%A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
							week: ['Week from %A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
							month: ['%B %Y', '%B', '-%B %Y'],
							year: ['%Y', '%Y', '-%Y']
						},
						turboThreshold: 5000
					},
					marker: {
						enabled: this.config.with_markers,
						radius: 2,
					},
				},
				candlestick:
				{
					turboThreshold: 4000
				}
			},
			xAxis:
			{
				type: 'datetime',
				//min: this.config.from * 1000,
			},
			yAxis:
			{
				labels:
				{
					formatter: function () { return this.value; }
				},
				title:
				{
					text: null
				}
			},
			rangeSelector:
			{
				enabled: false,
			},
			title:
			{
				//text: this.config.symbol,// TODO: add real symbol name as translated_display_name()
			}
		};

		if (this.config.with_marker)
		{
			chart_params.plotOptions.line = { marker: { enabled: true } };
		}

		if (this.config.with_tick_config)
		{
			chart_params.chart.width = 401;
			chart_params.chart.height = 112;
			chart_params.navigator = { enabled: false };
			chart_params.scrollbar = { enabled: false };
			chart_params.title = '';
			chart_params.exporting.enabled = false;
			chart_params.exporting.enableImages = false;
		}
		if (this.config.with_tick_config)
		{

		}
		this.configure_series(chart_params);
		return chart_params;
	},
	process_message: function (message, livechart)
	{
		var data = message;
		if (data.error)
		{
			this.ev.close();
			return;
		}
		if (data.notice)
		{
			$("#" + data.notice + "_notice").show();
			return;
		}
		if (!(data[0] instanceof Array))
		{
			data = [data];
		}

		var data_length = data.length;
		for (var i = 0; i < data_length; i++)
		{
			this.process_data(data[i]);
		}

		if (data_length > 0 && this.spot)
		{
			if (this.config.chartType == "ticks" && this.config.repaint_indicators)
				this.config.repaint_indicators(this);//temp
			this.chart.redraw();
			if (!this.config.ticktrade_chart && !this.navigator_initialized)
			{
				this.navigator_initialized = true;
				var xData = this.chart.series[0].xData;
				var xDataLen = xData.length;
				if (xDataLen)
				{
					this.chart.xAxis[0].setExtremes(xData[0], xData[xDataLen - 1], true, false);
				}
			}
			this.chart.hideLoading();
			this.config.painted = true;
			this.shift = this.config.shift == 1 ? true : false;
		}
	},
	update_interval: function (min, max)
	{
		this.chart.xAxis[0].setExtremes(
			min || minDT,
			max || new Date().getTime()
		)
	}
};

window.CurrentChart = {};
createChart = function (symbol_, chartType_, granularity_)
{
	var live_chart;
	var chart_closed;
	var ticks_array = [];

	function updateLiveChart(config, data)//create new chart with data or update existing
	{
		if (live_chart)
		{
			if ((live_chart.config.chartType != config.chartType) || (live_chart.config.granularity != config.granularity) || (live_chart.config.resolution != config.resolution) || (live_chart.config.symbol != config.symbol))
			{
				live_chart.close_chart();
				live_chart = null;
				window.chartCreated = false;
			}
		};
		if (!window.chartCreated)
		{
			if (config.resolution == 'tick')
			{
				live_chart = new LiveChartTick(config);
				window.CurrentChart = live_chart;
			}
			else
			{
				live_chart = new LiveChartOHLC(config);
				window.CurrentChart = live_chart;
			};
			window.CurrentChart.chart = {};
			live_chart.show_chart();

			live_chart.process_message(data, live_chart);
		}
		else
		{
			live_chart.update_data(data, live_chart);
		}
		$("#show_spot").show();
		chart_closed = false;
	}

	var minDT = new Date();
	minDT.setUTCFullYear(minDT.getUTCFullYear - 3);
	var liveChartsFromDT, liveChartsToDT, liveChartConfig = {};

	$(function ()
	{
		updateDatesFromConfig = function (config)
		{
			live_chart.update_interval($("#min_time").val(), $("#max_time").val());
		};
	});

	$(function ()
	{
		changeResolution = function (res)
		{
			var chartToShow = live_chart;
			chartToShow.chart.showLoading();
			liveChartConfig.painted = false;
			Binary.Api.Client.unsubscribeAll();
			globalConfig.granularity = res;
			window.chartCreated = false;
			var displayChartType = globalConfig.chartType;

			if ((res != 'M10' && res != 'M30' && res != 'M60') && (globalConfig.chartType == 'ticks'))
			{
				displayChartType = 'closing';
				var requestChartType = 'candles';
			}
			else
			{
				displayChartType = globalConfig.chartType;
				if (globalConfig.chartType == 'ticks')
					var requestChartType = 'ticks';
				else var requestChartType = 'candles';
			}

			Binary.Api.Client.symbols(
				function (symbols_data)
				{
					init_live_chart(symbols_data, globalConfig.symbol, displayChartType, globalConfig.granularity);
					chartToShow.chart.hideLoading();
				},
				globalConfig.symbol,
				requestChartType,
				res);
		};
	});

	var show_chart_for_instrument = function (data, symbol, chartType, granularity) //changed
	{
		var disp_symb;
		if (symbol && chartType)
		{
			liveChartConfig.chartType = chartType;
			liveChartConfig.symbol = symbol;
			liveChartConfig.granularity = granularity;
			(liveChartConfig.chartType == 'ticks') ? liveChartConfig.resolution = 'tick' : liveChartConfig.resolution = 'ohlc';
			liveChartConfig.renderTo = 'LiveChart_container';
			liveChartConfig.renderHeight = 300;

			liveChartConfig.live = 500;

			liveChartConfig.resolution_seconds = 1000;// for ohlc only

			updateLiveChart(liveChartConfig, data);
		}
	};

	var build_market_select = function ()
	{
		$.each(Binary.Markets, function ()
		{
			if (this.name)
			{
				Ext.data.StoreManager.lookup('marketStore').add({ marketName: this.name, display_name: this.name.charAt(0).toUpperCase() + this.name.slice(1) });
			}
		});

		Binary.Api.Client.offerings(function (offerings_data)
		{
			var dat = offerings_data.offerings;
			var submarket_array = [];
			//$.each(dat, function (records) selectors.contract_category = {...}
			//{
			//	var m_store = Ext.data.StoreManager.lookup('marketStore');
			//	for (var item in dat[records])
			//		if (item == 'market')
			//		{
			//			var ext_submarket_renderTo = dat[records].market;
			//			for (var str_item in dat[records].available)
			//			{
			//				submarket_array.push({ name: dat[records].available[str_item].submarket, symbols: [] });
			//				var symbols_array = dat[records].available[str_item].available;
			//				for (var symbol_item in symbols_array)
			//				{
			//					symbols_array.push({ name: symbols_array[symbol_item].symbol, contract_categories: [] });
			//					var contract_category_array = symbols_array[symbol_item].available;
			//					for (var contract_category_item in contract_category_array)
			//					{
			//						Ext.data.StoreManager.lookup('offeringsStore').add({ market: dat[records].market, submarket: dat[records].available[str_item].submarket, symbol: symbols_array[symbol_item].symbol, contract_category: contract_category_array[contract_category_item].contract_category, });
			//						contract_category_array.push({ name: contract_category_array[contract_category_item].contract_category, details: contract_category_array[contract_category_item].available });
			//					}
			//				}
			//			};
			//			//alert('ext_submarket_div_' + ext_submarket_renderTo);
			//			//var add_cmp = Ext.create('Ext.form.field.ComboBox', {
			//			//	//xtype: 'combo',
			//			//	//id: 'ext_submarket',
			//			//	padding: 50,
			//			//	//renderTo: id,
			//			//	valueField: 'name',
			//			//	displayField: 'name',
			//			//	emptyText: 'Select submarket',
			//			//	store: ),
			//			//	//fields: ['name'],
			//			//	//data: [{ 'name': 'a' }],//submarket_array,
			//			//	queryMode: 'local',
			//			//	labelWidth: 70,
			//			//	//padding: 5,
			//			//	editable: false,
			//			//	listeners:
			//			//	{
			//			//	}
			//			//});

			//			//Ext.getCmp('ext_tab_Forex').add(add_cmp);
			//			//Ext.getCmp('ext_tab_Forex').doLayout();

			//			//$.each(Binary.Markets, function (obj)
			//			//{
			//			//	var cmp = '';
			//			//	(records.raw.market == "Randoms") ? cmp = 'random' : cmp = records.raw.market;
			//			//	if (records.raw.market.toLowerCase() == Binary.Markets[obj].name)
			//			//	{
			//			//		Binary.Markets[obj].submarket_array = submarket_array;
			//			//	}
			//			//});
			//		};
			//});
			//var response = offerings_data.offerings;

		});
		function configureDuration(obj)
		{
			var submit_duration_unit = Ext.ComponentQuery.query('[name=duration_units]')[0].getValue();
			switch (submit_duration_unit)
			{
				case 'days':
					{
						obj.duration_unit = 'day',
						obj.duration = parseInt(Ext.ComponentQuery.query('[name=duration_amount]')[0].getValue());
						break;
					}
				case 'hours':
					{
						obj.duration_unit = 'sec',
						obj.duration = parseInt(Ext.ComponentQuery.query('[name=duration_amount]')[0].getValue()) * 3600;
						break;
					}
				case 'minutes':
					{
						obj.duration_unit = 'sec',
						obj.duration = parseInt(Ext.ComponentQuery.query('[name=duration_amount]')[0].getValue()) * 60;
						break;
					}
				case 'seconds':
					{
						obj.duration_unit = 'sec',
						obj.duration = parseInt(Ext.ComponentQuery.query('[name=duration_amount]')[0].getValue());
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
				payout_currency: 'USD',
				payout: parseInt(Ext.ComponentQuery.query('[name=amount]')[0].getValue()),
				start_time: 0//parseInt($("#start_time").val())
			};
			getPrice(data.contract_type, data.symbol, data.duration_unit, data.duration, data.payout_currency, data.payout, data.start_time, "buy");
		};

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
							items:
							[
								{
									layout: 'vbox',
									items:
									[
										{
											xtype: 'timefield',
											name: 'start_time',
											fieldLabel: 'Start time:',
											labelWidth: 85,
											minValue: new Date().getHours().toString() + ':' + new Date().getMinutes().toString(),
											format: 'H:i',
											increment: 5,
											width: 160,
											margin: '5px 5px',
											hidden: true,
											handler: function (obj, date)
											{ },
											listeners:
											{
												render: function ()
												{
													this.setRawValue('Now');
												},
												change: function (obj, val)
												{
													if (this.getRawValue() != 'Now')
													{
														Ext.ComponentQuery.query('[name=contract_buy_panel]')[0].query('button')[0].contractType = 'INTRADU';
														Ext.ComponentQuery.query('[name=contract_buy_panel]')[1].query('button')[0].contractType = 'INTRADD';
													}
													else
													{

													}
												}
											}
										},
										{
											layout: 'hbox',
											defaults: { width: 70, margin: '5px 5px' },
											items: [
											{
												xtype: 'combo',
												name: 'duration',
												width: 80,
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
												queryMode: 'local',
												store: ['days', 'hours', 'minutes', 'seconds'],
												displayField: 'duration_units',
												autoSelect: true,
												forceSelection: true,
												value: 'days',
												listeners:
												{
													change: function (obj, val)
													{
														if (val == 'days')
														{
															Ext.ComponentQuery.query('[name=contract_buy_panel]')[0].query('button')[0].contractType = 'DOUBLEUP';
															Ext.ComponentQuery.query('[name=contract_buy_panel]')[1].query('button')[0].contractType = 'DOUBLEDOWN';
														}
														else
														{
															Ext.ComponentQuery.query('[name=contract_buy_panel]')[0].query('button')[0].contractType = 'FLASHU';
															Ext.ComponentQuery.query('[name=contract_buy_panel]')[1].query('button')[0].contractType = 'FLASHD';
														}
													}
												}
											}]
										},
										{
											xtype: 'field',
											name: 'spot',
											fieldLabel: 'Spot:',
											labelWidth: 85,
											width: 160,
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
											defaults: {
												width: 160,
												margin: '5px 5px'
											},
											items: [
											{
												xtype: 'precisionNumberfield',
												fieldLabel: 'Barrier:',
												name: 'barrier_offset',
												labelWidth: 85,
												value: '0.0000',
												decimalPrecision: 4,
												step: 0.0001,
												listeners: {
													change: function ()
													{
														var s_o = this.up().down('[name=spot_offset]');
														var spot = this.up().up().down('[name=spot]');
														s_o.setRawValue(Ext.util.Format.currency(parseFloat(spot.getValue()) + parseFloat(this.getValue()), ' ', 4));
													}
												}
											},
											{
												xtype: 'field',
												name: 'spot_offset',
												width: 70,
												disabled: true
											}]
										},
										{
											name: 'barriers',
											defaults: {
												width: 160,
												margin: '5px 5px',
												decimalPrecision: 4,
												step: 0.0001
											},
											items: [
											{
												xtype: 'precisionNumberfield',
												fieldLabel: 'High barrier:',
												name: 'barrier_high',
												labelWidth: 85,
												value: '0.0000'
											},
											{
												xtype: 'precisionNumberfield',
												fieldLabel: 'Low barrier:',
												name: 'barrier_low',
												labelWidth: 85,
												value: '0.0000'
											}]
										},
										{
											xtype: 'combo',
											name: 'last_digit_prediction',
											queryMode: 'local',
											fieldLabel: 'Last Digit Prediction:',
											labelWidth: 85,
											width: 160,
											margin: '5px 5px',
											store: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
											displayField: 'last_digit_prediction',
											autoSelect: true,
											forceSelection: true,
											value: 4,
											hidden: true
										},
										{
											layout: 'hbox',
											style: 'margin-bottom: 20px !important;',
											defaults: { width: 70, margin: '5px 5px' },
											items: [
											{
												xtype: 'combo',
												name: 'payout',
												queryMode: 'local',
												width: 80,
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
												value: '2'
											}]
										},
										{
											xtype: 'button',
											text: 'GET PRICES',
											style: 'margin-left: 10px;',
											baseCls: 'binary_submit_button',
											handler: function ()
											{
												Ext.ComponentQuery.query('[name=contract_buy_panel]')[0].setLoading(true);
												Ext.ComponentQuery.query('[name=contract_buy_panel]')[1].setLoading(true);
												Ext.ComponentQuery.query('[name=contract_buy_panel]')[0].fireEvent('render', Ext.ComponentQuery.query('[name=contract_buy_panel]')[0]);
												Ext.ComponentQuery.query('[name=contract_buy_panel]')[1].fireEvent('render', Ext.ComponentQuery.query('[name=contract_buy_panel]')[1]);
											}
										}
									]
								},
								{
									layout: 'vbox',
									defaults: { margin: 5 },
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
															height: 90,
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
																			width: 20,
																			name: 'price_label'
																		},
																		{
																			xtype: 'label',
																			cls: 'contract-buy-panel-price-upper',
																			width: 20,
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
															style: 'margin-left:5px;',
															name: 'longcode_label'
														}
													]
												}
											],
											listeners:
											{
												render: function (panel)
												{
													var obj = panel.query('button')[0];
													configureDuration(obj);
													if (records.get('display_name') != "Rise/Fall") obj.contractType = (obj.sentiment == 'up') ? records.get('contract_up') : records.get('contract_down');
													var data =
													{
														contract_type: obj.contractType,
														symbol: (Ext.getCmp('ext_Symbol_market')) ? Ext.getCmp('ext_Symbol_market').getValue() : 'R_50',
														duration_unit: obj.duration_unit,
														duration: obj.duration,
														payout_currency: 'USD',
														payout: parseInt(Ext.ComponentQuery.query('[name=amount]')[0].getValue()),
														start_time: 0//parseInt($("#start_time").val())
													};
													getPrice(data.contract_type, data.symbol, data.duration_unit, data.duration, data.payout_currency, data.payout, data.start_time, "show", panel);
												}
											},
											dockedItems:
											[
												{
													xtype: 'panel',
													height: 10,
													baseCls: 'purchase_docked_panel',
													dock: 'bottom'
												}
											],
											flex: 2
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
															height: 90,
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
																			width: 20,
																			name: 'price_label'
																		},
																		{
																			xtype: 'label',
																			cls: 'contract-buy-panel-price-upper',
																			width: 20,
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
															style: 'margin-left:5px;',
															name: 'longcode_label'
														}
													]
												}
											],
											listeners:
												{
													render: function (panel)
													{
														var obj = panel.query('button')[0];
														configureDuration(obj);
														var data =
														{
															contract_type: obj.contractType,
															symbol: (Ext.getCmp('ext_Symbol_market')) ? Ext.getCmp('ext_Symbol_market').getValue() : 'R_50',
															duration_unit: obj.duration_unit,
															duration: obj.duration,
															payout_currency: 'USD',
															payout: parseInt(Ext.ComponentQuery.query('[name=amount]')[0].getValue()),
															start_time: 0//parseInt($("#start_time").val())
														};
														getPrice(data.contract_type, data.symbol, data.duration_unit, data.duration, data.payout_currency, data.payout, data.start_time, "show", panel);
													}
												},
											dockedItems:
											[
												{
													xtype: 'panel',
													height: 10,
													baseCls: 'purchase_docked_panel',
													dock: 'bottom'
												}
											],
											flex: 2
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
							//debugger;
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
									contract_up: ['RANGE', 'EXPIRYRANGE'], contract_up_name: 'Stays Between', contract_up_image: 'https://static.binary.com/images/pages/trade/stay-in-between_1.png',
									contract_down: ['UPORDOWN', 'EXPIRYMISS'], contract_down_name: 'Goes Outside', contract_down_image: 'https://static.binary.com/images/pages/trade/stay-out_1.png'
								},
								{
									display_name: 'Asians', used_name: 'asians',
									contract_up: 'ASIANU', contract_up_name: 'Asian Up', contract_up_image: 'https://static.binary.com/images/pages/trade/asian-u_1.svg',
									contract_down: 'ASIAND', contract_down_name: 'Asian Down', contract_down_image: 'https://static.binary.com/images/pages/trade/asian-d_1.svg'
								},
								{
									display_name: 'Digits', used_name: 'digits',

									contract_down: 'DIGITMATCH', contract_up_name: 'Matches', contract_up_image: 'https://static.binary.com/images/pages/trade/differs_1.svg',
									contract_up: 'DIGITDIFF', contract_down_name: 'Differs', contract_down_image: 'https://static.binary.com/images/pages/trade/matches_1.svg'
								},
							]);
							//st.each(records, function (name, index, recordsItSelf)
							//{
							//	debugger;
							//});
							setTabs(st, tabpanel);
							tabpanel.doLayout();
						}
						tabpanel.setActiveTab(0);
					},
					afterrender: function (tabpanel)
					{
						//if (tabpanel.items.length != 0)
						//	for (var it in tabpanel.items.items)
						//	{
						//		if (tabpanel.items.items[it].title == 'Rise/Fall')
						//			tabpanel.items.items[it].tab.activate();
						//	}
					},
				}
			}]
		});

		Ext.create('Ext.form.field.ComboBox',
		{
			id: 'ext_Market_market',
			renderTo: 'ext_Market_div',
			value: 'random',
			valueField: 'marketName',
			displayField: 'display_name',
			emptyText: 'Select market',
			store: 'marketStore',
			queryMode: 'local',
			labelWidth: 70,
			padding: 5,
			editable: false,
			listeners:
			{
				afterrender: function ()
				{
					build_instrument_select();
				},
				change: function ()
				{
					build_instrument_select();
					build_contractCategory_select();
				}
			}
		});
	};
	function updateInstrument(value)
	{

		var chartToShow = live_chart;
		try { chartToShow.chart.showLoading(); } catch (e) { };
		liveChartConfig.painted = false;
		window.chartCreated = false;
		var displayChartType = globalConfig.chartType;

		if ((globalConfig.granularity != 'M10' && globalConfig.granularity != 'M30' && globalConfig.granularity != 'M60') && (globalConfig.chartType == 'ticks'))
		{
			displayChartType = 'closing';
			var requestChartType = 'candles';
		}
		else
		{
			displayChartType = globalConfig.chartType;
			if (globalConfig.chartType == 'ticks')
				var requestChartType = 'ticks';
			else var requestChartType = 'candles';
		}

		globalConfig.symbol = value;
		Binary.Api.Client.unsubscribeAll();
		Binary.Api.Client.symbols(function (symbols_data)
		{
			chartToShow.chart.hideLoading();
			init_live_chart(symbols_data, globalConfig.symbol, displayChartType, globalConfig.granularity);
		},
		globalConfig.symbol,
		requestChartType,
		globalConfig.granularity);
	}

	var build_instrument_select = function ()
	{
		Ext.data.StoreManager.lookup('symbolStore').removeAll();
		var instrumentExtCombo = Ext.getCmp('ext_Symbol_market');
		if (!instrumentExtCombo)
		{
			Ext.create('Ext.form.field.ComboBox',
				{
					id: 'ext_Symbol_market',
					renderTo: 'ext_Symbol_div',
					value: 'R_50',
					displayField: 'display_name',
					valueField: 'symbol',
					emptyText: 'Select symbol',
					store: 'symbolStore',
					queryMode: 'local',
					labelWidth: 70,
					padding: 5,
					editable: false,
					listeners:
					{
						change: function ()
						{
							updateInstrument(this.getValue());
						}
					}
				});
			Ext.getCmp('ext_Symbol_market').setLoading();
		}
		else
		{
			instrumentExtCombo.clearValue();
			instrumentExtCombo.setLoading();
		}

		if (Binary.Markets)
		{
			for (var i in Binary.Markets)
			{
				if (Binary.Markets[i].name == Ext.getCmp('ext_Market_market').getValue())
					//get symbols using API
					Binary.Api.Client.markets.market(function (data)
					{
						if (data.symbols && data.symbols.length > 0)
						{
							Binary.Markets[i].symbols = [];
							for (var j in data.symbols)
							{
								Binary.Markets[i].symbols.push(data.symbols[j]);
							}
							$.each(Binary.Markets[i].symbols, function ()
							{
								if (this.symbol)
									Ext.data.StoreManager.lookup('symbolStore').add({ symbol: this.symbol, display_name: this.display_name });
							});
							Ext.getCmp('ext_Symbol_market').setLoading(false);
						}
					},
					Binary.Markets[i].name);
			};
		}
	};

	var build_contractCategory_select = function ()
	{
		var contractCategory_select = $("#contractCategory_select");
		//var market = Binary.Markets['random'];//get($('#market_select').val());
		$("#contractCategory_spant").hide();
		if (Binary.Markets)
		{
			$("#contractCategory_select option").remove();
			contractCategory_select.append("<option class='deleteme'></option>");
			$.each(Binary.Markets["0"].contract_categories, function (index, value)
			{
				//TODO: fix index to be a string value
				if (this)
					$.each(this, function ()
					{
						contractCategory_select.append("<option value='" + index + "'>" + index + ": " + this + "</option>");
					});
			});
			$("#contractCategory_span").show();
			$("#contractCategory_select").change(function ()
			{
				//globalConfig.symbol = $("#instrument_select").val();
				//Binary.Api.Client.symbols(function (symbols_data)
				//{
				//	init_live_chart(symbols_data, globalConfig.symbol, globalConfig.chartType);
				//},
				//Binary.Api.Intervals.Once,
				//globalConfig.symbol,
				//globalConfig.chartType);
			});
		}
	};
	function updateChartType(value)
	{
		var chartToShow = live_chart;
		var needHideLoading = true;
		try { chartToShow.chart.showLoading(); } catch (e) { };
		liveChartConfig.painted = false;
		window.chartCreated = false;

		var usedChartType = 'ticks';
		globalConfig.chartType = value;
		if (globalConfig.chartType != 'ticks' && globalConfig.chartType)
			usedChartType = 'candles';

		var displayChartType = globalConfig.chartType;

		if ((globalConfig.granularity != 'M10' && globalConfig.granularity != 'M30' && globalConfig.granularity != 'M60') && (globalConfig.chartType == 'ticks'))
		{
			displayChartType = 'closing';
			var usedChartType = 'candles';
		}
		else
		{
			displayChartType = globalConfig.chartType;
			if (globalConfig.chartType == 'ticks')
				var usedChartType = 'ticks';
			else var usedChartType = 'candles';
		}

		Binary.Api.Client.unsubscribeAll();
		Binary.Api.Client.symbols(function (symbols_data)
		{
			if (needHideLoading) chartToShow.chart.hideLoading();
			needHideLoading = false;
			init_live_chart(symbols_data, globalConfig.symbol, globalConfig.chartType, globalConfig.granularity);

		},
		globalConfig.symbol,
		usedChartType,
		globalConfig.granularity);
	}

	var build_chartType_select = function ()
	{
		var usedChartType = 'ticks';
		Ext.create('Ext.form.field.ComboBox',
		{
			id: 'ext_ChartType_market',
			renderTo: 'ext_ChartType_div',
			emptyText: 'Select type',
			value: 'ticks',
			displayField: 'chartType_name',
			valueField: 'chartType_abb',
			queryMode: 'local',
			labelWidth: 70,
			padding: 5,
			editable: false,
			disabled: true,
			chartToShow: {},
			store:
			{
				fields: ['chartType_name', 'chartType_abb'],
				data:
				[
					 { chartType_name: 'Ticks', chartType_abb: 'ticks' },
					 { chartType_name: 'Candles', chartType_abb: 'candles' },
					 { chartType_name: 'Prices', chartType_abb: 'prices' },
					 { chartType_name: 'Closing price', chartType_abb: 'closing' },
					 { chartType_name: 'Median price', chartType_abb: 'median' },
					 { chartType_name: 'Weighted price', chartType_abb: 'weighted' },
					 { chartType_name: 'Typical price', chartType_abb: 'typical' }
				]
			},
			listeners:
			{
				change: function (combo)
				{
					updateChartType(combo.getValue());
				}
			}
		});
	};

	var init_live_chart = function (data, symbol, chartType, granularity) //changed
	{

		liveChartConfig = new LiveChartConfig({
			//renderTo: 'live_chart_div',
		});
		configure_livechart();
		show_chart_for_instrument(data, symbol, chartType, granularity);
		//updateDatesFromConfig(liveChartConfig);
		//var barrier = new LiveChartIndicator.Barrier({ name: "spot", value: "+0" });
		//live_chart.add_indicator(barrier);
		//setInterval(function ()
		//{
		//    live_chart.remove_indicator(barrier)
		//}, 5000);  
		$("#high_barrier").change(function ()
		{
			var val = $(this).val();
			if (liveChartConfig.has_indicator('high') || !val)
			{
				//live_chart.remove_indicator('high');
			}
			if (val)
			{
				var barrier = new LiveChartIndicator.Barrier({ name: "high", value: val, color: 'green' });
				live_chart.add_indicator(barrier);
			}
		});
		$("#low_barrier").change(function ()
		{
			var val = $(this).val();
			if (liveChartConfig.has_indicator('low') || !val)
			{
				//live_chart.remove_indicator('low');
			}
			if (val)
			{
				var barrier = new LiveChartIndicator.Barrier({ name: "low", value: val, color: 'red' });
				live_chart.add_indicator(barrier);
			}
		});

		var barrier = new LiveChartIndicator.Barrier({ name: "spot", value: "+0" });
		var init = false;
		if (!init)
			$("#show_spot").on('click', function (e)
			{
				init = true;
				e.preventDefault();
				live_chart.add_indicator(barrier);
			});
	};

	var globalConfig = {};
	globalConfig.symbol = symbol_;
	globalConfig.chartType = chartType_;
	globalConfig.granularity = granularity_;
	globalConfig.resolutions = {
		'tick': { seconds: 0, interval: 3600 },
		'M1': { seconds: 60, interval: 86400 },
		'M5': { seconds: 300, interval: 7 * 86400 },
		'M30': { seconds: 1800, interval: 31 * 86400 },
		'H1': { seconds: 3600, interval: 62 * 86400 },
		'H8': { seconds: 8 * 3600, interval: 183 * 86400 },
		'D': { seconds: 86400, interval: 366 * 3 * 86400 }
	};

	$("#show_spot").hide();

	Binary.Api.Client.account.statement(function (statement_data)
	{

	});
	Ext.onReady(function ()
	{
		Binary.Api.Client.symbols(function (symbols_data)
		{
			init_live_chart(symbols_data, globalConfig.symbol, globalConfig.chartType, globalConfig.granularity);
			if (!Ext.getCmp('ext_ChartType_market'))
				build_chartType_select();
			//if (Ext.getCmp('ext_ChartType_market'))
			//{
			Ext.getCmp('ext_ChartType_market').enable();
			Ext.getCmp('ext_ChartType_market').chartToShow = live_chart;
			//}
		},
		globalConfig.symbol,
		globalConfig.chartType,
		'M10');
	});

	Binary.Markets = Binary.Markets || {};

	Binary.Api.Client.markets(function (data_)
	{
		for (var k in data_.markets)
		{
			if (data_.markets[k] != 'prototype' && data_.markets[k] != 'futures')
			{
				Binary.Markets[k] = {};
				Binary.Markets[k].name = data_.markets[k];
				Binary.Markets[k].symbols = [];
				Binary.Markets[k].contract_categories = [];
			}
		}
		build_market_select();
	});
}
//Charts (OHLC)
function LiveChartOHLC(params)
{
	LiveChart.call(this, params);
	this.candlestick = {};
	this.candlestick.period = this.config.resolution_seconds * 1000//() * 1000;
}

LiveChartOHLC.prototype = new LiveChart();
LiveChartOHLC.prototype.constructor = LiveChartOHLC;

LiveChartOHLC.prototype.configure_series = function (chart_params)
{
	switch (this.config.chartType)
	{
		case 'closing':
			{
				chart_params.chart.type = 'line';
				chart_params.series =
				[
					{
						name: this.config.symbol,
						data: [],
						id: 'primary_series',
						type: 'line',
					}
				];
				break;
			}
		case 'prices':
			{
				chart_params.chart.type = 'ohlc';
				chart_params.series = [{
					name: this.config.symbol,
					data: [],
					color: 'red',
					upColor: 'green',
					id: 'primary_series',
					type: 'ohlc',
				}];
				break;
			}
		case 'candles':
			{
				chart_params.chart.type = 'candlestick';
				chart_params.series = [{
					name: this.config.symbol,
					data: [],
					color: 'red',
					upColor: 'green',
					id: 'primary_series',
					type: 'candlestick',
				}];
				break;
			}
		case 'median':
			{
				chart_params.chart.type = 'line';
				chart_params.series = [{
					name: this.config.symbol,
					data: [],
					id: 'primary_series',
					type: 'line',
				}];
				break;
			}
		case 'typical':
			{
				chart_params.chart.type = 'line';
				chart_params.series = [{
					name: this.config.symbol,
					data: [],
					id: 'primary_series',
					type: 'line',
				}];
				break;
			}
		case 'weighted':
			{
				chart_params.chart.type = 'line';
				chart_params.series = [{
					name: this.config.symbol,
					data: [],
					id: 'primary_series',
					type: 'line',
				}];
				break;
			}
		default:
			{
				alert('Undefined chartType');
				break;
			}
	}
};

LiveChartOHLC.prototype.process_data = function (point)
{
	if (point.candles)
	{
		this.process_ohlc(point.candles);
	} else if (point.ticks)
	{
		if (this.accept_ticks && (!this.config.to || point[0] < this.config.to))
		{
			this.process_tick(point);
		}
	}
};

LiveChartOHLC.prototype.process_ohlc = function (ohlc)
{
	for (var i in ohlc)
	{
		var data_object = ohlc[i];
		var epoch = parseInt(data_object.time);

		var ohlc_pt = {
			x: epoch * 1000,
			open: parseFloat(data_object.open),
			y: parseFloat(data_object.open),
			high: parseFloat(data_object.high),
			low: parseFloat(data_object.low),
			close: parseFloat(data_object.close)
		};
		switch (this.config.chartType)
		{
			case 'closing':
				{
					ohlc_pt.y = parseFloat(data_object.close);
					break;
				}
			case 'median':
				{
					ohlc_pt.y = (parseFloat(data_object.high) + parseFloat(data_object.low)) / 2;
					break;
				}
			case 'typical':
				{
					ohlc_pt.y = (parseFloat(data_object.high) + parseFloat(data_object.low) + parseFloat(data_object.close)) / 3;
					break;
				}
			case 'weighted':
				{
					ohlc_pt.y = (parseFloat(data_object.high) + parseFloat(data_object.low) + parseFloat(data_object.close) * 2) / 4;
					break;
				}
			default:
				{
					if (this.config.chartType != 'prices' && this.config.chartType != 'candles')
						alert('Undefined chartType');
					break;
				}
		}
		this.chart.series[0].addPoint(ohlc_pt, false, false, false);
		this.spot = ohlc_pt.close;
		this.accept_ticks = true;
	}
};

LiveChartOHLC.prototype.process_tick = function (tickInput)
{
	var tick = {
		epoch: parseInt(tickInput[0]) * 1000,
		quote: parseFloat(tickInput[1]),
		squote: tickInput[1]
	};
	this.spot = tick.quote;
	if (this.chart.series)
	{
		Rollbar.error("this.chart.series is not initialized");
		return;
	}

	var data = this.chart.series[0].options.data;
	if (data.length > 0 && data[data.length - 1].x > (tick.epoch - this.candlestick.period))
	{
		var last_ohlc = data[data.length - 1];
		if (tick.quote != last_ohlc.close)
		{
			last_ohlc.close = tick.quote;
			if (last_ohlc.low > tick.quote)
				last_ohlc.low = tick.quote;
			if (last_ohlc.high < tick.quote)
				last_ohlc.high = tick.quote;

			this.chart.series[0].isDirty = true;
			this.chart.series[0].isDirtyData = true;
		}
	} else
	{
		/* add new Candlestick */
		var ohlc = {
			x: tick.epoch,
			open: tick.quote,
			y: tick.quote,
			high: tick.quote,
			low: tick.quote,
			close: tick.quote
		};
		this.chart.series[0].addPoint(ohlc, false, false, false);
	}
};

LiveChartOHLC.prototype.update_data = function (ohlc)
{
	try
	{
		if (ohlc.candles)
		{
			var data_object = ohlc.candles[ohlc.candles.length - 1];
			var epoch = parseInt(data_object.time);
			var ohlc_pt = {
				x: epoch * 1000,
				open: parseFloat(data_object.open),
				y: parseFloat(data_object.open),
				high: parseFloat(data_object.high),
				low: parseFloat(data_object.low),
				close: parseFloat(data_object.close)
			};
			switch (this.config.chartType)
			{
				case 'closing':
					{
						ohlc_pt.y = parseFloat(data_object.close);
						break;
					}
				case 'median':
					{
						ohlc_pt.y = (parseFloat(data_object.high) + parseFloat(data_object.low)) / 2;
						break;
					}
				case 'typical':
					{
						ohlc_pt.y = (parseFloat(data_object.high) + parseFloat(data_object.low) + parseFloat(data_object.close)) / 3;
						break;
					}
				case 'weighted':
					{
						ohlc_pt.y = (parseFloat(data_object.high) + parseFloat(data_object.low) + parseFloat(data_object.close) * 2) / 4;
						break;
					}
				default:
					{
						if (this.config.chartType != 'prices' && this.config.chartType != 'candles')
							alert('Undefined chartType');
						break;
					}
			};
			if (this.config.chartType == 'closing')
			{
				delete ohlc_pt.open;
				delete ohlc_pt.close;
				delete ohlc_pt.high;
				delete ohlc_pt.close;
			}
			this.chart.series[0].addPoint(ohlc_pt, true, false, false);
			this.spot = ohlc_pt.close;
			this.accept_ticks = true;
		}
	}
	catch (e) { };
};

LiveChartOHLC.prototype.get_data = function (symbol, chartType)
{
	var ChartOHLC = this;
	Binary.Api.Client.symbols(function (data)
	{
		ChartOHLC.update_data(data);
	},
	Binary.Api.Intervals.Fast,
	symbol,
	'candles');
}
//Charts (tick)
function LiveChartTick(params)
{
	LiveChart.call(this, params);
}

LiveChartTick.prototype = new LiveChart();

LiveChartTick.prototype.constructor = LiveChartTick;
LiveChartTick.prototype.configure_series = function (chart_params)
{
	chart_params.chart.type = 'line';
	if (this.config.with_tick_config)
	{
		chart_params.xAxis.labels = { enabled: false };
	} else
	{
		chart_params.xAxis.labels = { format: "{value:%H:%M:%S}" };
	}
	chart_params.series = [
	{
		name: this.config.symbol,// TODO: add real symbol name as translated_display_name()
		data: [],
		dataGrouping:
		{
			enabled: false
		},
		id: 'primary_series',
		tooltip:
		{
			xDateFormat: "%A, %b %e, %H:%M:%S GMT"
		},
		type: 'line'
	}];
};

LiveChartTick.prototype.process_data = function (point)
{
	if (point.ticks)
	{
		for (var i in point.ticks)
		{
			var data_object = point.ticks[i];
			var tick =
			{
				epoch: parseInt(data_object.time),
				quote: parseFloat(data_object.price)
			};
			this.chart.series[0].addPoint(
                [tick.epoch * 1000, tick.quote], false, this.shift, false
            );
			this.spot = tick.quote;
			var tradePanel = Ext.ComponentQuery.query('[name=tradePanel_container]')[0];
			if (tradePanel)
			{
				var spot_fields = tradePanel.query('[name=spot]');
				if (spot_fields.length > 0)
					for (var sp in spot_fields)
						spot_fields[sp].setValue(this.spot);
			}
		}
	}
};
LiveChartTick.prototype.update_data = function (point)
{
	try
	{
		if (point.ticks)
		{
			var tick =
			{
				epoch: parseInt(point.ticks[point.ticks.length - 1].time),
				quote: parseFloat(point.ticks[point.ticks.length - 1].price)
			};
			//if (!this.config.to || tick.epoch <= this.config.to)
			//{
			this.chart.series[0].addPoint(
                [tick.epoch * 1000, tick.quote], true, this.shift, false
            );

			this.config.repaint_indicators(this);//temp
			this.chart.redraw();

			var spot_fields = Ext.ComponentQuery.query('[name=tradePanel_container]')[0].query('[name=spot]');
			for (var sp in spot_fields)
			{
				var spot_field = spot_fields[sp];

				spot_field.setValue(this.spot);

				if (this.spot > tick.quote)
				{
					spot_field.inputEl.addCls('red_field');
					spot_field.inputEl.removeCls('blue_field');
				}
				else
				{
					spot_field.inputEl.addCls('blue_field');
					spot_field.inputEl.removeCls('red_field');
				}

				this.spot = tick.quote;
				spot_field.setValue(this.spot);
			}
		}
	}
	catch (e) { };
};
LiveChartTick.prototype.get_data = function (symbol, chartType, granularity)
{
	var me = this;
	var res = this.config.resolutions[granularity].interval;
	Binary.Api.Client.symbols(function (data)
	{
		me.update_data(data);
	},
	Binary.Api.Intervals.Fast,
	symbol,
	'ticks',
	Math.round(+new Date() / 1000) - res,
	Math.round(+new Date() / 1000),
	20000);
}

$(function ()
{
	getPrice = function (contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, action, panel)
	{
		function showError(data)
		{
			var error_data_string = 'Unknown error';
			try
			{
				error_data_string = (data.fault.faultstring) ? data.fault.faultstring.toString() : error_data_string
			}
			catch (ex)
			{
				error_data_string = (data.fault) ? data.fault.details[0].toString() : data.message.toString();
			}

			if (!Ext.getCmp('error_window'))
				Ext.Msg.show({
					id: 'error_window',
					title: 'Error!',
					msg: error_data_string,
					width: 400,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
		}

		if (action == "buy")
		{
			Binary.Api.Client.contract(function (data)
			{
				var d = data;
				var html = "";
				if (!data.fault)
				{
					for (var item in data)
					{
						var data_str = "<p>" + item.toString() + ":" + data[item].toString() + "</p>";
						html = html.concat(data_str);
					};
					Ext.create('Ext.window.Window', { items: [{ width: 400, height: 350, html: html }] }).show();
				}
				else
				{
					showError(data);
				}
			}, contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, action);
		}
		else
		{
			Binary.Api.Client.contract(function (data)
			{
				if (!data.fault && !data.message)
				{
					var str = data.ask.toString();
					panel.query('label[name=longcode_label]')[0].setText(data.longcode.toString());
					panel.query('label[name=price_label]')[0].setText(data.ask.toString().split('.', 1));
					panel.query('label[name=price_label_upper]')[0].setText(str.substr(str.indexOf('.')));
					panel.setLoading(false);
				}
				else
				{
					showError(data);
				}
			}, contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, action);
		}
	}
});