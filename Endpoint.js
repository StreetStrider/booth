
import Ws from 'isomorphic-ws'

/* import { version } from './package.json' with { type: 'json' } */
var version = '0.16'

import Events from './_/Events.js'
import Websocket from './transport/Websocket.js'


var defaults =
{
	should_reconnect: void 0,
	reconnect_interval: 1e3,
}


export default function Endpoint (transport, options, { ws, dispatch, events } = {})
{
	options = { ...defaults, ...options }

	events ??= Events()

	var $buffer = null
	if (! dispatch)
	{
		$buffer = []
	}

	var $ws
	if (dispatch)
	{
		$ws = ws
		ws = null
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
		if (dispatch)
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

	function send (key, data = '')
	{
		if ($buffer)
		{
			$buffer.push([ key, (data || '') ])
		}
		else if ($ws)
		{
			if (typeof key === 'string')
			{
				$ws.send(`@${ key }:${ String(data) }`)
			}
			else
			{
				send_binary(key)
			}
		}
	}

	async function send_binary (msg)
	{
		if ($ws instanceof Ws)
		{
			$ws.send(msg)
			return
		}
		if ($ws.capabilities?.binary)
		{
			$ws.send(msg)
			return
		}

		/* TODO: impl binary emulation */
		throw new TypeError('binary_not_supported')
	}

	function recv (event)
	{
		var msg = event.data

		events.emit('@recv', msg, { endp })

		if (typeof msg    !== 'string') return recv_binary(msg)
		if (msg.charAt(0) !== '@') return
		if (msg.charAt(1) === '@') return

		var colon = msg.indexOf(':')
		if (colon === -1) return

		var key  = msg.slice(1, colon)
		var data = msg.slice(colon + 1)

		var meta = { key, msg, data, endp }

		events.emit(key, data, meta)
	}

	function recv_binary (msg)
	{
		var key = '@binary'

		var data = msg
		var meta = { key, msg, data, endp }

		events.emit(key, data, meta)
	}

	function connect () /* eslint-disable-line complexity */
	{
		if (! dispatch)
		{
			if (typeof transport === 'function')
			{
				$ws = transport()
			}
			else if (typeof transport === 'string')
			{
				$ws = Websocket(transport)
			}
			else
			{
				throw new TypeError('unknown_transport')
			}
		}

		/* #1 */
		if (! dispatch)
		{
			ev('open', on_endp_open)
		}
		else
		{
			ev('open', () => events.emit('@open', void 0, { endp }))
		}

		/* #2 */
		ev('close',  () => events.emit('@close', void 0, { endp }))
		ev('error', (e) => events.emit('@error',      e, { endp }))

		ev('message', recv)

		/* #3 */
		if (! dispatch)
		{
			ev('close', reconnect_or_cleanup)
		}
		else
		{
			ev('close', cleanup)
		}

		function ev (name, handler)
		{
			$ws.addEventListener(name, handler)
		}

		/* instantly opened when under Dispatch */
		if (dispatch)
		{
			events.emit('@open',    void 0, { endp })
			events.emit('@connect', void 0, { endp })

			dispatch.rooms.join_if_any('@all', endp)

			$ws.send(`@@booth:${ version }`)
		}
	}

	async function on_endp_open ()
	{
		$ws.send(`@@booth:${ version }:endp`)

		events.emit('@open',  void 0, { endp })

		/* TBD: custom check here */

		flush()
		on_connect_or_reconnect()
	}

	function flush ()
	{
		if (! $buffer) return

		var to_flush = $buffer
		$buffer = null

		for (var pair of to_flush)
		{
			send(...pair)
		}
	}

	var been_connected = false
	function on_connect_or_reconnect ()
	{
		if (! been_connected)
		{
			been_connected = true

			events.emit('@connect',   void 0, { endp })
		}
		else
		{
			events.emit('@reconnect', void 0, { endp })
		}
	}

	/* TODO: reconnect() as a method? */
	function reconnect_or_cleanup ()
	{
		if (! $ws)
		{
			cleanup()
			return
		}
		if (! should_reconnect())
		{
			cleanup()
			return
		}

		$buffer = []
		$ws = null

		setTimeout(connect, options.reconnect_interval)
	}

	function should_reconnect ()
	{
		if (options.should_reconnect !== void 0)
		{
			return options.should_reconnect
		}

		if ($ws instanceof Ws)
		{
			return true
		}

		return ($ws?.capabilities?.reconnect ?? true)
	}

	function close ()
	{
		if (! $ws) return

		$ws.close()
		$ws = null
	}

	function cleanup ()
	{
		if (! endp) return

		if (dispatch)
		{
			dispatch.rooms.leave_every(endp)
		}

		$buffer = null
		$ws = null

		dispatch = null
		events = null

		endp = null
	}

	return (connect(), endp)
}
