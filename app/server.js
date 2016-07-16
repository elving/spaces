import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

import log from './utils/log'
import logError from './utils/logError'
import configModels from './config/models'
import configExpress from './config/express'
import configPassport from './config/passport'
import getRedisConfig from './utils/getRedisConfig'
import { startCache, clearCache } from './api/cache'

dotenv.load()

const port = 5000
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'
const server = express()
const redisConfig = getRedisConfig()

mongoose.connect(process.env.MONGO_URL, {
  server: { socketOptions: { keepAlive: 1 } }
}, err => {
  if (err) {
    logError(err)
  }
})

mongoose.connection.on('error', err => logError(err))

mongoose.connection.on('open', () => {
  log('Mongoose connection open.')

  // Setup redis cache
  startCache('spaces-next-cache', {
    port: redisConfig.port,
    host: redisConfig.host,
    engine: 'redis'
  })

  // Clear previous cache
  clearCache()

  // Bootstrap models
  configModels()

  // Bootstrap passport config
  configPassport()

  // Bootstrap server settings
  configExpress(server, mongoose.connection)

  server.listen(port, host, (error) => {
    if (error) {
      logError(error)
    } else {
      log(`Express app started on port ${port}`)
    }
  })
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    log('Mongoose connection disconnected.')
    process.exit(0)
  })
})
