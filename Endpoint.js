
import Emitter from 'nanoevents'

export default function Endpoint (ws)
{
	var _ = { ws }

	_.send = function send (kind, data)
	{
		ws.send('@' + kind + ':' + data)
	}

	var emitter = new Emitter

	_.on = function on (...args)
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

	ws.on('message', msg =>
	{
		if (typeof msg    !== 'string') return
		if (msg.charAt(0) !== '@') return

		var [ kind, data ] = msg.split(':', 2)

		kind = kind.slice(1)

		if (kind.charAt(0) === '@') return

		emitter.emit(kind, data)
	})

	_.close = () => ws.close()

	ws.on('open', () => emitter.emit('@open'))

	ws.on('close', () => emitter.emit('@close'))

	return _
}
