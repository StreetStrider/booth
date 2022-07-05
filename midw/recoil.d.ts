
import { Data } from '../Endpoint'
import { Handler } from '../Endpoint'

import { Transformer } from './compose'

export default function (): (fn: Transformer<Data, Data>) => Handler
