import mongoose from 'mongoose'

import sanitize from './sanitize'

import { invalidateFromCache } from '../cache'
import { toIds, parseError, toIdsFromPath } from '../utils'

export default (id, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = { _id: id }
      const updates = sanitize(props, false)
      const options = { new: true }

      mongoose
        .model('User')
        .findOneAndUpdate(query, updates, options, async (err, user) => {
          if (err) {
            return reject(parseError(err))
          }

          await invalidateFromCache([
            toIds(user),
            toIdsFromPath(user, 'likes'),
            toIdsFromPath(user, 'spaces'),
            toIdsFromPath(user, 'products'),
            toIdsFromPath(user, 'comments')
          ])

          user
            .populate('likes')
            .populate('spaces')
            .populate('products')
            .populate('comments', (err, user) => {
              if (err) {
                return reject(parseError(err))
              }

              resolve(user)
            })
        })
    } catch (err) {
      reject(err)
    }
  })
}