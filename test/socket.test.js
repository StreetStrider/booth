
import console from 'console-ultimate'

import { Booth } from '..'
import { Endpoint } from '..'
import { Addr } from '..'

import compose from '../util/compose'
import safe from '../util/safe'
import recoil from '../util/recoil'

var addr = Addr.Websocket(9000)

console.log('WS', ...addr.view())


/*
 * Booth(options: wss options)
 * .on(event, handler)
 * .on({ event: handler })
 */
var
booth = Booth(addr.for_booth())
booth.on(
{
	ok (_, endp)
	{
		console.log(1)
		endp.send('ok')
	},
	try (_, endp)
	{
		console.log(3)
		endp.close()
	},
	hello (data, endp)
	{
		console.log(5, data)

		data = data.toUpperCase() + '_' + data.toLowerCase()

		endp.send('hello', data)
		console.log(6, data)
	},

	...compose('expected-error', safe(), () =>
	{
		throw new Error('foo')
	}),
	...compose('req', safe(), recoil(), (data) =>
	{
		console.log(8, data)

		return new Promise(rs =>
		{
			setTimeout(() => rs(data.toUpperCase()))
		}
		, 0)
	}),
	'@error' (e)
	{
		console.error('WS/Booth', e.message)
		console.error(e.error)
		process.exit(1)
	},
})


/*
 * Endpoint(uri: string (ws options))
 * .on(event, handler)
 * .on({ event: handler })
 */
var
endp = Endpoint(addr.for_endpoint())
endp.on(
{
	'@open' (/* _, endp */)
	{
	},
	ok (/* data, endp */)
	{
		console.log(2)

		endp.send('try')
	},
	'@reconnect' (_, endp)
	{
		console.log(4)
		endp.send('hello', 'Hello, World!')
		endp.send('expected-error', 'Hello, World!')
	},
	hello (data, endp)
	{
		console.log(7, data)

		endp.send('req', 'request')
	},
	req (data, endp)
	{
		console.log(9, data)

		endp.close()

		setTimeout(() =>
		{
			process.exit()
		}
		, 2e3)
	},
	'@close' (/* _, endp */)
	{
		console.log('END\n')
	},
	'@error' (e)
	{
		console.error('WS/Endpoint', e.message)
		console.error(e.error)
		process.exit(1)
	},
})
endp.send('ok')
