
import Collection from 'aux.js/collection'


export default function Room ()
{
	var coll = Collection()

	function join (endp)
	{
		coll.add(endp)
	}

	function leave (endp)
	{
		coll.remove(endp)
	}

	function has (endp)
	{
		return coll.has(endp)
	}

	function send (kind, data = '')
	{
		coll.each(endp => endp.send(kind, data))
	}

	return { join, leave, has, send }
}
