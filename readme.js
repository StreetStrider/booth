
import { Booth } from '.'
import { Endpoint } from '.'

/*
 * Booth(wss options, protocol)
 */
Booth({ port: 9000 },
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
 * Endpoint(ws options)
 * .on(event, handler)
 * .on({ event: handler })
 */
Endpoint('ws://localhost:9000')
.on(
{
	'@open' (endp)
	{
		endp.send('hello', 'Hello, World!')
	},
	hello (data, endp)
	{
		console.log('*', data)

		endp.close()
	},
	'@close' (/* endp */)
	{
		process.exit()
	},
})
