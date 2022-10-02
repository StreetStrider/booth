

export function Websocket (port)
{
	function for_booth ()
	{
		return { port }
	}

	function for_endpoint (host = 'localhost')
	{
		return `ws://${ host }:${ port }`
	}

	function view ()
	{
		return [ for_booth(), for_endpoint() ]
	}

	return { port, view, for_booth, for_endpoint }
}


export function Unix (path)
{
	function for_booth ()
	{
		return { path }
	}

	function for_endpoint ()
	{
		return ('ws+unix://' + path)
	}

	function view ()
	{
		return [ for_booth(), for_endpoint() ]
	}

	return { path, view, for_booth, for_endpoint }
}
