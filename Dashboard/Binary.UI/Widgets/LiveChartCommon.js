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

LiveChart.prototype = {
	close_chart: function()
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
		//this.config.add_indicator(indicator);
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
	connect_to_stream: function ()//changed to apigee response
	{
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
						$self.get_data($self.config.symbol, $self.config.chartType);
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
					//marker: {
					//    enabled: this.config.with_markers,
					//    radius: 2,
					//},
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
			//this.repaint_indicators(this);//temp
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
			this.shift = this.config.shift == 1 ? true : false;
		}
	},
	update_interval: function (min,max)
	{
		this.chart.xAxis[0].setExtremes(
			min || minDT,
			max || new Date().getTime()
		)
	}
};
