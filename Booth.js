
import Events from './Events'
import Endpoint from './Endpoint'

export default function Booth (wss)
{
	wss = Wss(wss)

	var booth = { wss }

	var events = booth.events = Events(booth)

	booth.on = function on (...args)
	{
		events.on(...args)

		return booth
	}

	booth.close = function close ()
	{
		wss.close()
	}


	wss.on('connection', (ws) =>
	{
		Endpoint(ws, booth)
	})


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
