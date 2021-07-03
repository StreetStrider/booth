
import Events from './Events'

var noop = () => {}


export default function Endpoint (ws, booth)
{
	var
	ws_connect = ws
	ws = null

	var buffer = []

	if (booth)
	{
		var events = booth.events
	}
	else
	{
		var events = Events()
	}

	var endp =
	{
		on,
		send,
		close,
		aux: {},
	}

	function on (...args)
	{
		if (booth)
		{
			return noop
		}
		else if (events)
		{
			return events.on(...args)
		}
		else
		{
			return noop
		}
	}

	function send (kind, data = '')
	{
		if (buffer)
		{
			buffer.push([ kind, data ])
		}
		else if (ws)
		{
			ws.send('@' + kind + ':' + data)
		}
	}

	function handle (msg, endp)
	{
		if (typeof msg    !== 'string') return // TODO: binary, buffer
		if (msg.charAt(0) !== '@') return
		if (msg.charAt(1) === '@') return // special commands

		var colon = msg.indexOf(':')
		if (colon === -1) return

		var kind = msg.slice(1, colon)
		var data = msg.slice(colon + 1)

		events.emit(kind, data, endp)
	}

	function connect ()
	{
		ws = Ws(ws_connect)

		ev('message', ({ data }) => handle(data, endp))

		ev('open',   () => events.emit('@open',  void 0, endp))
		ev('close',  () => events.emit('@close', void 0, endp))
		ev('error', (e) => events.emit('@error',      e, endp))

		if (booth)
		{
			ev('close', cleanup)
		}
		else
		{
			ev('open',  flush)
			ev('close', reconnect_or_cleanup)
			ev('open',  check_reconnect)
		}

		function ev (name, handler)
		{
			ws.addEventListener(name, handler)
		}

		/* already opened in booth: */
		if (booth)
		{
			buffer = null
			events.emit('@open', void 0, endp)
		}
	}

	function flush ()
	{
		if (! buffer) { return }

		var
		bf = buffer
		buffer = null

		for (var pair of bf)
		{
			send(...pair)
		}
	}

	function reconnect_or_cleanup ()
	{
		if (! ws)
		{
			cleanup()
		}
		else
		{
			buffer = []
			ws = null

			setTimeout(connect, 1e3)
		}
	}

	function check_reconnect ()
	{
		if (check_reconnect.already)
		{
			events.emit('@reconnect', void 0, endp)
		}
		else
		{
			check_reconnect.already = true
		}
	}

	function close ()
	{
		if (ws)
		{
			ws.close()
			ws = null
		}
	}

	function cleanup ()
	{
		if (! endp) { return }

		ws = null
		ws_connect = null

		buffer = null
		events = null

		booth  = null
		endp   = null
	}

	return (connect(), endp)
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
