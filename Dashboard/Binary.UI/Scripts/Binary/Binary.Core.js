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

Binary.Api.Tick = 1000;
Binary.Api.Intervals =
{
	Once: 0,
	Fast: 3 * Binary.Api.Tick,
	Medium: 10 * Binary.Api.Tick,
	Slow: 60 * Binary.Api.Tick
};

Binary.Api.Methods = function ()
{
	/// <field name="Token" type="Number" integer="true" static="true"></field>
	/// <field name="Editor" type="Number" integer="true" static="true"></field>
};
Binary.Api.Methods.prototype =
{
	Token: 1,
	Editor: 2
};
Binary.Api.Methods.__enum = true;

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

