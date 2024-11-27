
import type { Data } from '../Endpoint.js'
import type { Handler } from '../Endpoint.js'

import type { Transformer } from './compose.js'

export default function (): (fn: Transformer<Data, Data>) => Handler
