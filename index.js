
var ws = require('ws')

var Client = ws
var Server = ws.Server

console.log(Client)
console.log(Server)

var wss = new Server({ port: 9000 })

var ws = new Client('ws://localhost:9000')

wss.on('connection', (ws) =>
{
	ws.on('message', (data) =>
	{
		console.log('←', data)

		defer(() => send(data.toUpperCase() + '_' + data.toLowerCase()))
	})

	function send (data)
	{
		ws.send(data)
		console.log('→', data)
	}

	ws.on('close', () => wss.close())
})

ws.on('open', () =>
{
	ws.send('Hello, World!')
})

ws.on('message', (data) => console.log('*', data))
ws.on('message', () => ws.close())

function defer (fn)
{
	setTimeout(fn, 500)
}
