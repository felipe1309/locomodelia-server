import jwt from 'jsonwebtoken'
import Jugador from '../model/Juagador'
/**
 *
 * @param {string} data es el token del jugador con el cual se podra sacar la informacion de la bace de datos
 */
export default async function getNombreJugador (data) {
  const { id } = jwt.verify(data, process.env.secretPayload)
  const jugador = await Jugador.findById(id)
  return jugador.nombre
}
