/* eslint-disable global-require */

import slice from 'lodash/slice'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import log from '../app/utils/log'
import logError from '../app/utils/logError'
import configModels from '../app/config/models'

dotenv.load()

mongoose.connect(process.env.MONGO_URL, {
  server: { socketOptions: { keepAlive: 1 } }
}, (err) => {
  if (err) {
    logError(err)
  }
})

mongoose.connection.on('error', (err) => {
  logError(err)
})

mongoose.connection.on('open', async () => {
  log('Mongoose connection open.')

  const migrations = slice(process.argv, 2)

  // Bootstrap models
  configModels()

  // Run Migrations
  for (const migrationPath of migrations) {
    try {
      const migration = require(`./${migrationPath}`).default
      await migration()
    } catch (migrationErr) {
      logError(migrationErr)
    }
  }

  // await setCategoriesImage()
  // await setCategoriesProductsCount()
  // await setSpaceTypesProductsCount()
  // await setSpaceTypesSpacesCount()

  process.exit(0)
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    log('Mongoose connection disconnected.')
    process.exit(0)
  })
})

// NODE_ENV=development ./node_modules/.bin/babel-node ./migrations/run.js category/setImage
// NODE_ENV=development ./node_modules/.bin/babel-node ./migrations/run.js category/setProductsCount
// NODE_ENV=development ./node_modules/.bin/babel-node ./migrations/run.js category/setSpacesCount
// NODE_ENV=development ./node_modules/.bin/babel-node ./migrations/run.js space/setProductsMetadata
// NODE_ENV=development ./node_modules/.bin/babel-node ./migrations/run.js spaceType/setImage
// NODE_ENV=development ./node_modules/.bin/babel-node ./migrations/run.js spaceType/setProductsCount
// NODE_ENV=development ./node_modules/.bin/babel-node ./migrations/run.js spaceType/setSpacesCount
