import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default (parent) => {
  return new Promise(async (resolve, reject) => {
    const key = `like-all-${parent}`

    getFromCacheOrQuery(key, () => {
      mongoose
        .model('Like')
        .where({ parent })
        .exec(async (err, likes) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(likes)) {
            await saveToCache(key, toJSON(likes), toIds(likes))
            resolve(likes)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
