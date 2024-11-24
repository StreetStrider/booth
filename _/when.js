
import $Timeout from 'aux.js/async/timeout.js'
const Timeout = $Timeout.default

import once from './once.js'


export default function when (emitter, key, timeout = 5e3)
{
	timeout || (timeout = Infinity)

	if (timeout === Infinity)
	{
		try
		{
			return new Promise(rs => once(emitter, key, rs))
		}
		finally
		{
			emitter = null
		}
	}

	var ds
	var result = new Promise(rs =>
	{
		ds = once(emitter, key, rs)
	})

	try
	{
		return Promise.race([ result, Timeout(timeout) ])
		.finally(() =>
		{
			ds()
			ds = null
		})
	}
	finally
	{
		emitter = null
		result  = null
	}
}
