Binary = Binary || {};
Binary.Charting = Binary.Charting || {};

Binary.Charting.ChartType =
{
	Tick:
	{
		name: 'tick',
		chart: {},
		setPoint: function ()
		{
			var point = Binary.Charting.ChartType.GetCandlePoint(pointData);
			this.chart.series[0].addPoint([point.x, point.y], false, false, false);
		}
	},
	ClosingPrice:
	{
		name: 'closing',
		chart: {},
		setPoint: function (pointData, chart)
		{
			var point = Binary.Charting.ChartType.GetCandlePoint(pointData);
			point.y = point.close;
			chart.series[0].addPoint(point, false, false, false);
		}
	},
	Prices:
	{
		name: 'prices',
		chart:
		{
			type: 'ohlc',
			series:
			[
				{
					type: 'ohlc',
					color: 'red',
					upColor: 'green'
				}
			],
		},
		setPoint: function (pointData, chart)
		{
			var point = Binary.Charting.ChartType.GetCandlePoint(pointData);
			chart.series[0].addPoint(point, false, false, false);
		}
	},
	Candles:
	{
		name: 'candles',
		chart:
		{
			type: 'candlestick',
			series:
			[
				{
					type: 'candlestick',
					color: 'red',
					upColor: 'green'
				}
			]
		},
		setPoint: function (pointData, chart)
		{
			var point = Binary.Charting.ChartType.GetCandlePoint(pointData);
			chart.series[0].addPoint(point, false, false, false);
		}
	},
	Median:
	{
		name: 'median',
		chart: {},
		setPoint: function (pointData, chart)
		{
			var point = Binary.Charting.ChartType.GetCandlePoint(pointData);
			point.y = (point.high + point.low) / 2;
			chart.series[0].addPoint(point, false, false, false);
		}
	},
	Typical:
	{
		name: 'typical',
		chart: {},
		setPoint: function (pointData, chart)
		{
			var point = Binary.Charting.ChartType.GetCandlePoint(pointData);
			point.y = (point.high + point.low + point.close) / 3;
			chart.series[0].addPoint(point, false, false, false);
		}
	},
	Weighted:
	{
		name: 'weighted',
		chart: {},
		setPoint: function (pointData, chart)
		{
			var point = Binary.Charting.ChartType.GetCandlePoint(pointData);
			point.y = (point.high + point.low + point.close*2) / 4;
			chart.series[0].addPoint(point, false, false, false);
		}
	},
	GetCandlePoint: function(pointData)
	{
		var point =
		{
			x: parseInt(pointData.time) * 1000,
			open: parseFloat(pointData.open),
			y: parseFloat(pointData.open),
			high: parseFloat(pointData.high),
			low: parseFloat(pointData.low),
			close: parseFloat(pointData.close)
		};
		return point;
	},
	Configure: function(chartTypeName, title, chartParams)
	{
		chartParams.chart.type = 'line';
		chartParams.series =
		[
			{
				name: title,
				data: [],
				//id: 'primary_series',
				type: 'line'
			}
		];
		var chart = this.GetByName(chartTypeName);
		if (chart.type)
		{
			chartParams.chart.type = chart.type;
			if (chart.series)
			{
				chartParams.series = [];
				for (var i = 0; i < chart.series.length; i++)
				{
					var serie = chart.series[i];
					serie.name = title;
					serie.data = [];
					chartParams.series.push(chart.series[i]);
				}
			}
		}
	},
	GetByName: function (chartTypeName)
	{
		for (var p in Binary.Charting.ChartType)
		{
			if (Binary.Charting.ChartType[p].name == chartTypeName)
			{
				return Binary.Charting.ChartType[p];
			}
		}
	}
};

Binary.Charting.ChartClass = function (config)
{
	var charting=Binary.Charting;
	this.config = config;
	this.candlestick = {};
	this.candlestick.period = this.config.resolution_seconds * 1000//() * 1000;
	this.shift = false;

	this.configureSeries = function (chartTypeName, chartParams)
	{
		Binary.Charting.ChartType.Configure(chartTypeName, this.config.symbol, chartParams);
	};

	this.processData = function (chartTypeName, chartData, chart)
	{
		var chartSettings = Binary.Charting.ChartType.GetByName(chartTypeName);
		var pointData = chartData.candles || chartData.ticks;
		for (var i in pointData)
		{
			chartSettings.setPoint(pointData[i], chart);
		}
	}
}