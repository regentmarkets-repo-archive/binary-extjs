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
			//if (!this.config.to || tick.epoch <= this.config.to)
			//{

			this.chart.series[0].addPoint(
                [tick.epoch * 1000, tick.quote], false, this.shift, false
            );
			this.spot = tick.quote;
		}
	}
	//} else if (point[0] == 'contract')
	//{
	//	this.process_contract(point[1]);
	//}
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
			this.spot = tick.quote;
			this.config.repaint_indicators(this);//temp
			this.chart.redraw();
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