
import Events from './Events'
import Endpoint from './Endpoint'
import Rooms from './room/Rooms'


export default function Booth (wss)
{
	wss = Wss(wss)

	var events = Events()

	var booth =
	{
		events,

		on,
		close,

		rooms: Rooms(),
	}

	wss.on('connection', (ws) => Endpoint(ws, booth))

	function on (...args)
	{
		events.on(...args)

		return booth
	}

	function close ()
	{
		if (! wss) return

		wss.close()

		events = null
		wss = null
	}

	return booth
}


import { Server } from 'ws'

function Wss (wss)
{
	if (is_plain(wss))
	{
		return new Server(wss)
	}

	return wss
}

function is_plain (object)
{
	return (Object.getPrototypeOf(object) === Object.prototype)
}
