
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

	return (fn /*, meta */) =>
	{
		if (options.load && options.dump)
		{
			return async (data, endp) =>
			{
				return dump(await fn(load(data), endp))
			}
		}
		else if (options.load)
		{
			return (data, endp) =>
			{
				return fn(load(data), endp)
			}
		}
		else if (options.dump)
		{
			return async (data, endp) =>
			{
				return dump(await fn(data, endp))
			}
		}
	}
}
