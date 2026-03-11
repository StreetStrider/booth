
import once from './once.js'

import { Timeouted } from './timeout.js'


export default function when (emitter, key, timeout = 15e3)
{
	var p = new Promise(rs => once(emitter, key, rs))

	if ((timeout >= 0) && (timeout < Infinity))
	{
		p = Timeouted(p, timeout)
	}

	emitter = null
	return p
}
