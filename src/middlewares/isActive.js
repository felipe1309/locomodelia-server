import getNombreUser from '../utils/getNombreUser'
/**
 *  funcion midlleware de evento de recivo. este evento escucha otro evento: isActuve-true. con el token que nos da sacamos el nombre del usuario y se lo enviamos a el resto de usarios.
 * @param {*} socket el socket con el que enviamos y escuchamos eventos
 * @param {string} data el token
 */
export async function isActiveTue (socket, data) {
  const nombre = await getNombreUser(data)
  socket.broadcast.emit('activos:add', {
    name: nombre,
    id: socket.id
  })
}
export function isActiveMeTrue (socket, data) {
  getNombreUser(data.token).then(nombre => {
    socket.to(data.id).emit('activos:add', {
      name: nombre,
      id: socket.id
    })
  })
}
