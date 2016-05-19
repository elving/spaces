import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default () => {
  return new Promise(async (resolve, reject) => {
    const cacheKey = 'category-all'

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('Category')
        .find()
        .sort({ name: 'asc' })
        .exec(async (err, categories) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(categories)) {
            await saveToCache(cacheKey, toJSON(categories), toIds(categories))
            resolve(categories)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
