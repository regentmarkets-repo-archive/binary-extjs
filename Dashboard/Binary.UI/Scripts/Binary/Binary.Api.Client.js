/// <reference path="Binary.Core.js" />
/// <reference path="Binary.Api.Proxy.js" />

ns("Binary.Api");

Binary.Api.Proxy = new Binary.Api.DashboardProxy();

Binary.Api.ClientClass = function (autoStart)
{
	var me = this;
	if (!Binary.isDefined(autoStart)) autoStart = true;
	var postMsg = function (apiMethod, callback, isCached, data)
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
		Binary.Api.Proxy.apiCall(message, callback);
	};

	this.markets = function (callback)
	{
		postMsg("/markets", callback);
	};

	this.markets.market = function (callback, market)
	{
		postMsg("/markets/" + market, callback);
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
	this.addInterval = function (data)
	{
		if (this.Intervals[data.apiMethod])
		{
			window.clearInterval(this.Intervals[data.apiMethod].timerID);
			delete this.Intervals[data.apiMethod];
		}
		this.Intervals[data.apiMethod] = data;
		data.timerID = window.setInterval(function () { data.intervalCallback(data) }, 3000);
	};
	this.symbols = function (callback, symbol, chartType, granularity)
	{
		//if ((granularity) && (granularity != 'M10' && granularity != 'M30')) chartType = 'candles';
		var shortInterval = (granularity.indexOf('M') > -1);
		var cType = shortInterval ? chartType : Binary.Api.GranularityConfig[granularity].chartType;
		var url = String.format("/symbols/{0}/{1}", symbol, cType);
		var data =
		{
			apiMethod: url,
			granularity: Binary.Api.GranularityConfig[granularity].timeframe || granularity,
			callback: callback,
			og: granularity,
			chartType: cType,
			intervalCallback: function (params)
			{
				var callData = {};
				var cfg = Binary.Api.GranularityConfig[params.og];// Binary.Api.getConfigForTimeFrame(params.granularity);
				callData.start = Math.floor(+new Date / 1000) - cfg.seconds;
				if (params.chartType == 'candles' )
				{
					callData.count = 4000;
					callData.granularity = params.granularity;//Binary.Api.getTimeframeForGranularity(params.granularity);
				}				
				postMsg(params.apiMethod, params.callback, false, callData);
			}
		};
		this.addInterval(data);
	};

	this.symbols.price = function (callback, symbol)
	{
		postMsg(String.format("/symbols/{0}/price", symbol), callback, false);
	};

	this.offerings = function (callback, interval, market, submarket, symbol, contract_category, contract_type, is_forward_starting, is_path_dependent, expiry_type, payout_time)
	{
		postMsg("/offerings", callback, false, { market: market, submarket: submarket, symbol: symbol, contract_category: contract_category, contract_type: contract_type, is_forward_starting: is_forward_starting, is_path_dependent: is_path_dependent, expiry_type: expiry_type, payout_time: payout_time });
	};

	this.payout_currencies = function (callback)
	{
		postMsg("/payout_currencies", callback);
	};

	this.contract = function (callback, contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, callType, barrier_low, barrier_high)
	{
		var CallType = callType || "info";
		postMsg(String.format("/contract/{0}/{1}/{2}/{3}/{4}/{5}/{6}", contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time), callback, false, { callType: CallType });
	};

	this.account = function (callback)
	{
		postMsg("/account", callback);
	};

	this.account.statement = function (callback)
	{
		postMsg("/account/statement", callback);
	};

	this.unsubscribeAll = function ()
	{
		for(var p in this.Intervals)
		{
			window.clearInterval(this.Intervals[p].timerID);
			delete this.Intervals[p];
		}
		Binary.Api.Proxy.unsubscribeAll();
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


