
import ws from 'ws'

var Client = ws
var Server = ws.Server

import { Endpoint } from '.'

console.log(Server)
console.log(Endpoint)

var wss = new Server({ port: 9000 })

wss.on('connection', (ws) =>
{
	var endp = Endpoint(ws)

	endp.recv((kind, data) =>
	{
		console.log('←', kind, ':', data)

		if (kind === 'hello')
		{
			defer(() =>
			{
				send('hello', data.toUpperCase() + '_' + data.toLowerCase())
			})
		}
	})

	function send (kind, data)
	{
		endp.send(kind, data)
		console.log('→', kind, ':', data)
	}

	endp.ws.on('close', () => wss.close())
})


var endp = Endpoint(new Client('ws://localhost:9000'))

endp.ws.on('open', () =>
{
	endp.send('hello', 'Hello, World!')
})
endp.recv((kind, data) =>
{
	console.log('*', kind, ':', data)

	console.log(endp.close)
	endp.close()
})


function defer (fn)
{
	setTimeout(fn, 500)
}
