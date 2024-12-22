

export type Reg <Key = unknown, Value = unknown> =
{
	get (key: Key): Value,

	set (key: Key, value: Value): Value,
	remove (key: Key): Value,
	clear (): void,

	has (key: Key): boolean,
	is_empty: boolean;
	size: number,

	keys (): Iterator<Key>,
	values (): Iterator<Value>,
	entries (): Entries<Key, Value>
	[Symbol.iterator]: Entries<Key, Value>

	each (fn: (value: Value, key: Key) => void): void,
	over (key: Key, fn: (value: Value, key: Key) => void): void,
}

export type Initializer <Key = unknown, Value = unknown> = (key: Key) => Value

export type Entries <Key = unknown, Value = unknown> = Iterator<[ Key, Value ]>


export default function Reg <Key = unknown, Value = unknown>
	(initializer: Initializer<Key, Value>)
		: Reg<Value>

export default function Reg <Key = unknown, Value = unknown>
	(values: Entries<Key, Value>)
		: Reg<Value>
