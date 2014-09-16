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
	this.unsubscribeAll = function ()
	{
		this.Listeners = {};
	};
	this.apiCall = function (message, callback)
	{
		me.Listeners[message.apiMethod] = callback;
		top.postMessage(JSON.stringify(message), "*");
	};

	var processCallback = function (e)
	{
		var data = JSON.parse(e.originalEvent.data);
		if (me.Listeners[data.apiMethod])
		{
			me.Listeners[data.apiMethod](data.data);
		}
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













