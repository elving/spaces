import dotenv from 'dotenv'
import mongoose from 'mongoose'

import configModels from '../app/config/models'

import {
  default as setCategoriesImage
} from './category/setImage'

import {
  default as setCategoriesProductsCount
} from './category/setProductsCount'

dotenv.load()

mongoose.connect(process.env.MONGO_URL, {
  server: { socketOptions: { keepAlive: 1 } }
}, (err) => {
  if (err) console.error(err)
})

mongoose.connection.on('error', (err) => {
  console.error(err)
})

mongoose.connection.on('open', async () => {
  console.log('Mongoose connection open.')

  // Bootstrap models
  configModels()

  // Run Migrations
  await setCategoriesImage()
  await setCategoriesProductsCount()

  process.exit(0)
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected.')
    process.exit(0)
  })
})

// NODE_ENV=development ./node_modules/.bin/babel-node ./migrations/runAll.js
