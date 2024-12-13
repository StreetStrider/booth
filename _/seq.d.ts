

export type Seq <Value = unknown> =
{
	add (value: Value): Value;
	remove (value: Value): Value;
	clear (): void;

	has (value: Value): boolean;
	is_empty: boolean;
	size: number,

	each (fn: (value: Value) => void): void;
	[Symbol.iterator](): Iterator<Value>,
	keys (): Iterator<Value>,
}

export default function Seq <Value = unknown> (values?: Iterable<Value>): Seq<Value>
