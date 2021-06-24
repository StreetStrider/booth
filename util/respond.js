

export default function respond ()
{
	return (fn, meta) =>
	{
		var endps = Endps(fn, meta)

		return (data, endp) =>
		{
			return endps.handle(data, endp)
		}
	}
}


export const prefix =
{
	request:  'rq:',
	response: 'rs:',
}


function Endps (fn, meta)
{
	var endps = new WeakMap

	function get (endp)
	{
		var requests = endps.get(endp)
		if (requests)
		{
			return requests
		}

		var requests = Requests(fn)
		endps.set(endp, requests)
		return requests
	}

	// eslint-disable-next-line complexity
	async function handle (data, endp)
	{
		if (typeof data !== 'string') return
		if (! data.startsWith(prefix.request)) return

		data = data.slice(prefix.request.length)

		var colon = data.indexOf(':')
		if (colon === -1) return

		var
		id   = data.slice(1, colon)
		data = data.slice(colon + 1)

		id = Number(id)
		if (! Number.isInteger(id)) return

		var r = await get(endp).handle(id, data)

		if (r !== void 0)
		{
			endp.send(meta.name, `${ prefix.response }${ id }:${ data }`)
		}
	}

	return { handle }
}


function Requests (fn)
{
	var ids = Object.create(null)

	async function handle (id, data)
	{
		if (id in ids) return

		ids[id] = true

		try
		{
			return await race(fn(data), timeout(5000))
		}
		finally
		{
			delete ids[id]
		}
	}

	return { handle }
}

function race (a, b)
{
	return Promise.race([ a, b ])
}

function timeout (t)
{
	return new Promise(rs => setTimeout(() => rs(), t))
}
