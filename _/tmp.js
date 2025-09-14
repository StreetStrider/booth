
import { tmpdir } from 'node:os'

import Rootpath from '@streetstrider/rootpath'


export default function Tmp (name)
{
	return Rootpath(tmpdir(), 'booth', name)
}
