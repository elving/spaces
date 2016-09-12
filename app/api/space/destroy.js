import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import update from './update'
import toStringId from '../utils/toStringId'
import toObjectId from '../utils/toObjectId'
import parseError from '../utils/parseError'

import { invalidateFromCache } from '../cache'

import getLikes from '../like/getAll'
import updateUser from '../user/update'
import updateRoom from '../spaceType/update'
import destroyLike from '../like/destroyById.js'
import updateCategory from '../category/update'

export default _id => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .findOneAndRemove({ _id }, async (err, space) => {
        if (err) {
          return reject(parseError(err))
        }

        const originalSpace = get(space, 'originalSpace')

        if (!isEmpty(originalSpace)) {
          try {
            await update(toStringId(originalSpace), {
              $inc: { redesignsCount: -1 },
              $pull: { redesigns: toObjectId(space) }
            })
          } catch (originalSpaceErr) {
            return reject(parseError(originalSpaceErr))
          }
        }

        const room = toStringId(get(space, 'spaceType'))

        await updateRoom(room, {
          $inc: { spacesCount: -1 }
        })

        const categories = toIds(get(space, 'categories'))

        for (const category of categories) {
          await updateCategory(category, {
            $inc: { spacesCount: -1 }
          })
        }

        const likes = await getLikes(_id)

        for (const like of likes) {
          await updateUser(toStringId(get(like, 'createdBy')), {
            $pull: { likes: toObjectId(like) }
          })

          await destroyLike(toStringId(like))
        }

        await invalidateFromCache([
          _id,
          room,
          toIds(get(space, 'products')),
          toIds(get(space, 'redesigns'))
        ])

        resolve()
      })
  })
)
