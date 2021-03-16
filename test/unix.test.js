
import { Server } from 'http'

import { Booth } from '..'
import { Endpoint } from '..'
import { Addr } from '..'


var addr = Addr.Unix('/tmp/booth')

console.log('UNIX', ...addr.view())


var server = new Server()
server.listen(addr.for_booth())


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
	'@error' (e)
	{
		console.error('UNIX/Booth', e.message)
		console.error(e.error)
		process.exit(1)
	},
})


/*
 * Endpoint(ws_path: string)
 * .on(event, handler)
 * .on({ event: handler })
 */
var
endp = Endpoint(addr.for_endpoint())
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
		console.log('END\n')

		setTimeout(() =>
		{
			process.exit()
		}
		, 2e3)
	},
	'@error' (e)
	{
		console.error('UNIX/Endpoint', e.message)
		console.error(e.error)
		process.exit(1)
	},
})
