import getNombreUser from '../utils/getNombreUser'
export function salaStateTrue (socket, data) {
  getNombreUser(data.token).then(name => {
    socket.broadcast.emit('add-sala', {
      name,
      id: socket.id
    })
  })
}
export function salaSetSala (socket, data) {
  getNombreUser(data.token).then(name => {
    socket.to(data.id).emit('add-sala', {
      name,
      id: socket.id
    })
  })
}
