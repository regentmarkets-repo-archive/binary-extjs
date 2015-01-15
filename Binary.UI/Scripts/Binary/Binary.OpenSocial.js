/// <reference path="Binary.Core.js" />
/// <reference path="../OpenSocial/os.js" />

gadgets.Prefs = function ()
{
	var esc = gadgets.util.escapeString;
	var prefs = {};
	var language = 'en';
	var country = 'US';
	var moduleId = 0;
	var params = gadgets.util.getUrlParameters();
	for (var i in params)
	{
		if (params.hasOwnProperty(i))
		{
			if (i.indexOf('up_') === 0 && i.length > 3)
			{
				prefs[i.substr(3)] = String(params[i]);
			} else if (i === 'country')
			{
				country = params[i];
			} else if (i === 'lang')
			{
				language = params[i];
			} else if (i === 'mid' || i === 'ID')
			{
				moduleId = params[i];
			}
		}
	};

	var getWidgetStorage = function ()
	{
		return JSON.parse(window.localStorage.getItem("binaryWidgetLocalStorage_" + moduleId) || "{}");
	};
	var syncWidgetStorage = function (widgetData)
	{
		window.localStorage.setItem("binaryWidgetLocalStorage_" + moduleId, JSON.stringify(widgetData));
	};

	this.set = function (key, value)
	{
		var data = getWidgetStorage();
		data[key] = value;
		syncWidgetStorage(data);
	};

	var get = function (key)
	{
		var storage = getWidgetStorage();
		return typeof storage[key] == typeof undefined ? prefs[key] : storage[key];
	};

	this.getString = function (key)
	{
		if (key === '.lang')
		{
			key = 'lang';
		}
		return get(key);
	};

	this.getInt = function (key)
	{
		var val = parseInt(get(key), 10);
		return isNaN(val) ? 0 : val;
	};
	this.getFloat = function (key)
	{
		var val = parseFloat(get(key));
		return isNaN(val) ? 0 : val;
	};
	this.getBool = function (key)
	{
		var val = get(key);
		if (val)
		{
			return val === 'true' || val === true || !!parseInt(val, 10);
		}
		return false;
	};

	this.getCountry = function ()
	{
		return country;
	};

	this.getLang = function ()
	{
		return language;
	};
	this.getModuleId = function ()
	{
		return moduleId;
	};
};

gadgets.window.setTitle = function (title)
{
	var data =
	{
		widgetID: gadgets.util.getUrlParameters()['ID'],
		action: 'set_title',
		data: title
	};
	top.postMessage(Binary.PostMessageOSPrefix + JSON.stringify(data), "*");
};
