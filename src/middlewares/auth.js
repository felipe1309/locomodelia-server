import Juagador from '../model/Juagador'
import jwt from 'jsonwebtoken'
/**
 * una funcion que crea un usuario y manda un emicion de activo para el front
 * @param {*} socket el socket para emitir el evento de activo
 * @param {string} data es el oken con el que se busca el jugador
 */
export async function registrarse (socket, data) {
  const newJugador = Juagador({
    nombre: data.nombre,
    contraseña: data.contraseña
  })
  const jugadorSave = await newJugador.save()
  const token = jwt.sign({
    id: jugadorSave._id
  }, process.env.secretPayload, {
    expiresIn: 60 * 60 * 24 * 30
  })
  const tokenEnviar = {
    value: token
  }
  socket.emit('registrarse:activo', tokenEnviar)
}
