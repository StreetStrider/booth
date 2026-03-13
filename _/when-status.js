// TBD: option.timeout = 5e3
// TBD: option.strict = true

import * as status from '../status.js'

import when from './when.js'


export async function when_connected (endp)
{
	if (endp.status() === status.OPEN)
	{
		return
	}
	if (endp.status() !== status.CONNECTING)
	{
		throw new TypeError('must_be_connecting')
	}

	var on_connect = when(endp, '@connect')
	var on_error   = when(endp, '@error').then(e => { throw e })

	await Promise.race([ on_connect, on_error ])
}


/*
export async function when_closed (endp)
{
	if (endp.status() === status.CLOSED)
	{
		return
	}
	if (endp.status() !== status.CLOSING)
	{
		throw new TypeError('must_be_connecting')
	}

	await when(endp, '@close')
}
*/
