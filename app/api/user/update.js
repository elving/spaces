import has from 'lodash/has'
import set from 'lodash/set'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import uploadImageFromDataUrl from '../../utils/image/uploadImageFromDataUrl'

import { invalidateFromCache } from '../cache'

export default (_id, props) => (
  new Promise(async (resolve, reject) => {
    try {
      const updates = sanitize(props)
      const options = {
        new: true,
        context: 'query',
        runValidators: true
      }

      if (has(updates, 'avatar')) {
        try {
          const avatarUrl = await uploadImageFromDataUrl(
            'avatars', updates.avatar
          )

          set(updates, 'avatar', avatarUrl)
        } catch (uploadErr) {
          return parseError(uploadErr)
        }
      }

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
            toIdsFromPath(user, 'comments'),
            toIdsFromPath(user, 'following')
          ])

          user
            .populate('likes')
            .populate('spaces')
            .populate('products')
            .populate('comments')
            .populate('following', (populationErr, populatedUser) => {
              if (populationErr) {
                return reject(parseError(populationErr))
              }

              resolve(populatedUser)
            })
        })
    } catch (err) {
      reject(err)
    }
  })
)
