# booth

> Booth provides symmetric Event API over websocket or unix domain socket

Alike socket.io, but less powerful. Simple Event API, simple reconnect strategy,
symmetric usage via `Endpoint()` on both client and server sides.

# api
```js
/*
 * options: WebSocket.Server options
 */
const dispatch = Dispatch(options)

/* port */
const dispatch = Dispatch({ port: 9000 })

/*
 * httpServer instance
 * for using inside working http server
 * or with unix domain socket
 */
const dispatch = Dispatch({ server })

dispatch.on('name', handler)
dispatch.on({ name: handler })

function handler (data, endpoint) { /* … */ }

/*
 * ws_uri: string with ws or ws+unix uri
 */
Endpoint(ws_uri)

/* websocket */
Endpoint('ws://127.0.0.1:9000')
Endpoint('ws://localhost:9000')

/* unix domain socket */
Endpoint('ws+unix:///tmp/booth/unix.sock')

endpoint.on('name', handler)
endpoint.on({ name: handler })

function handler (data, endpoint) { /* … */ }
```

# license
ISC.
Copyright © 2025, Strider.
