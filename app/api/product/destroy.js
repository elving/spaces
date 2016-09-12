import get from 'lodash/get'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toStringId from '../utils/toStringId'
import toObjectId from '../utils/toObjectId'
import parseError from '../utils/parseError'
import { invalidateFromCache } from '../cache'

import getLikes from '../like/getAll'
import updateUser from '../user/update'
import updateRoom from '../spaceType/update'
import destroyLike from '../like/destroyById'
import updateCategory from '../category/update'

export default _id => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Product')
      .findOneAndRemove({ _id }, async (err, product) => {
        if (err) {
          return reject(parseError(err))
        }

        const rooms = toIds(get(product, 'spaceTypes'))

        for (const room of rooms) {
          await updateRoom(room, {
            $inc: { productsCount: -1 }
          })
        }

        const categories = toIds(get(product, 'categories'))

        for (const category of categories) {
          await updateCategory(category, {
            $inc: { productsCount: -1 }
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
          rooms,
          categories,
          toIds(get(product, 'brand')),
          toIds(get(product, 'colors'))
        ])

        resolve()
      })
  })
)
