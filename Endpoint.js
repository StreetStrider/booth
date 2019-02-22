
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

		return endp
	}

	ws.addEventListener('message', ({ data: msg }) =>
	{
		if (typeof msg    !== 'string') return
		if (msg.charAt(0) !== '@') return
		if (msg.charAt(1) === '@') return

		var colon = msg.indexOf(':')
		if (colon === -1) return

		var kind = msg.slice(1, colon)
		var data = msg.slice(colon + 1)

		emitter.emit(kind, data, endp)
	})

	endp.close = () => ws.close()

	ws.addEventListener('error', (e) => emitter.emit('@error', e, endp))

	ws.addEventListener('open',  () => emitter.emit('@open',  void 0, endp))

	ws.addEventListener('close', () => emitter.emit('@close', void 0, endp))
	ws.addEventListener('close', () =>
	{
		endp.ws = null
		endp.booth = null
		endp = null
	})

	return endp
}


import Client from 'isomorphic-ws'

function Ws (ws)
{
	if (typeof ws === 'string')
	{
		return new Client(ws)
	}

	return ws
}
