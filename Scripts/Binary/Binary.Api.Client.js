/// <reference path="Binary.Core.js" />
/// <reference path="Binary.Api.Proxy.js" />

ns("Binary.Api");

Binary.Api.Proxy = new Binary.Api.DashboardProxy();

Binary.Api.ClientClass = function (autoStart)
{
	var me = this;
	if (!Binary.isDefined(autoStart)) autoStart = true;
	var postMsg = function (apiMethod, callback, isCached, data, eventData)
	{
		if (data)
		{
			apiMethod += "?";
			for (var p in data)
			{
				if (data[p])
				{
					apiMethod += String.format("{0}={1}&", p, data[p]);
				}
			}
		}

		var message =
		{
			apiMethod: apiMethod,
			cached: isCached,
			widgetID: Binary.Gadget.id
		};
		Binary.Api.Proxy.apiCall(message, callback, eventData);
	};

	this.markets = function (callback)
	{
		postMsg("/markets", callback, true);
	};

	this.markets.market = function (callback, market, eventData)
	{
		postMsg("/markets/" + market, callback, true, null, eventData);
	};

	this.markets.contract_categories = function (callback, market)
	{
		postMsg(String.format("/markets/{0}/contract_categories", market), callback);
	};

	this.markets.contract_categories.contract_category = function (callback, market, contract_category, symbol)
	{
		postMsg(String.format("/markets/{0}/contract_category/{1}/symbol/{2}", market, contract_category, symbol), callback);
	};

	this.symbolsFor = function (callback, symbol, chartType, start, end, count)
	{

	};

	this.Intervals = {};
	this.addInterval = function (data, timeInterval)
	{
		if (this.Intervals[data.apiMethod])
		{
			window.clearInterval(this.Intervals[data.apiMethod].timerID);
			delete this.Intervals[data.apiMethod];
		}
		this.Intervals[data.apiMethod] = data;
		data.timerID = window.setInterval(function () { data.intervalCallback(data) }, timeInterval * 1000);
		data.intervalCallback(data)
	};
	this.symbols = function (callback, symbol, chartType, granularity)
	{
		var callType = 'candles';
		var candleSize = 'M1';
		if (chartType == 'ticks')
		{
			callType = Binary.Api.Granularities[granularity].callType;
		}
		var url = String.format("/symbols/{0}/{1}", symbol, callType);
		
		var data =
		{
			apiMethod: url,
			candleSize: candleSize,
			granularity: Binary.Api.Granularities[granularity],
			callback: callback,
			intervalCallback: function (params)
			{
				var callData = {};
				callData.start = Math.floor(+new Date / 1000) - params.granularity.seconds;
				callData.granularity = params.candleSize;
				callData.count = 4000;
				/*
				if (params.chartType == 'candles' )
				{
					callData.count = 4000;
				}*/
				postMsg(params.apiMethod, params.callback, false, callData);
			}
		};
		this.addInterval(data, 3);
	};

	this.symbols.price = function (callback, symbol)
	{
		postMsg(String.format("/symbols/{0}/price", symbol), callback, false);
	};

	this.portfolio = function (callback, contractId, eventData)
	{
		var url = '/portfolio/';
		if (contractId)
		{
			url += contractId;
		}
		postMsg(url, callback, false, {}, eventData);
	};

	this.offerings = function (callback, market, submarket, symbol, contract_category, contract_type, is_forward_starting, is_path_dependent, expiry_type, payout_time)
	{
		var rd = {};
		if (market) rd.market = market;
		if (submarket) rd.submarket = submarket;
		if (symbol) rd.symbol = symbol;

		postMsg("/offerings", callback, true, rd, rd);
	};

	this.payout_currencies = function (callback)
	{
		postMsg("/payout_currencies", callback, true);
	};

	this.contract = function (callback, contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, callType, barrier_low, barrier_high)
	{
		var CallType = callType || "info";
		if (!barrier_low) barrier_low = 'S0P';
		if (!barrier_high) barrier_high = 'S0P';
		postMsg(String.format("/contract/{0}/{1}/{2}/{3}/{4}/{5}/{6}/{7}/{8}", contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, barrier_low, barrier_high), callback, false, { callType: CallType });

		//var CallType = callType || "info";
		//if (!barrier_low) barrier_low = 'S0P';
		//if (!barrier_high) barrier_high = 'S0P';

		//var url = String.format("/contract/{0}/{1}/{2}/{3}/{4}/{5}/{6}/{7}/{8}", contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, barrier_low, barrier_high);
		//var data =
		//{
		//	apiMethod: url,
		//	callback: callback,
		//	intervalCallback: function (params)
		//	{
		//		postMsg(params.apiMethod, params.callback, false, { callType: CallType });
		//	}
		//};
		//this.addInterval(data);
	};

	this.account = function (callback)
	{
		postMsg("/account", callback);
	};

	this.account.statement = function (callback)
	{
		postMsg("/account/statement", callback);
	};

	/*
	this.unsubscribeAll = function ()
	{
		this.clearIntervals();
		Binary.Api.Proxy.unsubscribeAll();
	};
	*/

	this.clearIntervals = function ()
	{
		Binary.Api.Proxy.unsubscribeAll();
		for (var p in this.Intervals)
		{
			window.clearInterval(this.Intervals[p].timerID);
			delete this.Intervals[p];
		};
	};

	this.stop = function ()
	{
		Binary.Api.Proxy.stop();
	};

	if (autoStart)
	{
		Binary.Api.Proxy.start();
	}
};

Binary.Api.Client = new window.Binary.Api.ClientClass();


