


export default function Postmessage (port)
{
	var transport = new EventTarget

	transport.capabilities =
	{
		binary: false, /* TODO: postmessage binary */
		reconnect: false,
	}

	transport.send = (s) =>
	{
		port.postMessage(s)
	}

	transport.close = () =>
	{
		if (! port) return

		/* we do not own */
		/* port.finalize() */
		/* port.close() */

		on_close()
	}

	function on_message (data)
	{
		transport.dispatchEvent(new MessageEvent('message', { data }))
	}

	function on_close ()
	{
		finalize()
		transport.dispatchEvent(new Event('close'))
	}

	function finalize ()
	{
		port.removeListener('message', on_message)
		port.removeListener('close', on_close)
		port = null
	}

	return (init(), transport)

	async function init ()
	{
		port.addListener('message', on_message)
		port.addListener('close', on_close)

		setTimeout(() =>
		{
			transport.dispatchEvent(new Event('open'))

			port.start?.()
		})
	}
}
