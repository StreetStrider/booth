
import Events from './Events'


export default function Endpoint (ws, booth)
{
	ws = Ws(ws)

	if (booth)
	{
		var events = booth.events

		var endp =
		{
			ws,
			booth,
			on () { return endp },
		}
	}
	else
	{
		var events = Events()

		var endp =
		{
			ws,
			on,
		}

		function on (...args)
		{
			events.on(...args)

			return endp
		}
	}

	endp.send = function send (kind, data)
	{
		ws.send('@' + kind + ':' + data)

		return endp
	}

	endp.close = function close ()
	{
		ws.close()
	}


	ws.addEventListener('message', (data) => events.handle(data, endp))

	ws.addEventListener('open',  () => events.emit('@open',  void 0, endp))
	ws.addEventListener('close', () => events.emit('@close', void 0, endp))

	ws.addEventListener('error', (e) => events.emit('@error', e, endp))

	ws.addEventListener('close', () =>
	{
		delete endp.ws
		delete endp.booth
		endp = null
	})


	if (booth)
	{
		setTimeout(() => events.emit('@open', void 0, endp))
	}


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
