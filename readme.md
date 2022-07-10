# booth

> Booth provides symmetric Event API over websocket or unix domain socket

Alike socket.io, but less powerful. Simple Event API, simple reconnect strategy,
symmetric usage via `Endpoint()` on both client and server sides.

# api
```js
/*
 * options: WebSocket.Server options
 */
const booth = Booth(options)

/* port */
const booth = Booth({ port: 9000 })

/*
 * httpServer instance
 * for using inside working http server
 * or with unix domain socket
 */
const booth = Booth({ server })

booth.on('name', handler)
booth.on({ name: handler })

function handler (data, endpoint) { /* … */ }

/*
 * ws_uri: string with ws or ws+unix uri
 */
Endpoint(ws_uri)

/* websocket */
Endpoint('ws://localhost:9000')

/* unix domain socket */
Endpoint('ws+unix://localhost:9000')

endpoint.on('name', handler)
endpoint.on({ name: handler })

function handler (data, endpoint) { /* … */ }
```

# license
ISC.
Copyright © 2022, Strider.
