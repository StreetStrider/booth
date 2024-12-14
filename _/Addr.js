

export function Websocket (port)
{
	function for_dispatch ()
	{
		return { port }
	}

	function for_endpoint (host = 'localhost')
	{
		return `ws://${ host }:${ port }`
	}

	function view ()
	{
		return [ for_dispatch(), for_endpoint() ]
	}

	return { port, view, for_dispatch, for_endpoint }
}


export function Unix (path)
{
	function for_dispatch ()
	{
		return { path }
	}

	function for_endpoint ()
	{
		return ('ws+unix://' + path)
	}

	function view ()
	{
		return [ for_dispatch(), for_endpoint() ]
	}

	return { path, view, for_dispatch, for_endpoint }
}
