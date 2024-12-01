
import Ws from 'isomorphic-ws'

export default function Websocket (uri)
{
	return new Ws(uri)
}
