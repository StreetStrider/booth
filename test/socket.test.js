
import { Booth } from '..'
import { Endpoint } from '..'
import { Addr } from '..'


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
	try (_, endp)
	{
		console.log('try')
		endp.close()
	},
	hello (data, endp)
	{
		console.log('←', data)

		data = data.toUpperCase() + '_' + data.toLowerCase()

		endp.send('hello', data)
		console.log('→', data)
	},
	ok (_, endp)
	{
		endp.send('ok')
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
	'@reconnect' (_, endp)
	{
		console.log('RECONNECT')
		endp.send('hello', 'Hello, World!')
	},
	hello (data, endp)
	{
		console.log('*', data)

		endp.close()

		setTimeout(() =>
		{
			process.exit()
		}
		, 2e3)
	},
	ok (/* data, endp */)
	{
		console.log('OK')

		endp.send('try')
	},
	'@close' (/* _, endp */)
	{
		console.log('END\n')
	},
})
endp.send('ok')
