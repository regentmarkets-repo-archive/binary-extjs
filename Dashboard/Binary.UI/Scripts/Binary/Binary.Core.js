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
Binary.Api.Granularities.Tick="tick";
Binary.Api.Granularities.M1="M1";
Binary.Api.Granularities.M5="M5";
Binary.Api.Granularities.M30="M30";
Binary.Api.Granularities.H1="H1";
Binary.Api.Granularities.H8="H8";
Binary.Api.Granularities.D="D";
Binary.Api.Granularities.__enum=true;

Binary.Api.getCountForGranularity = function (granularity)
{
	return Binary.Api.getCountForGranularity.GranularityConfig[granularity].count;
};
Binary.Api.getIntervalForGranularity = function (granularity)
{
	if (granularity == 'tick') granularity = 'ticks';
	return Binary.Api.getCountForGranularity.GranularityConfig[granularity].seconds;
};
Binary.Api.getCountForGranularity.GranularityConfig =
{
	'ticks': { seconds: 0, interval: 3600, count: 0, chartType: 'ticks' },
	'M1': { seconds: 60, interval: 86400, count: 30, chartType: 'ticks' },
	'M5': { seconds: 300, interval: 7 * 86400, count: 150, chartType: 'ticks' },
	'M30': { seconds: 1800, interval: 31 * 86400, count: 30, chartType: 'candles' },
	'H1': { seconds: 3600, interval: 62 * 86400, count: 60, chartType: 'candles' },
	'H8': { seconds: 8 * 3600, interval: 183 * 86400, count: 480, chartType: 'candles' },
	'D': { seconds: 86400, interval: 366 * 3 * 86400, count: 3 * 480, chartType: 'candles' }
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

