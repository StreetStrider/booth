
import Events from './_/Events.js'
import Ws from './transport/Websocket.js'


export default function Endpoint (ws, { booth, events } = {})
{
	var ws_connect = ws; (ws = null)

	var buffer = null

	if (! booth)
	{
		events = Events()
		buffer = []
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
			return () => {}
		}
		else if (events)
		{
			return events.on(...args)
		}
		else
		{
			return () => {}
		}
	}

	function send (kind, data = '') /* eslint-disable-line complexity */
	{
		if (buffer)
		{
			buffer.push([ kind, (data || '') ])
		}
		else if (ws)
		{
			if (typeof kind === 'string')
			{
				ws.send(`@${ kind }:${ String(data) }`)
			}
			else
			{
				ws.send(kind)
			}
		}
	}

	function handle (event)
	{
		var msg = event.data

		if (typeof msg    !== 'string') return handle_binary(msg)
		if (msg.charAt(0) !== '@') return
		if (msg.charAt(1) === '@') return

		var colon = msg.indexOf(':')
		if (colon === -1) return

		var kind = msg.slice(1, colon)
		var data = msg.slice(colon + 1)

		events.emit(kind, data, endp)
	}

	function handle_binary (data)
	{
		events.emit('@binary', data, endp)
	}

	function connect ()
	{
		// TODO: Transport()
		if (typeof ws_connect === 'string')
		{
			ws = Ws(ws_connect)
		}
		else
		{
			ws = ws_connect
		}

		/* before user */
		if (! booth)
		{
			ev('open', flush)
		}

		ev('open',   () => events.emit('@open',  void 0, endp))
		ev('close',  () => events.emit('@close', void 0, endp))
		ev('error', (e) => events.emit('@error',      e, endp))

		ev('message', handle)

		/* after user */
		if (! booth)
		{
			ev('open',  connect_or_reconnect)
			ev('close', reconnect_or_cleanup)
		}
		else
		{
			ev('close', cleanup)
		}

		function ev (name, handler)
		{
			ws.addEventListener(name, handler)
		}

		/* instantly opened when in booth */
		if (booth)
		{
			events.emit('@open', void 0, endp)
			events.emit('@connect', void 0, endp)

			booth.rooms.join_if_any('@all', endp)
		}
	}

	function flush ()
	{
		if (! buffer) return

		var buffer_flush = buffer; (buffer = null)

		for (var pair of buffer_flush)
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

	function connect_or_reconnect ()
	{
		if (! connect_or_reconnect.yes)
		{
			connect_or_reconnect.yes = true

			events.emit('@connect', void 0, endp)
		}
		else
		{
			events.emit('@reconnect', void 0, endp)
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
		if (! endp) return

		if (booth)
		{
			booth.rooms.leave_every(endp)
		}

		ws = null
		ws_connect = null

		buffer = null
		events = null

		booth  = null
		endp   = null
	}

	return (connect(), endp)
}
