
import ws from 'ws'

var Client = ws
var Server = ws.Server

import { Endpoint } from '.'


var wss = new Server({ port: 9000 })

wss.on('connection', (ws) =>
{
	var endp = Endpoint(ws)

	endp.on('hello', data =>
	{
		console.log('←', data)

		defer(() =>
		{
			send('hello', data.toUpperCase() + '_' + data.toLowerCase())
		})
	})

	function send (kind, data)
	{
		endp.send(kind, data)
		console.log('→', data)
	}

	endp.ws.on('close', () => wss.close())
})


var endp = Endpoint(new Client('ws://localhost:9000'))

endp.ws.on('open', () =>
{
	endp.send('hello', 'Hello, World!')
})
endp.on('hello', data =>
{
	console.log('*', data)

	endp.close()
})


function defer (fn)
{
	setTimeout(fn, 500)
}
