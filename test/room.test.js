
import console from 'console-ultimate'

import { expect } from 'chai'

import { Booth } from '..'
import { Endpoint } from '..'
import { Addr } from '..'

import wait from '../util/wait'

var addr = Addr.Websocket(9000)

console.log('WS', ...addr.view())


var count_all  = 0
var count_spec = 0


var
booth = Booth(addr.for_booth())
booth.rooms.get('@all')
booth.on(
{
	spec (yes, endp)
	{
		if (yes)
		{
			booth.rooms.get('@spec').join(endp)
		}

		endp.send('specd')
	},
})

async function Client (spec)
{
	var endp = Endpoint(addr.for_endpoint())

	await wait(endp, '@connect')

	endp.send('spec', spec || '')

	endp.on('count_all',  () => count_all++)
	endp.on('count_spec', () => count_spec++)

	await wait(endp, 'specd')

	return endp
}

async function test ()
{
	var clients =
	[
		await Client(),
		await Client(),
		await Client(true),
	]

	booth.rooms.get('@all').send('count_all')
	booth.rooms.get('@spec').send('count_spec')
	booth.close()

	await wait(clients[0], '@close')
	await wait(clients[1], '@close')
	await wait(clients[2], '@close')

	expect(count_all).eq(3)
	expect(count_spec).eq(1)
	process.exit()
}

test()
