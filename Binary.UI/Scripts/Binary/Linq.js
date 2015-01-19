var linq =
{
	iterate: function (arrayOrObject, fn)
	{
		if (typeof arrayOrObject == typeof [])
		{
			for (var i = 0; i < arrayOrObject.length; i++)
			{
				if (fn(arrayOrObject[i]) === false) break;
			}
		}
		else
		{
			for (var p in arrayOrObject)
			{
				fn(arrayOrObject[p]);
			}
		}
	},
	any: function (obj, fn)
	{
		var result = false;
		window.linq.iterate(obj, function (item)
		{
			if (result = fn(item)) return false;
		});
		return result;
	},
	first: function (obj, fn)
	{
		var result = null;
		window.linq.iterate(obj, function (item)
		{
			if (fn(item))
			{
				result = item;
				return false;
			}
		});
		return result;
	}
};
