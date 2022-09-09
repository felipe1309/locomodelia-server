import mongoose from 'mongoose'

export const dbConection = () => {
  if (mongoose.connections.length !== 0) {
    mongoose.connect(process.env.MONGO_URL, {
      autoIndex: true
    })
    mongoose.connection.on('conection', () => {
      console.log('mongo conected')
    })
  }
}
