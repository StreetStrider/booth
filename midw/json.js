
var load = JSON.parse
var dump = JSON.stringify


var defaults =
{
	load: true,
	dump: true,
}

export default function json (options)
{
	options = { ...defaults, ...options }

	return (fn) =>
	{
		if (options.load && options.dump)
		{
			return async (data, meta) =>
			{
				return dump(await fn(load(data), meta))
			}
		}
		else if (options.load)
		{
			return (data, meta) =>
			{
				return fn(load(data), meta)
			}
		}
		else if (options.dump)
		{
			return async (data, meta) =>
			{
				return dump(await fn(data, meta))
			}
		}
	}
}
