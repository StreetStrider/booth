
import { EventEmitter } from 'node:events'
import { createInterface as Lines } from 'node:readline'


export default function Stdio (input, output)
{
	let is_done = false

	const transport = new EventEmitter

	input  || (input  = process.stdin)
	output || (output = process.stdout)

	transport.addEventListener = (...args) =>
	{
		return transport.addListener(...args)
	}

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

		// TODO: consider stream handle
		// input.destroy()
		// output.end()

		transport.emit('close')
	}

	return (init(), transport)

	async function init ()
	{
		setTimeout(() =>
		{
			transport.emit('open')
		})

		for await (const line of Lines({ input }))
		{
			transport.emit('message', { data: line })
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
