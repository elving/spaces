import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default (sid, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `color-${sid}`
    const query = () => {
      mongoose
        .model('Color')
        .findOne({ sid })
        .exec(async (err, color) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(color)) {
            await saveToCache(key, toJSON(color), toIds(color))
            resolve(color)
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
