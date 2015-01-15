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
						color: 'red',
						upColor: 'green',
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
					color: 'red',
					upColor: 'green',
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
					color: 'red',
					upColor: 'green',
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
					color: 'red',
					upColor: 'green',
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
					ohlc_pt.y = (parseFloat(data_object.high) + parseFloat(data_object.low) + parseFloat(data_object.close)*2) / 4;
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