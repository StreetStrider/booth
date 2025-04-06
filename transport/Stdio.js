
import { createInterface as Lines } from 'node:readline'


export default function Stdio (input, output)
{
	let is_done = false

	const transport = new EventTarget

	input  || (input  = process.stdin)
	output || (output = process.stdout)

	transport.capabilities =
	{
		binary: false, /* TODO: stdio binary */
		reconnect: false,
	}

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

		transport.dispatchEvent(new Event('close')) /* TODO: CloseEvent () node@23 */
	}

	return (init(), transport)

	async function init ()
	{
		setTimeout(() =>
		{
			transport.dispatchEvent(new Event('open'))
		})

		for await (const line of Lines({ input }))
		{
			transport.dispatchEvent(new MessageEvent('message', { data: line }))
		}

		setTimeout(() =>
		{
			transport.close()
		})
	}
}


Stdio.from_child_process = (child) =>
{
	return Stdio(child.stdout, child.stdin)
}
