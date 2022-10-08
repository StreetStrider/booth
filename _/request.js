
import when from './when'


export default function request (endpoint, key, data = '', timeout = 5e3)
{
	endpoint.send(key, data)

	return when(endpoint, key, timeout)
}
