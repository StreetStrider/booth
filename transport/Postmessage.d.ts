
import type { MessagePort } from 'node:worker_threads'
import type { Worker } from 'node:worker_threads'

import type { Transport } from '../Transport.js'


export type Port = (MessagePort | Worker)

export default function Postmessage (port: Port): Transport
