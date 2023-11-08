
import is_plain from 'is-plain-obj'

import Events from './_/Events'
import Rooms  from './_/Rooms'

import Endpoint from './Endpoint'


export default function Booth (wss)
{
	wss = Wss(wss)

	var events = Events()

	var booth =
	{
		on,
		close,

		rooms: Rooms(),
	}

	wss.on('connection', (ws) => Endpoint(ws, { booth, events }))

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
		if (! booth) return

		wss.close()

		events = null
		wss    = null
		booth  = null
	}

	return booth
}


// *
import { WebSocketServer } from 'ws'

function Wss (wss)
{
	if (is_plain(wss))
	{
		return new WebSocketServer(wss)
	}

	return wss
}
