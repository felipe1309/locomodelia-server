import app from './app'
import { Server as WebSocketServer } from 'socket.io'
import http from 'http'
import { config } from 'dotenv'
import Juagador from './model/Juagador'
import jwt from 'jsonwebtoken'
// utils
import { dbConection } from './utils/db.js'
import getNombreJugador from './utils/getNombreUser'
config()
dbConection()

const httpServer = http.createServer(app)
const io = new WebSocketServer(httpServer, {
  cors: {
    origin: '*'
  }
})
io.on('connection', (socket) => {
  socket.emit('isActive')
  socket.on('isActive:true', async (data) => {
    const nombre = await getNombreJugador(data.value)
    socket.broadcast.emit('activos:add', nombre)
  })
  socket.emit('isActive:all')
  socket.on('isActive:me', () => {
    socket.broadcast.emit('isActive:me')
  })
  socket.on('isActive:me-true', async (data) => {
    const nombre = await getNombreJugador(data.value)
    socket.broadcast.emit('activos:add', nombre)
  })
  socket.on('registrarse', async (data) => {
    try {
      const jugador = Juagador(data)
      jugador.save()
      const token = jwt.sign(
        {
          id: jugador._id
        },
        process.env.secretPayload
      )
      socket.emit('registrarse:activo', { value: token })
    } catch (error) {
      socket.emit('registrarse:error', { msg: error.msg })
    }
  })
  socket.on('bingo:get-salas', () => {
    socket.broadcast.emit('bingo:get-sala')
    socket.on('bingo:set-sala', async (data) => {
      const nombre = await getNombreJugador(data)
      socket.broadcast.emit('bingo:set-sala', nombre)
    })
  })
  socket.on('bingo:set-sala', async (data) => {
    const jugador = await getNombreJugador(data)
    socket.emit('bingo:set-sala', jugador)
  })

  socket.on('bingo:create', async (data) => {
    const { admin } = data
    const { id } = jwt.verify(admin, process.env.secretPayload)
    const jugador = await Juagador.findById(id)
    socket.broadcast.emit('bingo:create', jugador.nombre)
  })
})
httpServer.listen(process.env.PORT, () => {
  console.log('server on port 4100')
})
