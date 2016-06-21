import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'

import {
  toIds,
  toJSON,
  parseError,
  toIdsFromPath,
  getFromCacheOrQuery
} from '../utils'

export default (limit = 8) => {
  return new Promise(async (resolve, reject) => {
    const cacheKey = 'user-latest'

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('User')
        .find()
        .limit(limit)
        .sort('-createdAt')
        .exec(async (err, users) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(users)) {
            await saveToCache(cacheKey, toJSON(users), [
              toIds(users),
              toIdsFromPath(users, 'likes'),
              toIdsFromPath(users, 'spaces'),
              toIdsFromPath(users, 'products'),
              toIdsFromPath(users, 'comments')
            ])

            resolve(users)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
