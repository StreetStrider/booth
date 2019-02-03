
import Endpoint from './Endpoint'

export default function Booth (wss, protocol)
{
	wss = Wss(wss)

	var booth = { wss }

	wss.on('connection', (ws) =>
	{
		var endp = Endpoint(ws, booth)

		if (! protocol)
		{
			return
		}
		else if (typeof protocol === 'function')
		{
			protocol(endp)
		}
		else if (typeof protocol === 'object')
		{
			endp.on(protocol)
		}
	})

	booth.close = () => wss.close()

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
