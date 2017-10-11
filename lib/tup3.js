/* @flow */

; type Unsafe     = (tuple: any) => void
; type Safe<Head> = (head: Head, id: string, data: any) => any

;

export default function tup3<Head> (head_type: string, fn: Safe<Head>): Unsafe
{
	return (tuple) =>
	{
		if (! Array.isArray(tuple))
		{
			return
		}
		if (tuple.length < 3)
		{
			return
		}
		if (typeof tuple[0] !== head_type)
		{
			return
		}

		var head: Head = tuple[0]
		var id: string = tuple[1]
		var data: any  = tuple[2]

		fn(head, id, data)
	}
}
