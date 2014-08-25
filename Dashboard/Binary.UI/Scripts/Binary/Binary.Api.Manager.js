/// <reference path="Binary.Core.js" />

ns("Binary.Api");
Binary.Api.ManagerClass=function(proxyUrl)
{
	var me = this;
	var currentToken = false;
	me.getToken = function ()
	{
		if (currentToken===false)
		{
			var storedAuthInfo = window.localStorage.getItem("OAuthInfo");
			currentToken = storedAuthInfo ? JSON.parse(storedAuthInfo) : null;
		}
		return currentToken;
	};
	me.setToken = function (token)
	{
		currentToken = token;
		window.localStorage.setItem("OAuthInfo", JSON.stringify(token));
	};
	me.EventBus = new Ext.util.MixedCollection();

	var getComponentFrame = function (id)
	{
		return $("iframe[src*='id=" + id + "']");
	};
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
				var frame = getComponentFrame(widget.widgetID);
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

	var tokenRequestVisible = false;
	var callMethod = function (methodName, listener)
	{
		listener.firing = true;
		$.ajax(
		{
			type: 'GET',
			url: proxyUrl + "/APICall?method=" + methodName,
			dataType: 'jsonp',
			crossDomain: true,
			data: { token: me.getToken().access_token },
			success: function (response)
			{
				listener.firing = false;
				if (response.code == 401)
				{
					if (!tokenRequestVisible)
					{
						me.setToken(null);
						tokenRequestVisible = true;
						tokenRequestWindow.show();
					}
				}
				else
				{
					fireApiResult(methodName, response);
				}
			},
			contentType: 'application/json'
		});
	};

	var processEvents = function ()
	{
		if (me.getToken() != null)
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
		listeners:
		{
			beforehide: function ()
			{
				tokenRequestVisible = false;
			}
		},
		items:
		[
			{
				xtype: 'container',
				html: "<iframe src='" + proxyUrl + "' style='height: 100%; width: 100%; border:0'></iframe>"
			}
		]
	});

	var intervalId = 0;
	var processing = false;
	this.BeginProcessing = function ()
	{
		if (!processing)
		{
			processing = true;
			intervalId = window.setInterval(processEvents, Binary.Api.Intervals.Fast);

			Ext.app.Mediator.on("componentRemoved", function (cmp)
			{
				me.EventBus.each(function (widgets)
				{
					widgets.each(function (item)
					{
						if (item.widgetID == cmp.component.data.id)
						{
							widgets.remove(item);
						}
					});
				});
				var s = "";
			});

			if (!me.getToken())
			{
				tokenRequestWindow.show();
			}

			$(window).bind("message", function (e)
			{
				var data = $.parseJSON(e.originalEvent.data);
				if (data.apiMethod == Binary.Api.Methods.Token)
				{
					me.setToken(data.data);
					tokenRequestWindow.hide();
					return;
				}

				var widgets = me.EventBus.getByKey(data.apiMethod);
				if (data.action == Binary.Api.Methods.Unsubscribe)
				{
					if (widgets)
					{
						widgets.removeAtKey(data.widgetID);
					}
					if (widgets.getCount()==0)
					{
						me.EventBus.removeAtKey(data.apiMethod);
					}
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

