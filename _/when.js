
import Timeout from 'aux.js/async/timeout'

import once from './once'


export default function when (emitter, key, timeout = 5e3)
{
	timeout || (timeout = Infinity)
	if (timeout === Infinity)
	{
		return new Promise(rs => once(emitter, key, rs))
	}

	var ds
	var result = new Promise(rs =>
	{
		ds = once(emitter, key, rs)
	})

	var wait = Promise.race([ result, Timeout(timeout) ])

	wait.finally(ds)

	return wait
}
