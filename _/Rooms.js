
import Reg from './reg.js'

import Room from './Room.js'


export default function Rooms ()
{
	var reg = Reg(Room)

	function get (name)
	{
		return reg.get(name)
	}

	function list ()
	{
		return reg.keys()
	}

	function has (name)
	{
		return reg.has(name)
	}

	function remove (name)
	{
		reg.remove(name)
	}

	function send (name, kind, data = '')
	{
		reg.over(name, room => room.send(kind, data))
	}

	function join_if_any (name, endp)
	{
		reg.over(name, room => room.join(endp))
	}

	function leave_every (endp)
	{
		reg.each(room =>
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
