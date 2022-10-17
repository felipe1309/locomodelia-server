import app from './app'
import { Server as WebSocketServer } from 'socket.io'
import http from 'http'
import { config } from 'dotenv'
// midlleware
import { isActiveTue, isActiveMeTrue } from './middlewares/isActive'
import { salaStateTrue, salaSetSala } from './middlewares/salasBingo'
// utils
import { dbConection } from './utils/db.js'
import { registrarse } from './middlewares/auth'
config()
dbConection()
const httpServer = http.createServer(app)
const io = new WebSocketServer(httpServer, {
  cors: {
    origin: '*'
  }
})
io.on('connection', (socket) => {
  // is actives
  // evento de coneccion de un socket (inicia todos los eventos que arancan con la rendericzacion de la app)
  socket.emit('isActive')
  // cuando se comprueva que el socket tiene un usuario activo le manda la informacion a los otros sockets para que sepan que esta activo (manda el nombre y el id)
  socket.on('isActive:true', (data) => isActiveTue(socket, data.value))
  // enviamos un evento preguntado por los usurios activos
  socket.on('isActive:all-players', () => {
    socket.broadcast.emit('isActive:all-players', socket.id)
  })
  // le enviamos al socket que nos pregunto si estavamos activos nuestra informacion
  socket.on('isActive:me-true', data => isActiveMeTrue(socket, data))
  //
  //
  // salas
  socket.on('salaState:true', data => salaStateTrue(socket, data))
  // escuchar un evemto que pide a los otros sockets si tienen salas activas
  socket.on('salas:get-all', () => {
    socket.broadcast.emit('salas:get-all', socket.id)
  })
  //
  socket.on('salas:set-sala', data => salaSetSala(socket, data))
  //
  socket.on('sala:unirse', id => {
    socket.to(id).emit('sala:unirse', socket.id)
  })
  // auth
  socket.on('registrarse', (data) => registrarse(socket, data))
})
httpServer.listen(process.env.PORT, () => {
  console.log('server on port 4100')
})
