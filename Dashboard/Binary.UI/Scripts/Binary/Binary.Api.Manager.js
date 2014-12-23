/// <reference path="Binary.Core.js" />

ns("Binary.Api");
Binary.Api.ManagerClass = function (proxyUrl)
{
	var me = this;
	var currentToken = false;
	me.getToken = function ()
	{
		if (currentToken === false)
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

	var fireApiResult = function (listener)
	{
		listener.each(function (widget)
		{
			var frame = $("iframe[src*='id=" + widget.widgetID + "']");
			if (frame.length > 0)
			{
				frame[0].contentWindow.postMessage(JSON.stringify({ data: listener.result, originalMessage: listener.originalMessage, apiMethod: listener.apiMethod }), "*");
			};
		});
	};

	var tokenRequestVisible = false;
	var callMethod = function (listener)
	{
		if (listener.cached && listener.result)
		{
			fireApiResult(listener);
		}
		listener.firing = true;
		$.ajax(
		{
			type: 'GET',
			url: proxyUrl + "/APICall?method=" + encodeURIComponent(listener.apiMethod),
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
					listener.result = response;
					fireApiResult(listener);
					listener.clear();
					if (!listener.cached)
					{
						me.EventBus.removeAtKey(listener.apiMethod);
					}
					listener.firing = false;
				}
			},
			error: function (x, exception, errorThrown)
			{
				var message;
				var statusErrorMap = {
					'400': "Server understood the request but request content was invalid.",
					'401': "Unauthorised access.",
					'403': "Forbidden resouce can't be accessed",
					'500': "Internal Server Error.",
					'503': "Service Unavailable"
				};
				if (x.status && x.status != '200')
				{
					message = statusErrorMap[x.status];
					if (!message)
					{
						message = "Unknow Error \n.";
					}
				} else if (exception == 'parsererror')
				{
					message = "Error.\nParsing JSON Request failed.";
				} else if (exception == 'timeout')
				{
					message = "Request Time out.";
				} else if (exception == 'abort')
				{
					message = "Request was aborted by the server";
				} else
				{
					message = "Unknow Error \n.";
				}
				Ext.Msg.show(
				{
					title: 'Error!',
					msg: message,
					width: 400,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			},
			contentType: 'application/json'
		});
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
		if (!me.getToken())
		{
			tokenRequestWindow.show();
		}
		if (!processing)
		{
			processing = true;
			$(window).bind("message", function (e)
			{
				var data = $.parseJSON(e.originalEvent.data);
				if (data.apiMethod == Binary.Api.Methods.Token)
				{
					me.setToken(data.data);
					tokenRequestWindow.hide();
					return;
				}

				if (data.apiMethod)
				{
					var listener = me.EventBus.getByKey(data.apiMethod);
					if (!listener)
					{
						listener = me.EventBus.add(data.apiMethod, new Ext.util.MixedCollection(
						{
							firing: false,
							result: null,
							cached: data.cached,
							originalMessage: data,
							apiMethod: data.apiMethod
						}));
					}

					var widget = listener.getByKey(data.widgetID) || listener.add(data.widgetID, {});
					widget.widgetID = data.widgetID;

					if (!me.getToken())
					{
						return;
					}
					if (!listener.firing)
					{
						callMethod(listener);
					}
				}
			});
		}
	};
};
Binary.Api.ManagerClass.__class = true;

