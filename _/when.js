
import once from './once.js'

import { Timeouted } from './timeout.js'


export default function when (emitter, key, timeout = 5e3)
{
	timeout ||= Infinity

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
		return Timeouted(result, timeout)
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
