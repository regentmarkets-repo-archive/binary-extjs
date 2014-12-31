/// <reference path="../Scripts/Binary/Binary.Api.Client.js" />
/// <reference path="Mediator.js" />

Binary = Binary || {};
Binary.Charting = Binary.Charting || {};

Binary.Charting.ChartType =
{
	Tick:
	{
		name: 'ticks',
		displayName: 'Ticks',
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
		displayName: 'Closing price',
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
		displayName: 'Prices',
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
		displayName: 'Candles',
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
		displayName: 'Median price',
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
		displayName: 'Typical price',
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
		displayName: 'Weighted price',
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
		if (chart.chart.type)
		{
			var ccs = chart.chart;
			chartParams.chart.type = ccs.type;
			if (ccs.series)
			{
				chartParams.series = [];
				for (var i = 0; i < ccs.series.length; i++)
				{
					var serie = ccs.series[i];
					serie.name = title;
					serie.data = [];
					chartParams.series.push(serie);
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

	var me = this;
	var chartTypeSelector = null;
	var chartTimeIntervalSelector = null;
	var chartTypeStore=	Ext.create('Ext.data.Store',
	{
		fields: ['name', 'displayName']
	});
	for (var p in Binary.Charting.ChartType)
	{
		if (Binary.Charting.ChartType[p].name)
		{
			chartTypeStore.add(
			{
				name: Binary.Charting.ChartType[p].name,
				displayName: Binary.Charting.ChartType[p].displayName
			});
		}
	};
	var chartTimeIntervalStore = Ext.create('Ext.data.Store',
	{
		fields: ['name', 'displayName']
	});
	for (var p in Binary.Api.Granularities)
	{
		if (Binary.Api.Granularities[p].name)
		{
			chartTimeIntervalStore.add(
			{
				name: Binary.Api.Granularities[p].name,
				displayName: Binary.Api.Granularities[p].displayName
			});
		}
	}

	Ext.fly(document.getElementById(renderTo)).update('<div id="chartSettings_' + renderTo + '"></div><br/><div id="chart_' + renderTo + '"></div>');
	var chartContainer = new Ext.container.Container(
	{
		renderTo: 'chartSettings_' + renderTo,
		width: '100%',
		layout: 'column',
		bodyStyle: 'margin: 3px 3px 3px 3px',
		defaults:
		{
			columnWidth: 1 / 2
		},
		listeners:
		{
			afterrender: function ()
			{
				var val = chartType || chartTypeStore.getAt(0).get(chartTypeSelector.valueField);
				chartTypeSelector.setValue(val);
			}
		},
		items:
		[
			chartTypeSelector = Ext.create('Ext.form.field.ComboBox',
			{
				valueField: 'name',
				displayField: 'displayName',
				store: chartTypeStore,
				queryMode: 'local',
				editable: false,
				value: chartType,
				listeners:
				{
					change: function (combo, value)
					{
						me.update(currentSymbol, displayName, value, currentInterval);
						Binary.Mediator.fireEvent('chartChanged', 
						{
							chartType: value,
							timeInterval: chartTimeIntervalSelector.getValue()
						});
					}
				}
			}),
			chartTimeIntervalSelector = Ext.create('Ext.form.field.ComboBox',
			{
				valueField: 'name',
				displayField: 'displayName',
				store: chartTimeIntervalStore,
				editable: false,
				queryMode: 'local',
				value: timeInterval,
				listeners:
				{
					change: function (combo, value)
					{
						me.update(currentSymbol, displayName, currentChartType, value);
						Binary.Mediator.fireEvent('chartChanged',
						{
							chartType: chartTypeSelector.getValue(),
							timeInterval: value
						});
					}
				}
			})
		]
	});

	this.changeSymbol = function (eventData)
	{
		Binary.Api.Client.clearIntervals();
		me.update(eventData.symbolDetails.symbol, eventData.symbolDetails.displayName, currentChartType, currentInterval);
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
				renderTo: 'chart_' + renderTo,
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
		if (enumerable && enumerable.length > 0)
		{
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
		}

		if (chartData.code)
		{
			chart.showLoading("Chart data is not available. Please try again later");
			Binary.Api.Client.clearIntervals();
		}
	};

	createChart();
};