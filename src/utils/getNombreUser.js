import jwt from 'jsonwebtoken'
import Jugador from '../model/Juagador'
/**
 * funcion que recive un token, y con esta informacion la desencripta y saca la informacion de la base de datos.
 * retorna : el nombre del jugador
 * @param {string} token
 */
export default async function getNombreJugador (token) {
  const { id } = jwt.verify(token, process.env.secretPayload)
  const jugador = await Jugador.findById(id)
  return jugador.nombre
}
