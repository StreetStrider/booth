
import { Server } from 'http'

import { Booth } from '..'
import { Endpoint } from '..'


console.log('UNIX')


var path = '/tmp/booth'
var ws_path = 'ws+unix://' + path

var server = new Server()
server.listen(path)


/*
 * Booth({ server: http server })
 * .on(event, handler)
 * .on({ event: handler })
 */
var
booth = Booth({ server })
booth.on(
{
	hello (data, endp)
	{
		console.log('←', data)

		data = data.toUpperCase() + '_' + data.toLowerCase()

		endp.send('hello', data)
		console.log('→', data)
	},
})


/*
 * Endpoint(ws_path: string)
 * .on(event, handler)
 * .on({ event: handler })
 */
var
endp = Endpoint(ws_path)
endp.on(
{
	'@open' (_, endp)
	{
		endp.send('hello', 'Hello, World!')
	},
	hello (data, endp)
	{
		console.log('*', data)

		endp.close()
	},
	'@close' (/* _, endp */)
	{
		setTimeout(() =>
		{
			process.exit()
		}
		, 2e3)
	},
})
