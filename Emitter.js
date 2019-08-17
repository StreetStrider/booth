

export default function Emitter ()
{
	var _ = {}

	return 0,
	{
		on (eventname, fn)
		{
			var ev = (_[eventname] || (_[eventname] = []))

			ev.push(fn)

			return () =>
			{
				ev.splice(ev.indexOf(fn), 1)
			}
		},

		emit (eventname, ...args)
		{
			var ev = _[eventname]

			ev && ev.forEach(e => e(...args))
		},
	}
}
