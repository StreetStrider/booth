
import once from './once.js'

import { Timeouted as Timeout } from './timeout.js'


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
		var p = Timeout(result, timeout)
		var timer = p.timer

		p = p.finally(() =>
		{
			ds()
			ds = null
		})
		p.timer = timer

		return p
	}
	finally
	{
		emitter = null
		result  = null
	}
}
