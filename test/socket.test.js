
import { Booth } from '..'
import { Endpoint } from '..'


console.log('WS')


/*
 * Booth(options: wss options)
 * .on(event, handler)
 * .on({ event: handler })
 */
var
booth = Booth({ port: 9000 })
booth.on(
{
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
endp = Endpoint('ws://localhost:9000')
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
	ok (/* data, endp */)
	{
		console.log('OK')
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
endp.send('ok')
