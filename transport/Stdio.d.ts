
import type { Readable } from 'node:stream'
import type { Writable } from 'node:stream'

import type { ChildProcess } from 'node:child_process'

import type { Transport } from '../Transport.js'


interface Stdio
{
	(input?: Readable, output?: Writable): Transport,
	(): Transport,

	from_child_process (child: ChildProcess): Transport,
}

declare const Stdio: Stdio

export default Stdio
