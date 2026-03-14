// TBD: option.strict = true (specific statuses)


import * as status from '../status.js'

import when from './when.js'


export async function when_connected (endp, options)
{
	if (endp.status() === status.OPEN)
	{
		return
	}
	if (endp.status() !== status.CONNECTING)
	{
		throw new TypeError('must_be_connecting')
	}

	var timeout = (options?.timeout ?? 5e3)

	var on_connect = when(endp, '@connect', timeout)
	var on_error   = when(endp, '@error', timeout).then(e => { throw e })

	await Promise.race([ on_connect, on_error ])
}


/*
export async function when_closed (endp, options)
{
	if (endp.status() === status.CLOSED)
	{
		return
	}
	if (endp.status() !== status.CLOSING)
	{
		throw new TypeError('must_be_connecting')
	}

	// timeout

	await when(endp, '@close')
}
*/
