/* eslint max-statements: [ 2, 23 ] */

import 'console-ultimate'

console.info('room.test')

import { expect } from 'chai'

import { Booth } from 'booth'
import { Endpoint } from 'booth'
import { Addr } from 'booth'

import { when } from 'booth'

import { Aof } from './kit.js'


var aof = Aof('room')

var addr = Addr.Websocket(9000)
console.log('WS', ...addr.view())

var
booth = Booth(addr.for_booth())
booth.rooms.get('@all')
booth.on(
{
	join_special (yes, endp)
	{
		if (yes)
		{
			booth.rooms.get('@special').join(endp)
		}

		endp.send('join_special$')
	},
})

async function Client (name: string, join_special?: string)
{
	var endp = Endpoint(addr.for_endpoint())

	await when(endp, '@connect')

	endp.send('join_special', (join_special || ''))

	endp.on('for_all',  () =>
	{
		aof.track('all', name)
	})
	endp.on('for_special', () =>
	{
		aof.track('special', name)
	})

	await when(endp, 'join_special$')

	return endp
}

function when_all (clients: any[], name: string)
{
	return Promise.all(clients.map(endp => when(endp, name)))
}


test()

async function test ()
{
	var clients = []

	clients.push(await Client('A'))
	clients.push(await Client('B'))

	var client_special = await Client('C', 'yes')
	clients.push(client_special)

	booth.rooms.get('@all').send('for_all')
	await when_all(clients, 'for_all')

	booth.rooms.get('@special').send('for_special')
	await when(client_special, 'for_special')

	booth.rooms.get('@all').each(endp => endp.close())
	await when_all(clients, '@reconnect')

	booth.rooms.get('@all').send('for_all')
	await when_all(clients, 'for_all')

	booth.rooms.get('@special').send('for_special')
	await null
	/* await nothing */

	for (var endp of clients)
	{
		endp.close()
	}

	aof.end()

	var v = aof.view()

	v.splice(0, 3, ...v.slice(0, 3).sort())
	v.splice(4, 7, ...v.slice(4, 7).sort())

	expect(v).deep.eq([
		[ 'all', 'A' ],
		[ 'all', 'B' ],
		[ 'all', 'C' ],
		[ 'special', 'C' ],
		[ 'all', 'A' ],
		[ 'all', 'B' ],
		[ 'all', 'C' ],
	])

	booth.close()
}
