
var noop = () => {}

import Events from './Events'


export default function Endpoint (ws, booth)
{
	ws = Ws(ws)

	if (booth)
	{
		var endp = { ws, booth }
		var events = booth.events
		endp.on = noop
	}
	else
	{
		var endp = { ws }

		var events = Events(endp)

		endp.on = function on (...args)
		{
			events.on(...args)

			return endp
		}
	}

	endp.send = function send (kind, data)
	{
		ws.send('@' + kind + ':' + data)
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
