import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { invalidateFromCache } from '../cache'

export default (_id, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updates = sanitize(props)
      const options = { new: true }

      mongoose
        .model('User')
        .findOneAndUpdate({ _id }, updates, options, async (err, user) => {
          if (err) {
            return reject(parseError(err))
          }

          await invalidateFromCache([
            _id,
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
