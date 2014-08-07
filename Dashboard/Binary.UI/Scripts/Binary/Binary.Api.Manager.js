/// <reference path="Binary.Core.js" />

ns("Binary.Api");
Binary.Api.ManagerClass=function(proxyUrl)
{
	//var proxyUrl = 'http://localhost:38139';//'http://195.24.133.198';
	var me = this;
	me.Token = null;
	me.EventBus = new Ext.util.MixedCollection();

	var fireApiResult = function (methodName, data)
	{
		var listener = me.EventBus.getByKey(methodName);
		listener.each(function (widget)
		{
			var mustFire = false;
			do
			{
				if (widget.interval == Binary.Api.Intervals.Once && widget.fired)
				{
					break;
				}

				if (widget.interval != Binary.Api.Intervals.Once && widget.interval > widget.tick)
				{
					break;
				}

				mustFire = true;
			}
			while (false);

			if (mustFire)
			{
				var frame = $("iframe[src*='id=" + widget.widgetID + "']");
				if (frame.length > 0)
				{
					frame[0].contentWindow.postMessage(JSON.stringify({ data: data, apiMethod: methodName }), "*");
					widget.fired = true;
					widget.tick = 0;
				}
			}
		});
		listener.firing = false;
	};

	var callMethod = function (methodName, listener)
	{
		listener.firing = true;
		$.ajax(
		{
			type: 'GET',
			url: proxyUrl + "/APICall?method=" + methodName,
			dataType: 'jsonp',
			crossDomain: true,
			data: { token: me.Token.access_token },
			success: function (response)
			{
				fireApiResult(methodName, response);
			},
			contentType: 'application/json'
		});
	};

	var processEvents = function ()
	{
		if (me.Token != null)
		{
			me.EventBus.each(function (listener)
			{
				if (!listener.firing)
				{
					var mustFire = false;
					listener.each(function (widget, index)
					{
						do
						{
							if (widget.interval == Binary.Api.Intervals.Once && widget.fired)
							{
								break;
							}

							if (widget.interval > widget.tick)
							{
								widget.tick += window.Binary.Tick;
								break;
							}
							mustFire = true;
						}
						while (false);
					});
					if (mustFire)
					{
						callMethod(listener.method, listener);
					}
				}
			});
		}
	};

	var tokenRequestWindow = new Ext.window.Window(
	{
		modal: true,
		width: 600,
		height: 500,
		layout: 'fit',
		closable: false,
		items:
		[
			{
				xtype: 'container',
				html: "<iframe src='" + proxyUrl + "' style='height: 100%; width: 100%; border:0'></iframe>"
			}
		]
	});

	var processing = false;
	this.BeginProcessing = function ()
	{
		if (!processing)
		{
			processing = true;
			window.setInterval(processEvents, Binary.Api.Intervals.Fast);

			var token=window.localStorage.getItem("OAuthInfo");
			if (token)
			{
				me.Token = JSON.parse(token)
			}
			else
			{
				tokenRequestWindow.show();
			}

			$(window).bind("message", function (e)
			{
				var data = $.parseJSON(e.originalEvent.data);
				if (data.apiMethod == Binary.Api.Methods.Token)
				{
					me.Token = data.data;
					tokenRequestWindow.close();
					return;
				}

				var interval = data.interval;
				if (interval !== Binary.Api.Intervals.Once &&
					interval !== Binary.Api.Intervals.Fast &&
					interval !== Binary.Api.Intervals.Medium &&
					interval !== Binary.Api.Intervals.Slow)
				{
					interval = Binary.Api.Intervals.Once;
				};

				var widgets = me.EventBus.getByKey(data.apiMethod);
				if (!widgets)
				{
					widgets = me.EventBus.add(data.apiMethod, new Ext.util.MixedCollection(
					{
						firing: false,
						method: data.apiMethod
					}));
				}

				var widget = widgets.getByKey(data.widgetID) || widgets.add(data.widgetID, {});
				widget.interval = interval;
				widget.fired = false;
				widget.widgetID = data.widgetID;
				widget.tick = Binary.Api.Tick;
			});
		}
	};
};
Binary.Api.ManagerClass.__class = true;

