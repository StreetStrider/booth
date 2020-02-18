

export default function name (label, fn)
{
	if (arguments.length < 2)
	{
		fn    = label
		label = fn.name
	}

	return { [label]: fn }
}
