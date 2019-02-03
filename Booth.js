
import Endpoint from './Endpoint'

export default function Booth (wss, protocol)
{
	var booth = { wss }

	wss.on('connection', (ws) =>
	{
		var endp = Endpoint(ws, { booth })

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
