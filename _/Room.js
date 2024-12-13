
import Seq from './seq.js'


export default function Room ()
{
	var seq = Seq()

	function join (endp)
	{
		seq.add(endp)
	}

	function leave (endp)
	{
		seq.remove(endp)
	}

	function has (endp)
	{
		return seq.has(endp)
	}

	function send (kind, data = '')
	{
		seq.each(endp => endp.send(kind, data))
	}

	function each (fn)
	{
		seq.each(fn)
	}

	return { join, leave, has, send, each }
}
