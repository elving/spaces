import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default (sid, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `category-${sid}`
    const query = () => {
      mongoose
        .model('Category')
        .findOne({ sid })
        .exec(async (err, category) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(category)) {
            await saveToCache(key, toJSON(category), toIds(category))
            resolve(category)
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
