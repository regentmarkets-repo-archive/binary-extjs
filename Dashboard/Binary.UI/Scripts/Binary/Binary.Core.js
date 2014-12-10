/// <reference path="../_references.js" />

window.ns = function (ns)
{
	var sp = ns.split(".");
	var obj = window;
	for (var i = 0; i < sp.length; i++)
	{
		if (!obj[sp[i]]) obj[sp[i]] = {};
		obj[sp[i]].__namespace = true;
		obj = obj[sp[i]];
	}
}

ns("Binary.Api");

Binary.parseUrl = function (url)
{
	var search = (url || location.search).substring(1);
	var result = search ?
		JSON.parse(
		'{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
		function (key, value) { return key === "" ? value : decodeURIComponent(value) })
		: {};
	return result;
};
Binary.isDefined = function (value)
{
	return typeof value !== 'undefined';
};

Binary.Gadget = Binary.parseUrl();

/*
Binary.Api.Tick = 1000;
Binary.Api.Intervals = function()
{
	/// <field name="Once" type="Number" static="true">instant call</field>
	/// <field name="Fast" type="String" static="true">frequent call (few seconds delay)</field>
	/// <field name="Medium" type="String" static="true">medium frequency call (10 or more seconds)</field>
	/// <field name="Slow" type="String" static="true">slow frequency call (minute or more)</field>
}
Binary.Api.Intervals.Once = 0;
Binary.Api.Intervals.Fast = 3 * Binary.Api.Tick;
Binary.Api.Intervals.Medium = 10 * Binary.Api.Tick;
Binary.Api.Intervals.Slow = 60 * Binary.Api.Tick;
Binary.Api.Intervals.__enum = true;
*/
Binary.Api.Methods = function ()
{
	/// <field name="Token" type="String" static="true"></field>
	/// <field name="Editor" type="String" static="true"></field>
};
Binary.Api.Methods.Token = "Token";
Binary.Api.Methods.Editor = "Editor";
Binary.Api.Methods.__enum = true;

Binary.Api.Granularities = function ()
{
	/// <field name="Tick" type="String" static="true"></field>
	/// <field name="M1" type="String" static="true"></field>
	/// <field name="M5" type="String" static="true"></field>
	/// <field name="M30" type="String" static="true"></field>
	/// <field name="H1" type="String" static="true"></field>
	/// <field name="H8" type="String" static="true"></field>
	/// <field name="D" type="String" static="true"></field>
}
/*
Binary.Api.Granularities.Tick =
{
	name: "tick",
	displayName: '10min',
	seconds: 600
};
Binary.Api.Granularities.M1 =
{
	name: "M1",
	displayName: "",
	seconds: 
Binary.Api.Granularities.M5="M5";
Binary.Api.Granularities.M30="M30";
Binary.Api.Granularities.H1="H1";
Binary.Api.Granularities.H8="H8";
Binary.Api.Granularities.D="D";
Binary.Api.Granularities.__enum=true;
*/

//Binary.ApiCallType
/*
Binary.Api.getIntervalForGranularity = function (granularity)
{
	return Binary.Api.GranularityConfig[granularity].seconds;
};

Binary.Api.getTimeframeForGranularity = function (granularity)
{
	return Binary.Api.GranularityConfig[granularity].timeframe;
};
*/
Binary.Api.getConfigForTimeFrame = function (timeFrame)
{
	var c=Binary.Api.GranularityConfig;
	for (var p in c)
	{
		if (c[p].timeframe == timeFrame) return c[p];
	}
	return null;
};
Binary.Api.GranularityConfig =
{	
	'M10': { seconds: 600, timeframe: 'M1', chartType: 'ticks' },
	'H1': { seconds: 3600, timeframe: 'M1', chartType: 'candles' },
	//'H2': { seconds: 2*3600, timeframe: 'M5', chartType: 'candles' },
	'H6': { seconds: 21600, timeframe: 'M1', chartType: 'candles' },
	'H12': { seconds: 43200, timeframe: 'M1', chartType: 'candles' },
	'D': { seconds: 86400, timeframe: 'M10', chartType: 'candles' },
	'D2': { seconds: 2 * 86400, timeframe: 'M30', chartType: 'candles' },
	'D5': { seconds: 5 * 86400, timeframe: 'M30', chartType: 'candles' },
	'W': { seconds: 7 * 86400, timeframe: 'H1', chartType: 'candles' },
	'W2': { seconds: 21 * 86400, timeframe: 'H4', chartType: 'candles' },
	'M': { seconds: 31 * 86400, timeframe: 'H4', chartType: 'candles' },
	'M3': { seconds: 93 * 86400, timeframe: 'H8', chartType: 'candles' },
	'Y': { seconds: 364 * 86400, timeframe: 'D', chartType: 'candles' }
};

if (!String.format)
{
	String.format = function (format)
	{
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function (match, number)
		{
			return typeof args[number] != 'undefined'
			  ? args[number]
			  : match
			;
		});
	};
}

