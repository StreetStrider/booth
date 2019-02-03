
import { Booth } from '.'
import { Endpoint } from '.'


//
Booth({ port: 9000 }, Protocol)

function Protocol (endp)
{
	endp.on(
	{
		hello (data)
		{
			console.log('←', data)

			data = data.toUpperCase() + '_' + data.toLowerCase()

			endp.send('hello', data)
			console.log('→', data)
		},
	})
}


//
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
