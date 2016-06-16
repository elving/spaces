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

export default (_id) => {
  return new Promise((resolve, reject) => {
    const key = `user-${_id}`

    const query = () => {
      mongoose
        .model('User')
        .findOne({ _id })
        .populate('likes')
        .populate('spaces')
        .populate('products')
        .populate('comments')
        .exec(async (err, user) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(user)) {
            await saveToCache(key, toJSON(user), [
              toIds(user),
              toIdsFromPath(user, 'likes'),
              toIdsFromPath(user, 'spaces'),
              toIdsFromPath(user, 'products'),
              toIdsFromPath(user, 'comments')
            ])

            resolve(user)
          } else {
            resolve()
          }
        })
    }

    getFromCacheOrQuery(key, query, resolve)
  })
}
