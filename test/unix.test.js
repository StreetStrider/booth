
console.info('unix.test')

import console from 'console-ultimate'

import { expect } from 'chai'

import { join } from 'path'
import { Server } from 'http'

import { Booth } from '..'
import { Endpoint } from '..'
import { Addr } from '..'

import { tmp } from './kit'
import { Aof } from './kit'


var aof = Aof('unix', () =>
[
	[ 1 ],
	[ 2, '>', 'Hello, World!' ],
	[ 3, '<', 'HELLO, WORLD!_hello, world!' ],
	[ 4, 'HELLO, WORLD!_hello, world!' ],
],
() =>
{
	endp.close()
	server.close()
})

var addr = Addr.Unix(join(tmp, 'unix.sock'))
console.log('UNIX', ...addr.view())


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
		aof.track(2, '>', data)

		data = data.toUpperCase() + '_' + data.toLowerCase()

		endp.send('hello', data)

		aof.track(3, '<', data)
	},
	'@error' ()
	{
		expect.fail()
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

		aof.track(1)
	},
	hello (data /*, endp */)
	{
		aof.track(4, data)
		aof.end_check()
	},
	'@error' ()
	{
		expect.fail()
	},
})
