/// <reference path="Binary.Core.js" />
ns("Binary.Api");

Binary.Api.ProxyBase = function ()
{
	this.apiCall = function (apiMethod, callback, data) { };
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
	this.apiCall = function (message, callback, eventData)
	{
		var listenerId = Math.round(Math.random() * 1000);
		message.listenerId = listenerId;
		me.Listeners[listenerId] =
		{
			callback: callback,
			listenerId: listenerId,
			eventData: eventData
		};
		top.postMessage(Binary.PostMessageApiPrefix + JSON.stringify(message), "*");
	};

	var processCallback = function (e)
	{
		//Binary.log("processCallback start");
		var data = JSON.parse(e.originalEvent.data);
		//Binary.log("processCallback end");
		var listener = me.Listeners[data.originalMessage.listenerId];
		if (listener)
		{
			listener.callback(data.data, listener.eventData);
			delete me.Listeners[data.originalMessage.listenerId];
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













