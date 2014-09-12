var isStorageSupported = function (storage)
{
	if (typeof storage === 'undefined')
	{
		return false;
	}

	var testKey = 'test';
	try
	{
		storage.setItem(testKey, '1');
		storage.removeItem(testKey);
		return true;
	} catch (e)
	{
		return false;
	}
};

var Store = function (storage)
{
	this.storage = storage;
};

Store.prototype = {
	get: function (key)
	{
		return this.storage.getItem(key) ? this.storage.getItem(key) : undefined;
	},
	set: function (key, value)
	{
		if (typeof value != "undefined")
		{
			this.storage.setItem(key, value);
		}
	},
	remove: function (key)
	{
		this.storage.removeItem(key);
	},
	clear: function ()
	{
		this.storage.clear();
	},
};

var SessionStore, LocalStore;
if (isStorageSupported(window.localStorage))
{
	LocalStore = new Store(window.localStorage);
}

if (isStorageSupported(window.sessionStorage))
{
	if (!LocalStore)
	{
		alert('LocalStore = new Store(window.sessionStorage);');
	}

	SessionStore = new Store(window.sessionStorage);
}

if (!SessionStore || !LocalStore)
{
	if (!LocalStore)
	{
		alert('LocalStore = new InScriptStore();');
	}

	if (!SessionStore)
	{
		alert('SessionStore = new InScriptStore();');
	}
}

var Markets = function (markets, market_symbols)
{
	this.all = [];
	var market_count = markets.length;
	while (market_count--)
	{
		var market_name = markets[market_count];
		var market_config = market_symbols[market_name];
		var market_obj = new Market(market_name, market_config['label'], market_config['submarkets']);
		this.all.push(market_obj);
	}
};

Markets.prototype = {
	each: function (callback)
	{
		var market_count = this.all.length;
		while (market_count--)
		{
			callback.call(this.all[market_count]);
		}
	},
	by_symbol: function (symbol)
	{
		var market_count = this.all.length;
		while (market_count--)
		{
			var found = this.all[market_count].by_symbol(symbol);
			if (found)
			{
				return found;
			}
		}
	},
	get: function (name)
	{
		var market_count = this.all.length;
		while (market_count--)
		{
			if (this.all[market_count].name == name)
			{
				return this.all[market_count];
			}
		}
	}
};

var Market = function (name, display_name, submarkets)
{
	this.name = name;
	this.display_name = display_name;
	this.submarkets = [];
	this.all_submarkets = [];
	var submarket_count = submarkets.length;
	while (submarket_count--)
	{
		var submarket = submarkets[submarket_count];
		var submarket_obj = new SubMarket(submarket['name'], submarket['label'], submarket['instruments']);
		this.submarkets.push(submarket_obj);
		this.all_submarkets.push(submarket_obj);
	}
};

Market.prototype = {
	translated_display_name: function ()
	{
		return text.localize(this.display_name);
	},
	by_symbol: function (symbol)
	{
		var count = this.submarkets.length;
		while (count--)
		{
			found = this.submarkets[count].by_symbol(symbol);
			if (found)
			{
				found['market'] = this;
				return found;
			}
		}
	},
	each: function (callback)
	{
		var count = this.all_submarkets.length;
		while (count--)
		{
			callback.call(this.all_submarkets[count]);
		}
	},
	get: function (name)
	{
		if (name.toUpperCase() == 'ALL')
		{
			return this.all_submarkets;
		}

		var count = this.submarkets.length;
		while (count--)
		{
			if (this.submarkets[count].name == name)
			{
				return this.submarkets[count];
			}
		}
	}
};

var SubMarket = function (name, display_name, underlyings)
{
	this.name = name;
	this.display_name = display_name;
	this.underlyings = [];
	var underlying_count = underlyings.length;
	while (underlying_count--)
	{
		var underlying = underlyings[underlying_count];
		var underlying_object = {
			name: underlying['label'],
			symbol: underlying['value'],
			translated_display_name: function () { return text.localize(this.name); }
		};
		this.underlyings.push(underlying_object);
	}
};

SubMarket.prototype = {
	translated_display_name: function ()
	{
		return text.localize(this.display_name);
	},
	each: function (callback)
	{
		var underlying_count = this.underlyings.length;
		while (underlying_count--)
		{
			callback.call(this.underlyings[underlying_count]);
		}
	},
	by_symbol: function (symbol)
	{
		var underlying_count = this.underlyings.length;
		while (underlying_count--)
		{
			if (this.underlyings[underlying_count].symbol == symbol)
			{
				return { submarket: this, underlying: this.underlyings[underlying_count] };
			}
		}

		return;
	},
};

var Contract = function (name)
{
	this.name = name || 'Unknown contract';
};

Contract.prototype = {	
	type: function ()
	{
		return LocalStore.get('contract.form_name');
	},
	//prediction: function ()
	//{
	//	return $('[name=prediction]', this.form_selector()).val();
	//},
	market: function ()
	{
		return $('[name=market]').val();
	},
	submarket: function ()
	{
		return $('[name=submarket]').val();
	},
	underlying: function ()
	{
		return $('#underlying').val();
	},
	underlying_text: function ()
	{
		return $('#underlying option:selected').text();
	},	
	start_time: function ()
	{
		return $('[name=start_time]').val();
	},
	start_time_moment: function ()
	{
		var start_time = this.start_time();
		var now = {};
		//var now = moment.utc(bom_gmt_time());
		if (typeof start_time !== 'undefined' && start_time !== 'now')
		{
			now = moment.utc(start_time * 1000);
		}

		return now;
	},
	barrier_1: function ()
	{
		return $('#high_barrier').val();
	},
	barrier_2: function ()
	{
		return $('#low_barrier').val();
	},
	pip_size: function ()
	{
		return $('[name=pip_size]').val();
	},
	barrier_type: function ()
	{
		var barriers = $('[name=high_barrier]', this.form_selector()).length + $('[name=low_barrier]', this.form_selector()).length;
		if (barriers > 0)
		{
			return $('[name=barrier_type]', this.form_selector()).val();
		}
		return;
	},
	duration_container: function ()
	{
		return $('#duration_container');
	},
	duration_amount: function ()
	{
		return $('#duration_amount').val();
	},
	duration_units: function ()
	{
		return $('[name=duration_units]').val();
	},
	duration_seconds: function ()
	{
		var duration = parseInt(parseFloat(this.duration_amount()));
		var duration_units = this.duration_units();

		if (duration_units == 'm')
		{
			return duration * 60;
		} else if (duration_units == 'h')
		{
			return duration * 3600;
		} else if (duration_units == 'd')
		{
			return duration * 86400;
		}

		return duration;
	},
	duration_string: function ()
	{
		return this.duration_amount() + this.duration_units();
	},
	minimum_duration_for: function (unit)
	{
		var duration_container = this.duration_container();
		var minimums = duration_container.find('.' + unit);
		if (minimums.html())
		{
			return parseInt(parseFloat(minimums.html().split(':')[1]));
		}

		return;
	},
	currency: function ()
	{
		return $('[name=currency]').val();
	},
	amount: function ()
	{
		var amount_str = $('#amount').val();
		if (amount_str)
		{
			amount_str = amount_str.replace(',', '.');
			amount_str = amount_str.replace(/[^\d\.]/g, '');
		}
		var amount_f = parseFloat(amount_str);
		var amount = 0;
		if (!isNaN(amount_f) && amount_f > 0)
		{
			// only keep the first 2 digits of the floating value, and only 2
			amount_f = Math.round(amount_f * 100) / 100;
			var amount_int = Math.floor(amount_f);
			var float_val = amount_f - amount_int;
			if (float_val)
			{
				amount = amount_f.toFixed(2);
			} else
			{
				amount = amount_int;
			}
		}
		return amount;
	},
	is_amount_payout: function ()
	{
		return ($('#amount_type').val() == "payout");
	},
	is_amount_stake: function ()
	{
		return ($('#amount_type').val() == "stake");
	},
	amount_type: function ()
	{
		return $('#amount_type').val();
	},
	//show_ohlc: function ()
	//{
	//	return ($('input[name="showohlc"]').val() == "yes");
	//},
	//extratab: function ()
	//{
	//	return ($('input[name="extratab"]', this.form_selector()).val());
	//},
	is_forward_starting: function ()
	{
		return (this.start_time() && this.start_time().match(/^\d+$/));
	},
	can_select: function (selector, value)
	{
		if ($('#' + selector + ' option[value="' + value + '"]').length > 0)
		{
			return true;
		} else
		{
			return false;
		}
	},
	model: function ()
	{
		return {
			form_name: function (form_name)
			{
				var fallback = 'risefall';
				if (form_name)
				{
					//Save
				}
				form_name = fallback;//get name from combo
				if (!$('#' + form_name).length)
				{
					form_name = fallback;
				}
				return form_name;
			},
			market: function ()
			{
				if (market)
				{
					LocalStore.set('contract.market', market);
				}
				return LocalStore.get('contract.market') || 'forex';
			},
			underlying: function (underlying)
			{
				var for_market = this.market();
				if (underlying)
				{
					for_market = markets.by_symbol(underlying).market.name;
					LocalStore.set('contract.underlying.' + for_market, underlying);
				}
				return LocalStore.get('contract.underlying.' + for_market);
			},
			submarket: function (submarket)
			{
				if (submarket)
				{
					LocalStore.set('contract.submarket', submarket);
				}
				return LocalStore.get('contract.submarket');
			},
			start_time: function (start_time)
			{
				if (start_time)
				{
					LocalStore.set('contract.start_time', start_time);
				}
				return this.get_setting_or_param('contract.start_time', 'date_start');
			},
			expiry_type: function (expiry_type)
			{
				if (expiry_type)
				{
					LocalStore.set('contract.expiry_type', expiry_type);
				}

				return LocalStore.get('contract.expiry_type') || 'duration';
			},
			time: function (time)
			{
				if (time)
				{
					LocalStore.set('contract.time', time);
				}

				return this.get_setting_or_param("contract.time", 'time');
			},
			barrier_1: function ()
			{
				return;
			},
			barrier_2: function ()
			{
				return;
			},
			amount: function (amount)
			{
				if (amount)
				{
					LocalStore.set('contract.amount', amount);
				}

				return this.get_setting_or_param("contract.amount", 'amount');
			},
			amount_type: function (amount_type)
			{
				if (amount_type)
				{
					LocalStore.set('contract.amount_type', amount_type);
				}

				return this.get_setting_or_param("contract.amount_type", 'amount_type');
			},
			currency: function (currency)
			{
				if (currency)
				{
					LocalStore.set('contract.currency', currency);
				}

				var session_currency = LocalStore.get('contract.currency');
				if (session_currency)
				{
					return session_currency;
				}
				return;
			},
			get_setting_or_param: function (setting_name, param_name)
			{
				var saved_param = LocalStore.get(setting_name);

				return saved_param;
			}
		};
	}()
}

