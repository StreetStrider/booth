
import noop from 'aux.js/noop'

import Events from './_/Events'


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
			buffer.push([ kind, (data || '') ])
		}
		else if (ws)
		{
			ws.send('@' + kind + ':' + data)
		}
	}

	function handle (event)
	{
		var msg = event.data

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
		// TODO: Transport()
		ws = Ws(ws_connect)

		ev('message', handle)

		ev('open',   () => events.emit('@open',  void 0, endp))
		ev('close',  () => events.emit('@close', void 0, endp))
		ev('error', (e) => events.emit('@error',      e, endp))

		/* must be done after user events */
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

		/* instantly opened in booth */
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

		var bf = buffer; (buffer = null)

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
		if (! check_reconnect.yes)
		{
			check_reconnect.yes = true

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


// *
import Client from 'isomorphic-ws'

// TODO: Transport()
function Ws (ws)
{
	if (typeof ws === 'string')
	{
		return new Client(ws)
	}

	return ws
}
