import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default () => {
  return new Promise(async (resolve, reject) => {
    const cacheKey = 'spaceType-all'

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('SpaceType')
        .find()
        .sort({ name: 'asc' })
        .exec(async (err, spaceTypes) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(spaceTypes)) {
            await saveToCache(cacheKey, toJSON(spaceTypes), toIds(spaceTypes))
            resolve(spaceTypes)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
