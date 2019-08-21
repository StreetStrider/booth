// hard copy of Endpoint.js
// https://github.com/rollup/rollup-plugin-node-resolve/issues/177

import Events from './Events'


export default function Endpoint (ws, booth)
{
	var endp =
	{
		ws: null,
		on () { return endp },
		send,
		close,
	}

	var buffer = []

	if (booth)
	{
		var events = booth.events
	}
	else
	{
		var events = Events()

		endp.on = function on (...args)
		{
			events.on(...args)

			return endp
		}
	}

	function send (kind, data = '')
	{
		if (buffer)
		{
			buffer.push([ kind, data ])
		}
		else if (endp.ws)
		{
			endp.ws.send('@' + kind + ':' + data)
		}

		return endp
	}


	function connect ()
	{
		if (endp.ws)
		{
			endp.ws.close()
		}

		endp.ws = Ws(ws)

		ev('message', (data) => events.handle(data, endp))

		ev('open',   () => events.emit('@open',  void 0, endp))
		ev('close',  () => events.emit('@close', void 0, endp))
		ev('error', (e) => events.emit('@error',      e, endp))

		if (booth)
		{
			ev('close', close)
		}
		else
		{
			ev('open', flush)
			ev('close', reconnect)
		}

		function ev (name, handler)
		{
			endp.ws.addEventListener(name, handler)
		}

		if (booth)
		{
			buffer = null
			events.emit('@open', void 0, endp)
		}
	}

	function flush ()
	{
		if (! buffer) return

		var bf = buffer
		buffer = null

		bf.forEach(pair =>
		{
			send(...pair)
		})
	}

	function reconnect ()
	{
		if (! endp) return

		buffer = []
		endp.ws = null

		setTimeout(connect, 1e3)
	}

	function close ()
	{
		if (! endp) return

		endp.ws && endp.ws.close()
		delete endp.ws

		buffer = null

		booth  = null
		endp   = null
		// events = null
	}


	return connect(), endp
}


var Client = window.WebSocket

function Ws (ws)
{
	if (typeof ws === 'string')
	{
		return new Client(ws)
	}

	return ws
}
