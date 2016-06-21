import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default (sid, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `like-${sid}`
    const query = () => {
      mongoose
        .model('Like')
        .findOne({ sid })
        .exec(async (err, like) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(like)) {
            await saveToCache(key, toJSON(like), toIds(like))
            resolve(like)
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