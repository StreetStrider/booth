# booth

> Booth provides request-response over socket.io and creates FRP streams from socket.io events

## request-response

*server*:
```js
Booth(socket_io, endpoint =>
{
	/* register request handler (client will do requests) */
	endpoint.request.register('ask-server', data =>
	{
		return { some: 'data' } /* can be Promise */
	})

	/* request client (client should `register`) */
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

/* API is identical to servers' */
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

[`flyd`](https://github.com/paldepind/flyd) is used for streaming (FRP).

*server*:
```js
import flyd from 'flyd'

Booth(socket_io, endpoint =>
{
	var feed = flyd.stream()

	/* register realtime (push to client) */
	endp.realtime.register('from-server', feed)

	feed('next #1')
	feed('next #2')
	feed('next #3')

	/* take another realtime feed from client */
	endpoint.realtime('from-client')
	/* from here `flyd` API is available: */
	.map(data =>
	{
		// …
	})
	/* you can use `flyd.on` instead of `stream.map` */
})
```

*client*:
```js
var client_endpoint = Endpoint(socket_io_client)

/* API is identical to servers' */
client_endpoint.realtime('from-server')
.map(data =>
{
	// …
})

var feed_client = flyd.stream()

client_endpoint.realtime.register('from-client', feed_client)

feed_client('next #1')
feed_client('next #2')
feed_client('next #3')
```

## license
ISC, copyright © 2017, Strider.
