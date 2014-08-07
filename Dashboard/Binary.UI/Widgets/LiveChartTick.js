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
			// for tick trade charting purposes
			if (tick.epoch > this.config.contract_start_time && ticks_array.length < this.config.how_many_ticks)
			{
				ticks_array.push(tick);
			}
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
			var tick = {
				epoch: parseInt(point.ticks[point.ticks.length - 1].time),
				quote: parseFloat(point.ticks[point.ticks.length - 1].price)
			};
			//if (!this.config.to || tick.epoch <= this.config.to)
			//{
			this.chart.series[0].addPoint(
                [tick.epoch * 1000, tick.quote], true, this.shift, false
            );
			this.spot = tick.quote;
			if (tick.epoch > this.config.contract_start_time && ticks_array.length < this.config.how_many_ticks)
			{
				ticks_array.push(tick);
			}
			//}
		}
	}
	catch (e) { };
};
LiveChartTick.prototype.get_data = function ( symbol, chartType )
{
	var me = this;
	Binary.Api.Client.symbols(function (data)
	{
		me.update_data(data);
	},
	Binary.Api.Intervals.Fast,
	symbol,
	chartType);
}