
import Events from './Events'


export default function Endpoint (ws, booth)
{
	if (booth)
	{
		var events = booth.events

		var endp =
		{
			ws: null,
			booth,
			on () { return endp },
		}
	}
	else
	{
		var events = Events()

		var endp =
		{
			ws: null,
			on,
		}

		function on (...args)
		{
			events.on(...args)

			return endp
		}
	}


	function connect ()
	{
		endp.ws && endp.ws.close()

		endp.ws = Ws(ws)

		endp.ws.addEventListener('message', (data) => events.handle(data, endp))

		endp.ws.addEventListener('open',  () => events.emit('@open',  void 0, endp))
		endp.ws.addEventListener('close', () => events.emit('@close', void 0, endp))

		endp.ws.addEventListener('error', (e) => events.emit('@error', e, endp))

		endp.ws.addEventListener('close', reconnect)

		if (booth)
		{
			setTimeout(() => events.emit('@open', void 0, endp))
		}
	}

	function reconnect ()
	{
		if (booth) return

		if (! endp) return

		endp.ws = null

		setTimeout(connect, 1e3)
	}


	endp.send = function send (kind, data)
	{
		endp.ws.send('@' + kind + ':' + data)

		return endp
	}

	endp.close = function close ()
	{
		if (! endp.ws) return

		endp.ws.close()

		delete endp.booth
		delete endp.ws

		endp = null
	}

	connect()

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
