/* @flow */

export default function Seq ()
{
	var next = 0

	return () =>
	{
		++ next

		return next
	}
}
