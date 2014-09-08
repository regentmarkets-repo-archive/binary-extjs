var LiveChart = function (config)
{
	//Required for inheritence.
	if (!config) return;

	this.config = config;
	this.shift = false;
	//if (!config.trade_visualization)
	//{
	//    this.on_duration_change();
	//    this.highlight_duration();
	//}
};

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
						turboThreshold: 3000
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
				text: this.config.symbol,// TODO: add real symbol name as translated_display_name()
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

window.CurrentChart =
createChart = function (symbol_, chartType_, granularity_)
{
	var live_chart;
	var chart_closed;
	var ticks_array = [];

	function updateLiveChart(config, data)//create new chart with data or update existing
	{
		if (live_chart)
		{
			//if (!chart_closed)
			//{
			live_chart.close_chart();
			//}
			live_chart = null;

		}
		if (!config.painted)
		{
			if (config.resolution == 'tick')
			{
				window.CurrentChart = live_chart = new LiveChartTick(config);
			}
			else
			{
				window.CurrentChart = live_chart = new LiveChartOHLC(config);
			}
			live_chart.show_chart();

			live_chart.process_message(data, live_chart);
		}
		else live_chart.process_message(data, live_chart);

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
			liveChartConfig.painted = false;
			Binary.Api.Client.unsubscribeAll();
			globalConfig.granularity = res;
			window.chartCreated = false;
			Binary.Api.Client.symbols(
				function (symbols_data)
				{
					if (window.chartCreated)
					{
						var data = symbols_data;
						var chart = window.CurrentChart;
						
						if (!(data[0] instanceof Array))
						{
							data = [data];
						}

						var data_length = data.length;
						for (var i = 0; i < data_length; i++)
						{
							chart.process_data(data[i]);
						}

						if (data_length > 0 && chart.spot)
						{
							if (chart.config.chartType == "ticks" && chart.config.repaint_indicators)
								chart.config.repaint_indicators(chart);//temp
							chart.chart.redraw();
							if (!chart.config.ticktrade_chart && !chart.navigator_initialized)
							{
								chart.navigator_initialized = true;
								var xData = chart.chart.series[0].xData;
								var xDataLen = xData.length;
								if (xDataLen)
								{
									chart.chart.xAxis[0].setExtremes(xData[0], xData[xDataLen - 1], true, false);
								}
							}
							chart.chart.hideLoading();
							chart.config.painted = true;
							chart.shift = chart.config.shift == 1 ? true : false;
						}
					}
					else
					{
						init_live_chart(symbols_data, globalConfig.symbol, globalConfig.chartType, globalConfig.granularity);
						window.chartCreated = true;
					}
				},
				globalConfig.symbol,
				globalConfig.chartType,
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
			liveChartConfig.renderTo = 'container';
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
		Ext.create('Ext.form.field.ComboBox',
		{
			id: 'ext_Market_market',
			renderTo: 'ext_Market_div',
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
				change: function ()
				{
					build_instrument_select();
					build_contractCategory_select();
				}
			}
		});
	};

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
							globalConfig.symbol = this.getValue();
							Binary.Api.Client.unsubscribeAll();
							Binary.Api.Client.symbols(function (symbols_data)
							{
								init_live_chart(symbols_data, globalConfig.symbol, globalConfig.chartType, globalConfig.granularity);
							},
							globalConfig.symbol,
							globalConfig.chartType,
							globalConfig.granularity);
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

	var build_chartType_select = function ()
	{
		var usedChartType = 'ticks';
		Ext.create('Ext.form.field.ComboBox',
		{
			id: 'ext_ChartType_market',
			renderTo: 'ext_ChartType_div',
			emptyText: 'Select type',
			displayField: 'chartType_name',
			valueField: 'chartType_abb',
			queryMode: 'local',
			labelWidth: 70,
			padding: 5,
			editable: false,
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
					var usedChartType = 'ticks';
					globalConfig.chartType = combo.getValue();
					if (globalConfig.chartType != 'ticks' && globalConfig.chartType)
						usedChartType = 'candles';
					Binary.Api.Client.unsubscribeAll();
					Binary.Api.Client.symbols(function (symbols_data)
					{
						init_live_chart(symbols_data, globalConfig.symbol, globalConfig.chartType, globalConfig.granularity);
					},
					globalConfig.symbol,
					usedChartType,
					globalConfig.granularity);
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
	Binary.Api.Client.symbols(function (symbols_data)
	{
		init_live_chart(symbols_data, globalConfig.symbol, globalConfig.chartType, globalConfig.granularity);
	},
	globalConfig.symbol,
	globalConfig.chartType,
	'M30');

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
		build_chartType_select();
	});
}
