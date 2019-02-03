
import Emitter from 'nanoevents'

export default function Endpoint (ws, booth)
{
	ws = Ws(ws)

	var endp = { ws, booth }

	endp.send = function send (kind, data)
	{
		ws.send('@' + kind + ':' + data)
	}

	var emitter = new Emitter

	endp.on = function on (...args)
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

		emitter.emit(kind, data, endp)
	})

	endp.close = () => ws.close()

	ws.on('open', () => emitter.emit('@open', endp))

	ws.on('close', () => emitter.emit('@close', endp))

	return endp
}


import Client from 'ws'

function Ws (ws)
{
	if (typeof ws === 'string')
	{
		return new Client(ws)
	}

	return ws
}
