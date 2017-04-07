# booth

> Booth provides request-response over socket.io and creates FRP streams from socket.io events

## request-response

*server*:
```js
Booth(socket_io, endpoint =>
{
	// register request handler (client will do requests)
	endpoint.request.register('ask-server', data =>
	{
		return { some: 'data' } // can be Promise
	})

	// request client (client should `register`)
	endpoint.request('ask-client', { key: 'server' })
	.then(data =>
	{
		// …
	})
})
```

*client*:
```js
var client_endpoint = Endpoint(socket_io_client)

// API is symmetric with servers' one
client_endpoint.request('ask-server', { key: 'client' })
.then(data =>
{
	// …
})

client_endpoint.request.register('ask-client', data =>
{
	return { some: 'client-data' }
})
```

## realtime

[`most`](https://github.com/cujojs/most) is used as FRP.

*server*:
```js
import most from 'most'

Booth(socket_io, endpoint =>
{
	var feed = most.from([ 1, 2, 3, 4, 5 ])

	// register realtime (push to client)
	endp.realtime.register('from-server', feed)

	// take realtime feed from client
	endpoint.realtime('from-client')
	/* from here `most` API is available: */
	.observe(data =>
	{
		// …
	})
})
```

*client*:
```js
var client_endpoint = Endpoint(socket_io_client)

// API is symmetric with servers' one
client_endpoint.realtime('from-server')
.observe(data =>
{
	// …
})

var feed_client = most.from([ 5, 4, 3, 2, 1 ])

client_endpoint.realtime.register('from-client', feed_client)
```

## license
ISC, copyright © 2017, Strider.
