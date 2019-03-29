
import { unlinkSync as rm } from 'fs'

import { Server } from 'http'

import { Booth } from '..'
import { Endpoint } from '..'


var path = '/tmp/booth'
var ws_path = 'ws+unix://' + path

var server = new Server()
server.listen(path)


// rm(path)

Booth({ server })
.on(
{
	hello (data, endp)
	{
		console.log('←', data)

		data = data.toUpperCase() + '_' + data.toLowerCase()

		endp.send('hello', data)
		console.log('→', data)
	},
	'@close' ()
	{
		setTimeout(() =>
		{
			rm(path)

			setTimeout(() =>
			{
				process.exit()
			})
		})
	},
})


Endpoint(ws_path)
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
	},
})
