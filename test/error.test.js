
console.info('error.test')

import console from 'console-ultimate'

import { expect } from 'chai'

import { Booth } from '..'
import { Endpoint } from '..'
import { Addr } from '..'

import { compose_every } from '../midw/compose'
import safe from '../midw/safe'
// import json from '../midw/json'
// import recoil from '../midw/recoil'

var addr = Addr.Websocket(9000)

var errors = 0

function expected_error (info)
{
	errors++

	expect(info).an('object')
	expect(info.error instanceof Error).eq(true)
	expect(info.meta.name).match(/^foo\d$/)

	expect(info.fn).a('function')
	expect(info.fn.name).eq(info.meta.name)
	expect(info.error.message).eq(`expected_${ info.meta.name }`)

	if (errors === 3)
	{
		process.exit()
	}
}

Booth(addr.for_booth())
.on(
{
	...compose_every(safe(expected_error),
	{
		foo1 (/* _, endp */) { throw new Error('expected_foo1') },
		foo2 (/* _, endp */) { throw new Error('expected_foo2') },
		foo3 (/* _, endp */) { throw new Error('expected_foo3') },
	}),
})

var
endp = Endpoint(addr.for_endpoint())
endp.send('foo1')
endp.send('foo2')
endp.send('foo3')
