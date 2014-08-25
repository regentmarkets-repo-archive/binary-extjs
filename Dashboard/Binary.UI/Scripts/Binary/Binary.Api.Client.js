/// <reference path="Binary.Core.js" />
/// <reference path="Binary.Api.Proxy.js" />

ns("Binary.Api");

Binary.Api.Proxy = new Binary.Api.DashboardProxy();

Binary.Api.ClientClass = function (autoStart)
{
	var me = this;
	if (!Binary.isDefined(autoStart)) autoStart = true;
	var postMsg = function (apiMethod, callback, interval, data)
	{
		Binary.Api.Proxy.apiCall(apiMethod, callback, interval, data);
	};

	this.markets = function (callback, interval)
	{
		postMsg("/markets", callback, interval);
	};

	this.markets.market = function (callback, interval, market)
	{
		postMsg("/markets/" + market, callback, interval);
	};

	this.markets.contract_categories = function (callback, interval, market)
	{
		postMsg(String.format("/markets/{0}/contract_categories", market), callback, interval);
	};

	this.markets.contract_categories.contract_category = function (callback, interval, market, contract_category, symbol)
	{
		postMsg(String.format("/markets/{0}/contract_category/{1}/symbol/{2}", market, contract_category, symbol), callback, interval);
	};

	this.symbols = function (callback, interval, symbol, chartType, start, end, count, granularity)
	{
		var url = "/symbols";
		if (symbol)
		{
			url += "/{0}";
		}
		if (chartType)
		{
			url += "/{1}";
		}
		postMsg(String.format(url, symbol, chartType), callback, interval, { start: start, end: end, granularity: granularity, count: count });
	};

	this.symbols.price = function (callback, interval, symbol)
	{
		postMsg(String.format("/symbols/{0}/price", symbol), callback, interval);
	};

	this.offerings = function (callback, interval, market, submarket, symbol, contract_category, contract_type, is_forward_starting, is_path_dependent, expiry_type, payout_time)
	{
		postMsg("/offerings", callback, interval, { market: market, submarket: submarket, symbol: symbol, contract_category: contract_category, contract_type: contract_type, is_forward_starting: is_forward_starting, is_path_dependent: is_path_dependent, expiry_type: expiry_type, payout_time: payout_time });
	};

	this.payout_currencies = function (callback)
	{
		postMsg("/payout_currencies", callback);
	};

	this.contract = function (callback, contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, barrier_low, barrier_high)
	{
		postMsg(String.format("/contract/{0}/{1}/{2}/{3}/{4}/{5}/{6}/{7}/{8}", contract_type, symbol, duration_unit, duration, payout_currency, payout, start_time, barrier_low, barrier_high), callback, Binary.Api.Intervals.Once);
	};

	this.unsubscribeAll = function ()
	{
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


