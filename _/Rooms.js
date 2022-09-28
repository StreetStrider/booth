
import Registry from 'aux.js/registry'

import Room from './Room'


export default function Rooms ()
{
	var rs = Registry(Room)

	function get (name)
	{
		return rs.get(name)
	}

	function list ()
	{
		return rs.keys()
	}

	function has (name)
	{
		return rs.has(name)
	}

	function remove (name)
	{
		rs.remove(name)
	}

	function send (name, kind, data = '')
	{
		rs.over(name, room => room.send(kind, data))
	}

	function join_if_any (name, endp)
	{
		rs.over(name, room => room.join(endp))
	}

	function leave_every (endp)
	{
		rs.each(room =>
		{
			if (room.has(endp))
			{
				room.leave(endp)
			}
		})
	}

	return {
		get,
		list,
		has,
		remove,
		send,
		join_if_any,
		leave_every,
	}
}
