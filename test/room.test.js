
import console from 'console-ultimate'

import { expect } from 'chai'

import { Booth } from '..'
import { Endpoint } from '..'
import { Addr } from '..'

import { when } from '..'

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

	await when(endp, '@connect')

	endp.send('spec', spec || '')

	endp.on('count_all',  () =>
	{
		count_all++
	})
	endp.on('count_spec', () =>
	{
		count_spec++
	})

	await when(endp, 'specd')

	return endp
}

async function test ()
{
	await Client()
	await Client()
	await Client(true)

	booth.rooms.get('@spec').send('count_spec')
	booth.rooms.get('@all').send('count_all')
	await timeout(1000)

	expect(count_all).eq(3)
	expect(count_spec).eq(1)

	booth.rooms.get('@all').each(endp => endp.close())
	await timeout(2000)

	booth.rooms.get('@spec').send('count_spec')
	booth.rooms.get('@all').send('count_all')
	await timeout(1000)

	expect(count_all).eq(6)
	expect(count_spec).eq(1) /* was not joined automatically */

	process.exit()
}

test()

function timeout (ms)
{
	return new Promise(rs => setTimeout(rs, ms))
}
