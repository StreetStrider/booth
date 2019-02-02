
import Endpoint from './Endpoint'

export default function Booth (wss, protocol)
{
	var _ = { wss }

	wss.on('connection', (ws) =>
	{
		var endp = Endpoint(ws)

		if (! protocol)
		{
			return
		}
		else if (typeof protocol === 'function')
		{
			protocol(endp, _)
		}
		else if (typeof protocol === 'object')
		{
			endp.on(protocol)
		}
	})

	_.close = () => wss.close()

	return _
}
