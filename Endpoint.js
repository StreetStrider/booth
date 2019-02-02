
export default function Endpoint (ws)
{
	var _ = { ws }

	_.send = function send (kind, data)
	{
		ws.send('@' + kind + ':' + data)
	}

	var h = []

	_.recv = function recv (fn)
	{
		h.push(fn)
	}

	_.close = () => ws.close()

	ws.on('message', msg =>
	{
		if (typeof msg    !== 'string') return
		if (msg.charAt(0) !== '@') return

		var [ kind, data ] = msg.split(':', 2)

		kind = kind.slice(1)

		if (kind.charAt(0) === '@') return

		h.forEach(fn => fn(kind, data))
	})

	return _
}
