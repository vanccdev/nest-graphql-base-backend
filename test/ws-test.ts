import io  from 'socket.io-client'
import * as readline from 'readline'

const PORT = process.env.PORT || 3000
const NAMESPACE = '/events' // Cambia según tu gateway

const socket = io(`http://localhost:${PORT}${NAMESPACE}`, {
  transports: ['websocket'],
})

socket.on('connect', () => {
  console.log('✅ Conectado - ID:', socket.id)
})

socket.on('disconnect', () => {
  console.log('❌ Desconectado')
  process.exit(0)
})

socket.on('message', (data: any) => {
  console.log('📬 Mensaje:', JSON.stringify(data, null, 2))
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
})

console.log('💬 Cliente WebSocket iniciado. Comandos:')
console.log('  events <mensaje>  - Enviar evento')
console.log('  broadcast <msg>   - Broadcast a todos')
console.log('  exit              - Salir\n')

rl.prompt()

rl.on('line', (line: string) => {
  const [cmd, ...args] = line.trim().split(' ')
  const message = args.join(' ')

  switch (cmd) {
    case 'events':
      socket.emit('events', message, (response: any) => {
        console.log('📨 Respuesta:', response)
      })
      break
    case 'broadcast':
      socket.emit('broadcast', { text: message, timestamp: Date.now() })
      break
    case 'exit':
      socket.disconnect()
      process.exit(0)
      break
    default:
      console.log('❓ Comando desconocido')
  }
  rl.prompt()
})
