/// <reference path="../Scripts/Binary/Binary.Api.Client.js" />
/// <reference path="Mediator.js" />

Binary = Binary || {};
Binary.Charting = Binary.Charting || {};

Binary.Charting.ChartType =
{
	Tick:
	{
		name: 'ticks',
		chart: {},
		setPoint: function (pointData, chart)
		{
			var point = Binary.Charting.ChartType.GetCandlePoint(pointData);
			chart.series[0].addPoint([point.x, point.y], false, false, false);
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

Binary.Charting.ChartsConfigured = false;
Binary.Charting.ChartInstance = null;
Binary.Charting.ChartClass = function (symbol, chartType, timeInterval, renderTo)
{
	if (!Binary.Charting.ChartsConfigured)
	{
		Highcharts.setOptions(
		{
			lang:
			{
				loading: 'loading...',
				printChart: 'Print chart',
				downloadJPEG: 'Save as JPEG',
				downloadPNG: 'Save as PNG',
				downloadSVG: 'Save as SVG',
				downloadPDF: 'Save as PDF',
				downloadCSV: 'Save as CSV',
				rangeSelectorFrom: 'From',
				rangeSelectorTo: 'To',
				rangeSelectorZoom: 'Zoom',
				months:
				[
					'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
					'September', 'October', 'November', 'December'
				],
				shortMonths:
				[
					 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
					 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
				],
				weekdays:
				[
					 'Sunday', 'Monday', 'Tuesday', 'Wednesday',
					 'Thursday', 'Friday', 'Saturday'
				],
			},
			navigator:
			{
				series:
				{
					includeInCSVExport: false
				}
			}
		});

		Binary.Charting.ChartsConfigured = true;
	};

	this.changeSymbol = function (eventData)
	{
		me.update(eventData.symbolDetails.symbol, eventData.symbolDetails.display_name, currentChartType, currentInterval);
	};

	if (Binary.Charting.ChartInstance != null)
	{
		Binary.Mediator.un('symbolChanged', Binary.Charting.ChartInstance.changeSymbol);
	}
	Binary.Charting.ChartInstance = this;
	Binary.Mediator.on('symbolChanged', this.changeSymbol);

	var dataProcessed = false;
	var currentSymbol = symbol;
	var displayName = null;
	var currentInterval = timeInterval;
	var currentChartType = chartType;
	var renderEl = renderTo;

	this.getParams = function ()
	{
		var params =
		{
			symbol: currentSymbol,
			displayName: displayName,
			interval: currentInterval,
			chartType: currentChartType
		};
		return params;
	};
	var chart = null;
	var me = this;

	var createChart = function ()
	{
		dataProcessed = false;
		Binary.Api.Client.clearIntervals();
		if (chart != null)
		{
			chart.destroy();
		}
		var chartParams =
		{
			chart:
			{
				height: 400,
				renderTo: renderEl,
				events:
				{
					load: function ()
					{ }
				}
			},
			plotOptions:
			{
				series:
				[{
					id: 'dataseries',
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
					marker:
					{
						enabled: false//this.config.with_markers,
						//radius: 2,
					},
				}],
				candlestick:
				{
					turboThreshold: 3000
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
				text: displayName,// TODO: add real symbol name as translated_display_name()
			}
		};

		Binary.Charting.ChartType.Configure(currentChartType, displayName, chartParams);
		chart = new Highcharts.StockChart(chartParams);
		chart.showLoading();
		Binary.Api.Client.symbols(function (data)
		{
			me.processData(data);
		},
		currentSymbol,
		currentChartType,
		currentInterval);
	};

	this.update = function (symbol, display_name, chartType, timeInterval)
	{
		currentSymbol = symbol;
		displayName = display_name;
		currentChartType = chartType;
		currentInterval = timeInterval;
		createChart();
	};

	this.processData = function (chartData)
	{
		var chartSettings = Binary.Charting.ChartType.GetByName(currentChartType);
		var enumerable = chartData.candles || chartData.ticks;
		if (dataProcessed)
		{
			enumerable = [enumerable[enumerable.length - 1]];
		}
		if (chartData.candles)
		{
			for (var i in enumerable)
			{
				chartSettings.setPoint(enumerable[i], chart);
			}
		}
		else
		{
			for (var i in enumerable)
			{
				var pointData = enumerable[i];
				var tick =
				{
					epoch: parseInt(pointData.time),
					quote: parseFloat(pointData.price)
				};
				chart.series[0].addPoint([tick.epoch * 1000, tick.quote], dataProcessed, dataProcessed, false);
			}
		}
		if (!dataProcessed)
		{
			chart.hideLoading();
			chart.redraw();
		}
		dataProcessed = true;
	};

	createChart();
};