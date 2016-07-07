import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (limit = 8) => {
  return new Promise(async (resolve, reject) => {
    const cacheKey = `user-popular-${limit}`

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('User')
        .find()
        .limit(limit)
        .sort('-followersCount -updatedAt')
        .exec(async (err, users) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(users)) {
            await saveToCache(cacheKey, toJSON(users), toIds(users))
            resolve(users)
          } else {
            resolve([])
          }
        })
    }, resolve)
  })
}
