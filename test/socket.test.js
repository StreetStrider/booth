
import { Booth } from '..'
import { Endpoint } from '..'


/*
 * Booth(options: wss options)
 * .on(event, handler)
 * .on({ event: handler })
 */
Booth({ port: 9000 })
.on(
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
 * Endpoint(uri: string (ws options))
 * .on(event, handler)
 * .on({ event: handler })
 */
Endpoint('ws://localhost:9000')
.on(
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
		process.exit()
	},
})
