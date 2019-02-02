
import Client, { Server } from 'ws'

import { Booth } from '.'
import { Endpoint } from '.'


//
var wss = new Booth(new Server({ port: 9000 }), Protocol)

function Protocol (endp, booth)
{
	endp.on(
	{
		hello (data)
		{
			console.log('←', data)

			data = data.toUpperCase() + '_' + data.toLowerCase()

			endp.send('hello', data)
			console.log('→', data)

			booth.close()
		}
	})
}


//
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
