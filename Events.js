
import ChannelEmitter from './ChannelEmitter'


export default function Events ()
{
	var emitter = ChannelEmitter()

	var events =
	{
		on,
		emit,
		handle,
	}

	function on (...args)
	{
		if (args.length === 1)
		{
			let map = args[0]

			for (let key in map)
			{
				emitter.on(key, map[key])
			}
		}
		else if (args.length === 2)
		{
			emitter.on(args[0], args[1])
		}
	}

	function emit (...args)
	{
		emitter.emit(...args)
	}

	function handle ({ data: msg }, endp)
	{
		if (typeof msg    !== 'string') return
		if (msg.charAt(0) !== '@') return
		if (msg.charAt(1) === '@') return

		var colon = msg.indexOf(':')
		if (colon === -1) return

		var kind = msg.slice(1, colon)
		var data = msg.slice(colon + 1)

		emitter.emit(kind, data, endp)
	}

	return events
}
