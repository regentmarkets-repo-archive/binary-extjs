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

Binary.PostMessageApiPrefix = "BinaryApiCall";
Binary.PostMessageOSPrefix = "BinaryOSCall";

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
	/// <field name="M1" type="String" static="true"></field>
	/// <field name="M5" type="String" static="true"></field>
	/// <field name="M10" type="String" static="true"></field>
	/// <field name="M30" type="String" static="true"></field>
	/// <field name="H1" type="String" static="true"></field>
	/// <field name="H2" type="String" static="true"></field>
	/// <field name="H4" type="String" static="true"></field>
	/// <field name="H8" type="String" static="true"></field>
	/// <field name="D" type="String" static="true"></field>
}

Binary.Api.Granularities.M10 =
{
	name: "M10",
	callType: 'ticks',
	displayName: "10 Minutes",
	seconds: 10*60
};
Binary.Api.Granularities.M30 =
{
	name: "M30",
	callType: 'ticks',
	displayName: "30 Minutes",
	seconds: 30*60
};
Binary.Api.Granularities.H1 =
{
	name: "H1",
	callType: 'ticks',
	displayName: "1 Hour",
	seconds: 1*60*60
};
Binary.Api.Granularities.H2 =
{
	name: "H2",
	callType: 'candles',
	displayName: "2 Hours",
	seconds: 2*60*60
};
Binary.Api.Granularities.H4 =
{
	name: "H4",
	callType: 'candles',
	displayName: "4 Hours",
	seconds: 4*60*60
};
Binary.Api.Granularities.H8 =
{
	name: "H8",
	callType: 'candles',
	displayName: "8 Hours",
	seconds: 8*60*60
};
Binary.Api.Granularities.D =
{
	name: "D",
	callType: 'candles',
	displayName: "Day",
	seconds: 24*60*60
};
Binary.Api.Granularities.__enum = true;

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

Binary.log = function (message)
{
	var dt=new Date();
	console.log(dt.getMinutes() + ":" + dt.getSeconds() + ":" + dt.getMilliseconds() + " " + message);
};

Binary.Api.ContractTypes =
{
	"Rise/Fall":
	{
		name: "risefall",
		contracts:
		{
			"DOUBLEDOWN":
			{
				is_forward_starting: false,
				minDuration: '1day'
			},
			"DOUBLEUP":
			{
				is_forward_starting: false
			},
			"FLASHD":
			{
				is_forward_starting: false
			},
			"FLASHU":
			{
				is_forward_starting: false
			},
			"INTRADD":
			{
				is_forward_starting: true
			},
			"INTRADU":
			{
				is_forward_starting: true
			}
		},
		ticksAllowed: true
	},
	"Ends Between/Outside":
	{
		name: "endsinout",
		contracts:
		{
			"EXPIRYMISS":
			{
				is_forward_starting: true
			},
			"EXPIRYRANGE":
			{
				is_forward_starting: true
			}
		},
		ticksAllowed: true
	},
	"Stays Between/Goes Outside":
	{
		name: "staysinout",
		contracts:
		{
			"RANGE":
			{
				is_forward_starting: true
			},
			"UPORDOWN":
			{
				is_forward_starting: true
			}
		},
		ticksAllowed: true
	},
	"Higher/Lower":
	{
		name: "higherlower",
		contracts:
		{
			"CALL":
			{
				is_forward_starting: true
			},
			"PUT":
			{
				is_forward_starting: true
			}
		},
		ticksAllowed: true
	},
	"Touch/No Touch":
	{
		name: "touchnotouch",
		contracts:
		{
			"NOTOUCH":
			{
				is_forward_starting: true
			},
			"ONETOUCH":
			{
				is_forward_starting: true
			}
		},
		ticksAllowed: true
	},
	"Asian Up/Down":
	{
		name: "asian",
		contracts:
		{
			"ASIAND":
			{
				is_forward_starting: true
			},
			"ASIANU":
			{
				is_forward_starting: true
			}
		},
		ticksAllowed: true
	},
	"Digit Match/Differ":
	{
		name: "digits",
		contracts:
		{
			"DIGITDIFF":
			{
				is_forward_starting: true
			},
			"DIGITMATCH":
			{
				is_forward_starting: true
			}
		},
		ticksAllowed: true
	}
};
