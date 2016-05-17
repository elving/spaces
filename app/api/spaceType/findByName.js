import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default (name, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `spaceType-${kebabCase(name)}`
    const query = () => {
      mongoose
        .model('SpaceType')
        .findOne({ name })
        .exec(async (err, spaceType) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(spaceType)) {
            await saveToCache(key, toJSON(spaceType), toIds(spaceType))
            resolve(spaceType)
          } else {
            resolve()
          }
        })
    }

    if (returnDocument) {
      query()
    } else {
      getFromCacheOrQuery(key, query, resolve)
    }
  })
}
