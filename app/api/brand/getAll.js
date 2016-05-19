import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default () => {
  return new Promise(async (resolve, reject) => {
    const cacheKey = 'brand-all'

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('Brand')
        .find()
        .sort({ name: 'asc' })
        .exec(async (err, brands) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(brands)) {
            await saveToCache(cacheKey, toJSON(brands), toIds(brands))
            resolve(brands)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
