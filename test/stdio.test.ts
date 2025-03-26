
import 'console-ultimate'

console.info('stdio.test')

import { spawn } from 'node:child_process'

import { Endpoint } from 'booth'
import Stdio from 'booth/transport/Stdio'

import { is_node } from './kit.js'
import { Aof } from './kit.js'


var aof = Aof('stdio', () =>
[
	[ 'connect', 1 ],
	[ 'connect', 2 ],
	[ 1, 'data1' ],
	[ 2, 'data2' ],
	[ 3 ],
	[ 'close', 2 ],
	[ 'close', 1 ],
])


const is_child = process.argv.includes('--child')
if (! is_child)
{
	let exe = process.execPath
	if (is_node())
	{
		exe = 'tsx'
	}
	const filename = import.meta.url.slice('file://'.length)
	const child = spawn(exe, [ filename, '--child' ] /*, { stdio: 'inherit' } */)

	/* child.on('spawn', () => {}) */

	const endp = Endpoint(() => Stdio.from_child_process(child))

	endp.on('@connect', () =>
	{
		aof.track('connect', 1)
	})

	/* child.stdout.pipe(process.stdout) */
	/* child.stderr.pipe(process.stderr) */

	endp.on('ok1', (data, { endp }) =>
	{
		aof.track(1, data)

		endp.send('ok2', 'data2')
	})

	endp.on('done', () =>
	{
		aof.track(3)

		child.stdin.end()
	})

	endp.on('@close', () =>
	{
		aof.track('close', 1)
		aof.end_check()
	})
}
else
{
	const endp = Endpoint(() => Stdio())

	endp.on('@connect', () =>
	{
		aof.track('connect', 2)
		endp.send('ok1', 'data1')
	})

	endp.on('ok2', (data, { endp }) =>
	{
		aof.track(2, data)

		endp.send('done')
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
