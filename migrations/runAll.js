import dotenv from 'dotenv'
import mongoose from 'mongoose'

import configModels from '../app/config/models'
import productsCount from './category/productsCount'

dotenv.load()

mongoose.connect(process.env.MONGO_URL, {
  server: { socketOptions: { keepAlive: 1 } }
}, (err) => {
  if (err) console.error(err)
})

mongoose.connection.on('error', (err) => {
  console.error(err)
})

mongoose.connection.on('open', () => {
  console.log('Mongoose connection open.')

  // Bootstrap models
  configModels()

  // Run Migrations
  productsCount()

  process.exit(0)
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected.')
    process.exit(0)
  })
})
