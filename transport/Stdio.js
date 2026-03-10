
import { createInterface as Lines } from 'node:readline'

import delay from '../_/delay.js'

import * as status from '../status.js'


export default function Stdio (input, output)
{
	var is_done = false

	var transport = new EventTarget

	input  ??= process.stdin
	output ??= process.stdout

	transport.capabilities =
	{
		binary: false, /* TODO: stdio binary */
		reconnect: false,
	}

	transport.readyState = status.CONNECTING

	transport.send = (s) =>
	{
		output.write(s + '\n')
	}

	transport.close = () =>
	{
		if (is_done) return
		is_done = true

		/* we do not own */
		/* input.destroy() */
		/* output.end() */
		input  = null
		output = null

		transport.readyState = status.CLOSED
		transport.dispatchEvent(new Event('close')) /* TODO: CloseEvent () node@23 */
	}


	return (init(), transport)

	async function init ()
	{
		await delay()

		transport.readyState = status.OPEN
		transport.dispatchEvent(new Event('open'))

		for await (var line of Lines({ input }))
		{
			transport.dispatchEvent(new MessageEvent('message', { data: line }))
		}

		await delay()
		transport.readyState = status.CLOSING
		await delay()

		transport.close()
	}
}


Stdio.from_child_process = (child) =>
{
	return Stdio(child.stdout, child.stdin)
}
