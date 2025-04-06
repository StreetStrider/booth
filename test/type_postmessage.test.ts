
import 'console-ultimate'

console.info('postmessage.test')

import { Worker } from 'node:worker_threads'
import { isMainThread as is_main } from 'node:worker_threads'
import { parentPort } from 'node:worker_threads'

import { Endpoint } from 'booth'
import Postmessage from 'booth/transport/Postmessage'

import { Aof } from './kit.js'


var aof = Aof('postmessage', () =>
[
	[ 'connect', 1 ],
	[ 'connect', 2 ],
	[ 1, 'data1' ],
	[ 2, 'data2' ],
	[ 3 ],
	[ 'close', 2 ],
	/* [ 'close', 1 ], */
])

const is_child = (process.env.IS_WORKER || (! is_main))

if (! is_child)
{
	const filename = import.meta.url.slice('file://'.length)
	const worker = new Worker(filename /*, { stdout: true } */)

	/* worker.on('error', (e) => {}) */
	/* worker.on('exit', () => {}) */

	const endp = Endpoint(() => Postmessage(worker))

	endp.on('@connect', () =>
	{
		aof.track('connect', 1)
	})

	endp.on('ok1', (data, { endp }) =>
	{
		aof.track(1, data)

		endp.send('ok2', 'data2')
	})

	endp.on('done', () =>
	{
		aof.track(3)

		setTimeout(() =>
		{
			/* worker.terminate() */
			endp.close()
		})
	})

	endp.on('@close', () =>
	{
		/* aof.track('close', 1) */
		aof.end_check()
	})
}
else
{
	const endp = Endpoint(() => Postmessage(parentPort!))

	endp.on('@connect', () =>
	{
		aof.track('connect', 2)
		endp.send('ok1', 'data1')
	})

	endp.on('ok2', (data, { endp }) =>
	{
		aof.track(2, data)

		endp.send('done')

		setTimeout(() =>
		{
			/* parentPort.close() */
			endp.close()
		})
	})

	endp.on('@close', () =>
	{
		aof.track('close', 2)

		setTimeout(() =>
		{
			process.exit()
		})
	})
}
