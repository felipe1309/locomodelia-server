import { Schema, models, model } from 'mongoose'
import validator from 'mongoose-unique-validator'
const Jugador = new Schema({
  nombre: {
    type: String,
    required: true,
    min: 5,
    unique: true
  },
  victorias: {
    type: Number,
    default: 0
  },
  contraseña: {
    type: String,
    required: true,
    math: [/^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*[\d|@#$!%*?&])[\p{L}\d@#$!%*?&]{6,36}$/gu]
  }
})
Jugador.plugin(validator, 'ya existe una persona con ese nombre')
export default models.Jugadores || model('Jugadores', Jugador)
