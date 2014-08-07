/// <reference path="Binary.Core.js" />
ns("Binary.Api");

Binary.Api.ProxyBase = function ()
{
	this.apiCall = function (apiMethod, callback, interval, data) { };
	this.processCallback = function (data) { };
	this.start();
	this.stop();
};

Binary.Api.DashboardProxy = function ()
{
	var me = this;
	this.Listeners = {};
	this.apiCall = function (apiMethod, callback, interval, data)
	{
		me.Listeners[apiMethod] = callback;
		var message =
		{
			data: data || {},
			apiMethod: apiMethod,
			widgetID: Binary.Gadget.id,
			interval: interval
		};
		top.postMessage(JSON.stringify(message), "*");
	};

	var processCallback = function (e)
	{
		var data = JSON.parse(e.originalEvent.data);
		me.Listeners[data.apiMethod](data.data);
	}

	this.start = function ()
	{
		$(window).bind("message", processCallback);
	}
	this.stop = function ()
	{
		$(window).unbind("message", processCallback);
	}
};
Binary.Api.DashboardProxy.__class = true;













