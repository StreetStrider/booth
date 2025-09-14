
import type { Writable } from 'node:stream'

export default function logthru (name: string, stdout?: Writable, stderr?: Writable): void
