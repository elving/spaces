import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

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
        .populate('following')
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
              toIdsFromPath(user, 'comments'),
              toIdsFromPath(user, 'following')
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
