window.Binary = window.Binary || {};
Binary.Api = Binary.Api || {};
Binary.Api.Tick = 1000;
Binary.Api.Intervals =
{
	Once: 0,
	Fast: 3 * Binary.Api.Tick,
	Medium: 10 * Binary.Api.Tick,
	Slow: 60 * Binary.Api.Tick
};

Binary.Api.Methods =
{
	GetOfferings: "GetOfferings",
	GetMarkets: "GetMarkets",
	GetSymbols: "GetSymbols",
	GetPayoutCurrencies: "GetPayoutCurrencies",
	GetForexMarket: "GetForexMarket",
	GetAEXSymbol: "GetAEXSymbol",
	GetAEXSymbolTicks: "GetAEXSymbolTicks",
	GetAEXSymbolCandles: "GetAEXSymbolCandles",
	GetForexContractCategories: "GetForexContractCategories",
	GetForexContractParametersForUSDJPY: "GetForexContractParametersForUSDJPY",
	GetSymbolsUSDJPYPrice: "GetSymbolsUSDJPYPrice"
};

window.Binary.Api.ClientClass = function ()
{
	var postMsg = function (data, interval, apiMethod, widgetID)
	{
		var message =
		{
			data: data,
			apiMethod: apiMethod,
			widgetID: widgetID,
			interval: interval
		};
		top.postMessage(JSON.stringify(message), "*");
	};

	var parseUrl = function (url)
	{
		var search = (url || location.search).substring(1);
		var result = search ?
			JSON.parse(
			'{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
			function (key, value) { return key === "" ? value : decodeURIComponent(value) })
			: {};
		return result;
	};

	this.Widget = parseUrl();
	this.Listeners = {};
	this.GetOfferings = function (callback, interval)
	{
		this.Listeners["GetOfferings"] = callback;
		postMsg({}, interval, "GetOfferings", this.Widget.id);
	};

	this.GetMarkets = function (callback, interval)
	{
		this.Listeners["GetMarkets"] = callback;
		postMsg({}, interval, "GetMarkets", this.Widget.id);
	};

	this.GetSymbols = function (callback, interval)
	{
		this.Listeners["GetSymbols"] = callback;
		postMsg({}, interval, "GetSymbols", this.Widget.id);
	};

	this.GetPayoutCurrencies = function (callback, interval)
	{
		this.Listeners["GetPayoutCurrencies"] = callback;
		postMsg({}, interval, "GetPayoutCurrencies", this.Widget.id);
	};

	this.GetForexMarket = function (callback, interval)
	{
		this.Listeners["GetForexMarket"] = callback;
		postMsg({}, interval, "GetForexMarket", this.Widget.id);
	};

	this.GetAEXSymbol = function (callback, interval)
	{
		this.Listeners["GetAEXSymbol"] = callback;
		postMsg({}, interval, "GetAEXSymbol", this.Widget.id);
	};
	this.GetAEXSymbolTicks = function (callback, interval)
	{
		this.Listeners["GetAEXSymbolTicks"] = callback;
		postMsg({}, interval, "GetAEXSymbolTicks", this.Widget.id);
	};
	this.GetAEXSymbolCandles = function (callback, interval)
	{
		this.Listeners["GetAEXSymbolCandles"] = callback;
		postMsg({}, interval, "GetAEXSymbolCandles", this.Widget.id);
	};
	this.GetForexContractCategories = function (callback, interval)
	{
		this.Listeners["GetForexContractCategories"] = callback;
		postMsg({}, interval, "GetForexContractCategories", this.Widget.id);
	};
	this.GetForexContractParametersForUSDJPY = function (callback, interval)
	{
		this.Listeners["GetForexContractParametersForUSDJPY"] = callback;
		postMsg({}, interval, "GetForexContractParametersForUSDJPY", this.Widget.id);
	};
	this.GetSymbolsUSDJPYPrice = function (callback, interval)
	{
		this.Listeners["GetSymbolsUSDJPYPrice"] = callback;
		postMsg({}, interval, "GetSymbolsUSDJPYPrice", this.Widget.id);
	};
	var processMessage=function(e)
	{
		var data = $.parseJSON(e.originalEvent.data);
		me.Listeners[data.apiMethod](data.data);
	}
	this.Stop = function ()
	{
		$(window).unbind("message", processMessage);
	};
	var me = this;
	$(window).bind("message", processMessage);
};

Binary.Api.Client = new window.Binary.Api.ClientClass();
