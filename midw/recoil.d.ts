
// import type { Data } from '../Endpoint.js'
import type { Handler } from '../Endpoint.js'
// import type { Transformer } from './compose.js'

export default function (name?: string): (fn: Handler<any, any>) => Handler // TODO:
