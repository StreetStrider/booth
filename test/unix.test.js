
console.info('unix.test')

import console from 'console-ultimate'

import { expect } from 'chai'

import { Server } from 'http'

import { Booth } from '..'
import { Endpoint } from '..'
import { Addr } from '..'


var addr = Addr.Unix('/tmp/booth')

console.log('UNIX', ...addr.view())

var buffer = []
function track (...args)
{
	var [ n ] = args

	buffer.push(n)
	console.log(...args)
}


var server = new Server().listen(addr.for_booth())


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
		track(2, data)

		data = data.toUpperCase() + '_' + data.toLowerCase()

		endp.send('hello', data)
		track(3, data)
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
		track(1)
	},
	hello (data, endp)
	{
		track(4, data)

		endp.close()
	},
	'@close' (/* _, endp */)
	{
		track('END 4', '\n')

		setTimeout(() =>
		{
			expect(buffer).deep.eq([ 1, 2, 3, 4, 'END 4' ])

			server.close()
		}
		, 1e3)
	},
	'@error' (e)
	{
		console.error('UNIX/Endpoint', e.message)
		console.error(e.error)
		process.exit(1)
	},
})
