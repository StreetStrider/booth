
import is_plain from 'is-plain-obj'

import Events from './_/Events.js'
import Rooms  from './_/Rooms.js'

import Endpoint from './Endpoint.js'


export default function Dispatch (wss)
{
	wss = Wss(wss)

	var events = Events()

	var dispatch =
	{
		on,
		close,

		rooms: Rooms(),
	}

	wss.on('connection', (ws) => Endpoint(null, null, { ws, dispatch, events }))

	function on (...args)
	{
		if (events)
		{
			return events.on(...args)
		}
		else
		{
			return () => {}
		}
	}

	function close ()
	{
		if (! dispatch) return

		wss.close()

		events = null
		wss    = null
		dispatch  = null
	}

	return dispatch
}


//
import { WebSocketServer } from 'ws'

function Wss (wss)
{
	if (is_plain(wss))
	{
		return new WebSocketServer(wss)
	}

	return wss
}
