Binary = Binary || {};
Binary.Charting = Binary.Charting || {};

Binary.Charting.ChartType =
{
	Tick:
	{
		name: 'tick',
		chart: {}
	},
	ClosingPrice:
	{
		name: 'closing',
		chart: {}
	},
	Prices:
	{
		name: 'prices',
		chart: {}
	},
	Candles: 'candles',
	Median: 'median',
	Typical: 'typical',
	Weighted: 'weighted'
};

Binary.Charting.ChartClass = function (config)
{
	var charting=Binary.Charting;
	this.config = config;
	this.candlestick = {};
	this.candlestick.period = this.config.resolution_seconds * 1000//() * 1000;
	this.shift = false;

	this.configureSeries = function (chartType, chartParams)
	{
		chart_params.series =
		[
			{
				name: this.config.symbol,
				data: [],
				id: 'primary_series',
				type: 'line'
			}
		];
		chart_params.chart.type = 'line';
		do
		{
			if (chartType == charting.ChartType.Candles)
			{
				chart_params.chart.type = 'candlestick';
				chart_params.series[0].type = 'candlestick';
				chart_params.series[0].color = 'red';
				chart_params.series[0].upColor = 'green';
				break;
			}

			if (chartType == charting.ChartType.Prices)
			{
				chart_params.chart.type = 'ohlc';
				chart_params.series[0].type = 'ohlc';
				chart_params.series[0].color = 'red';
				chart_params.series[0].upColor = 'green';
			}
		}
		while (false);
	};

	this.processData = function (point)
	{
		if (point.candles)
		{
			var setY = function (point) { };
			switch (this.config.chartType)
			{
				case 'closing':
					{
						setY = function (point, apiData)
						{
							point.y = parseFloat(apiData.close);
						};
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
			}
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
				this.chart.series[0].addPoint(ohlc_pt, false, false, false);
				this.spot = ohlc_pt.close;
			}
		}
		if (point.ticks)
		{
			for (var i in point.ticks)
			{
				var data_object = point.ticks[i];
				this.chart.series[0].addPoint(
					[
						parseInt(data_object.time) * 1000,
						parseFloat(data_object.price),
					], false, this.shift, false);
			}
		}
	}
}