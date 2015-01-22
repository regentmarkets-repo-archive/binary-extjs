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

if (!Number.zeroFill)
{
	Number.zeroFill = function (num, places)
	{
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	};
}

Binary.log = function (message)
{
	var dt=new Date();
	console.log(dt.getMinutes() + ":" + dt.getSeconds() + ":" + dt.getMilliseconds() + " " + message);
};

Binary.ifHasValue = function (value, defaultValue)
{
	return (typeof value !== 'undefined' && value != null) ? value : defaultValue;
};

Date.getUtcDate = function (year, month, day, hours, mins, secs)
{
	var now=new Date();
	return new Date(
		Binary.ifHasValue(year, now.getUTCFullYear()),
		Binary.ifHasValue(month, now.getUTCMonth()),
		Binary.ifHasValue(day, now.getUTCDate()),
		Binary.ifHasValue(hours, now.getUTCHours()),
		Binary.ifHasValue(mins, now.getUTCMinutes()),
		Binary.ifHasValue(secs, now.getUTCSeconds()));
};

Date.prototype.toUtc=function()
{
	return Date.getUtcDate(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds());
};

Date.prototype.addDays = function (days)
{
	return new Date(this.getFullYear(), this.getMonth(), this.getDate() + days, this.getHours(), this.getMinutes(), this.getSeconds());
};

Date.prototype.addTime = function (date)
{
	return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours() + date.getHours(), this.getMinutes() + date.getMinutes(), this.getSeconds() + date.getSeconds());
};

Date.prototype.getDatePart = function ()
{
	return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

Binary.Api.ContractTypes =
{
	"Rise/Fall":
	{
		category_systemName: "risefall",
		contractPair:
		[
			{
				displayName: 'Rises',
				img: 'risefall_1.png',
				use: ['DOUBLEUP', 'FLASHU', 'INTRADU']
			},
			{
				displayName: 'Falls',
				img: 'risefall_2.png',
				use: ['DOUBLEDOWN', 'FLASHD', 'INTRADD']
			}
		],
		available:
		[
			{
				contract_name: "DOUBLEDOWN",
				is_forward_starting: 'N',
				expiry_type: 'daily'
			},
			{
				contract_name: "DOUBLEUP",
				is_forward_starting: 'N',
				expiry_type: 'daily'
			},
			{
				contract_name: "FLASHD",
				is_forward_starting: 'N',
				expiry_type: 'intraday'
			},
			{
				contract_name: "FLASHD",
				is_forward_starting: 'N',
				expiry_type: 'tick'
			},
			{
				contract_name: "FLASHU",
				is_forward_starting: 'N',
				expiry_type: 'intraday'
			},
			{
				contract_name: "FLASHU",
				is_forward_starting: 'N',
				expiry_type: 'tick'
			},
			{
				contract_name: "INTRADD",
				is_forward_starting: 'Y',
				expiry_type: 'intraday'
			},
			{
				contract_name: "INTRADU",
				is_forward_starting: 'Y',
				expiry_type: 'intraday'
			}
		]
	},
	"Higher/Lower":
	{
		category_systemName: "higherlower",
		contractPair:
		[
			{
				displayName: 'Higher',
				img: 'higherlower_1.png',
				use: ['CALL']
			},
			{
				displayName: 'Lower',
				img: 'higherlower_2.png',
				use: ['PUT']
			}
		],
		available:
		[
			{
				contract_name: "CALL",
				is_forward_starting: 'N',
				expiry_type: 'intraday'
			},
			{
				contract_name: "CALL",
				is_forward_starting: 'N',
				expiry_type: 'daily'
			},
			{
				contract_name: "PUT",
				is_forward_starting: 'N',
				expiry_type: 'intraday'
			},
			{
				contract_name: "PUT",
				is_forward_starting: 'N',
				expiry_type: 'daily'
			}
		]
	},
	"Touch/No Touch":
	{
		category_systemName: "touchnotouch",
		contractPair:
		[
			{
				displayName: 'Touches',
				img: 'touchnotouch_1.png',
				use: ['ONETOUCH']
			},
			{
				displayName: 'Does Not Touch',
				img: 'touchnotouch_2.png',
				use: ['NOTOUCH']
			}
		],
		available:
		[
			{
				contract_name: "NOTOUCH",
				is_forward_starting: 'N',
				expiry_type: 'intraday'
			},
			{
				contract_name: "NOTOUCH",
				is_forward_starting: 'N',
				expiry_type: 'daily'
			},
			{
				contract_name: "ONETOUCH",
				is_forward_starting: 'N',
				expiry_type: 'intraday'
			},
			{
				contract_name: "ONETOUCH",
				is_forward_starting: 'N',
				expiry_type: 'daily'
			}
		]
	},
	"Stays Between/Goes Outside":
	{
		category_systemName: "staysinout",
		contractPair:
		[
			{
				displayName: 'Stays Between',
				img: 'staysinout_1.png',
				use: ['RANGE']
			},
			{
				displayName: 'Goes Outside',
				img: 'staysinout_2.png',
				use: ['UPORDOWN']
			}
		],
		available:
		[
			{
				contract_name: "RANGE",
				is_forward_starting: 'N',
				expiry_type: 'intraday'
			},
			{
				contract_name: "RANGE",
				is_forward_starting: 'N',
				expiry_type: 'daily'
			},
			{
				contract_name: "UPORDOWN",
				is_forward_starting: 'N',
				expiry_type: 'intraday'
			},
			{
				contract_name: "UPORDOWN",
				is_forward_starting: 'N',
				expiry_type: 'daily'
			}
		]
	},
	"Ends Between/Outside":
	{
		category_systemName: "endsinout",
		contractPair:
		[
			{
				displayName: 'Ends Between',
				img: 'endsinout_1.png',
				use: ['EXPIRYRANGE']
			},
			{
				displayName: 'Ends Outside',
				img: 'endsinout_2.png',
				use: ['EXPIRYMISS']
			}
		],
		available:
		[
			{
				contract_name: "EXPIRYMISS",
				is_forward_starting: 'N',
				expiry_type: 'intraday'
			},
			{
				contract_name: "EXPIRYMISS",
				is_forward_starting: 'N',
				expiry_type: 'daily'
			},
			{
				contract_name: "EXPIRYRANGE",
				is_forward_starting: 'N',
				expiry_type: 'intraday'
			},
			{
				contract_name: "EXPIRYRANGE",
				is_forward_starting: 'N',
				expiry_type: 'daily'
			}
		]
	},
	"Asian Up/Down":
	{
		category_systemName: "asian",
		contractPair:
		[
			{
				displayName: 'Asian Up',
				img: 'asian_1.png',
				use: ['ASIANU']
			},
			{
				displayName: 'Asian Down',
				img: 'asian_2.png',
				use: ['ASIAND']
			}
		],
		available:
		[
			{
				contract_name: "ASIAND",
				is_forward_starting: 'N',
				expiry_type: 'tick'
			},
			{
				contract_name: "ASIANU",
				is_forward_starting: 'N',
				expiry_type: 'tick'
			}
		]
	},
	"Digit Match/Differ":
	{
		category_systemName: "digits",
		contractPair:
		[
			{
				displayName: 'Matches',
				img: 'digits_1.png',
				use: ['DIGITMATCH']
			},
			{
				displayName: 'Differs',
				img: 'digits_2.png',
				use: ['DIGITDIFF']
			}
		],
		available:
		[
			{
				contract_name: "DIGITMATCH",
				is_forward_starting: 'N',
				expiry_type: 'tick'
			},
			{
				contract_name: "DIGITDIFF",
				is_forward_starting: 'N',
				expiry_type: 'tick'
			}
		]
	}
};

(function ()
{
	for(var p in Binary.Api.ContractTypes)
	{
		var contract = Binary.Api.ContractTypes[p];
		for (var i = 0; i < contract.available.length; i++)
		{
			var min = 60 * 2;
			var max = 60 * 60 * 24;
			if (contract.available[i].expiry_type == 'daily')
			{
				min = 1;
				max = 355;
			}
			if (contract.available[i].expiry_type == 'tick')
			{
				min = 5;
				max = 15;
			}
			contract.available[i].durations =
			{
				min: min,
				max: max
			};
		}
	}
})();
