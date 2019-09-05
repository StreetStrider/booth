

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
				if (! ev) { return }

				ev.splice(ev.indexOf(fn), 1)

				eventname = null
				fn = null

				ev = null
			}
		},

		emit (eventname, ...args)
		{
			var ev = _[eventname]

			ev && ev.forEach(e => e(...args))
		},
	}
}
