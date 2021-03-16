
import MultiEmitter from '@streetstrider/emitter/multi'


export default function Events ()
{
	var emitter = MultiEmitter()
	var emit = emitter.emit

	function on (...args)
	{
		if (args.length === 1)
		{
			var map = args[0]
			var dss = []

			for (var key in map)
			{
				dss.push(emitter.on(key, map[key]))
			}

			return compose_disposer(dss)
		}
		else if (args.length === 2)
		{
			return emitter.on(args[0], args[1])
		}
	}

	function handle ({ data: msg }, endp)
	{
		if (typeof msg    !== 'string') return // TODO: binary, buffer
		if (msg.charAt(0) !== '@') return
		if (msg.charAt(1) === '@') return

		var colon = msg.indexOf(':')
		if (colon === -1) return

		var kind = msg.slice(1, colon)
		var data = msg.slice(colon + 1)

		emitter.emit(kind, data, endp)
	}

	return { on, emit, handle }
}


function compose_disposer (dss)
{
	// eslint-disable-next-line complexity
	return () =>
	{
		if (! dss) { return }

		var e

		for (var ds of dss)
		{
			try
			{
				ds()
			}
			catch (ds_e)
			{
				e || (e = ds_e)
			}
		}

		dss = null

		if (e)
		{
			throw e
		}
	}
}
