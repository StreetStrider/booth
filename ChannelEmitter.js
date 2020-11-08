
import Emitter from '@streetstrider/emitter'

export default function ChannelEmitter ()
{
	var channels = {}

	function on (eventname, fn)
	{
		var emitter = channels[eventname]

		if (! emitter)
		{
			emitter = channels[eventname] = Emitter()
		}

		var ds = emitter.on(fn)

		return () =>
		{
			if (! ds) { return }

			ds()
			ds = null
			fn = null

			if (emitter.is_empty())
			{
				delete channels[eventname]
			}

			eventname = null
			emitter = null
		}
	}

	function emit (eventname, ...args)
	{
		var emitter = channels[eventname]
		if (emitter)
		{
			emitter.emit(...args)
		}
	}

	return { on, emit }
}
