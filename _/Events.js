
import MultiEmitter from '@streetstrider/emitter/multi'


export default function Events ()
{
	var emitter = MultiEmitter()
	var emit    = emitter.emit

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

	return { on, emit }
}


function compose_disposer (dss)
{
	return () =>
	{
		if (! dss) return

		for (var ds of dss) ds()

		dss = null
	}
}
