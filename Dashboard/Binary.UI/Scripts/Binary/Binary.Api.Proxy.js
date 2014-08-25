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
		for (var p in me.Listeners)
		{
			me.apiCall(p, null, Binary.Api.Intervals.Once, null);
		}
	};
	this.apiCall = function (apiMethod, callback, interval, data)
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
			widgetID: Binary.Gadget.id,
			interval: interval
		};

		if (callback == null)
		{
			message.action = Binary.Api.Methods.Unsubscribe;
			delete me.Listeners[apiMethod];
		}
		else
		{
			me.Listeners[apiMethod] = callback;
		}

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













