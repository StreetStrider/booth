
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
		if (endp.ws)
		{
			endp.ws.close()
		}

		endp.ws = Ws(ws)

		ev('message', (data) => events.handle(data, endp))

		ev('open',   () => events.emit('@open',  void 0, endp))
		ev('close',  () => events.emit('@close', void 0, endp))
		ev('error', (e) => events.emit('@error',      e, endp))

		ev('close', reconnect)

		if (booth)
		{
			setTimeout(() => events.emit('@open', void 0, endp))
		}

		function ev (name, handler)
		{
			endp.ws.addEventListener(name, handler)
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
		if (! endp) return
		if (! endp.ws) return

		endp.ws.close()

		delete endp.ws
		delete endp.booth

		endp = null
	}

	connect()

	return endp
}


// TODO: fix usage
// https://github.com/rollup/rollup-plugin-node-resolve/issues/177
// import Client from 'isomorphic-ws'
// var Client = window.WebSocket

if (typeof window !== 'undefined')
{
	var Client = window.WebSocket
}
else
{
	var Client = require('isomorphic-ws')
}

function Ws (ws)
{
	if (typeof ws === 'string')
	{
		return new Client(ws)
	}

	return ws
}
