
import 'console-ultimate'

console.info('error.test')

import { expect } from 'chai'

import { Dispatch } from 'booth'
import { Endpoint } from 'booth'
import { Addr } from 'booth'

import Compose from 'booth/midw/compose'
import safe from 'booth/midw/safe'

import { Aof } from './kit.js'


var aof = Aof('errortest', () =>
[
	[ 1, 'expected_foo1' ],
	[ 2, 'expected_foo2' ],
	[ 3, 'expected_foo3' ],
],
() =>
{
	endp.close()
	dispatch.close()
})

var addr = Addr.Websocket(9000)
console.log('ERRORTEST', ...addr.view())

var errors = 0

function expected_error (info: any)
{
	errors++

	expect(info).an('object')
	expect(info.error instanceof Error).eq(true)
	// expect(info.meta.name).match(/^foo\d$/)

	expect(info.fn).a('function')
	// expect(info.fn.name).eq(info.meta.name)
	// expect(info.error.message).eq(`expected_${ info.meta.name }`)

	aof.track(errors, info.error.message)

	if (errors === 3)
	{
		aof.end_check()
	}
}


var
dispatch = Dispatch(addr.for_dispatch())
dispatch.on(
{
	...Compose(safe(expected_error)).over(
	{
		foo1 (/* _, endp */) { endp.send('foo2'); throw new Error('expected_foo1') },
		foo2 (/* _, endp */) { endp.send('foo3'); throw new Error('expected_foo2') },
		foo3 (/* _, endp */) { throw new Error('expected_foo3') },
	}),
})

var
endp = Endpoint(addr.for_endpoint())
endp.send('foo1')
