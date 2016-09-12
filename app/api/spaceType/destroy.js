import get from 'lodash/get'
import without from 'lodash/without'
import mongoose from 'mongoose'

import getSpaces from '../space/where'
import getFollows from '../follow/getAll'
import updateUser from '../user/update'
import updateSpace from '../space/update'
import getProducts from '../product/where'
import updateProduct from '../product/update'
import destroyFollow from '../follow/destroyById'

import parseError from '../utils/parseError'
import toStringId from '../utils/toStringId'
import toObjectId from '../utils/toObjectId'
import { invalidateFromCache } from '../cache'

export default (_id) => (
  new Promise(async (resolve, reject) => {
    mongoose
      .model('SpaceType')
      .findOneAndRemove({ _id }, async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(_id)

        const products = await getProducts({
          spaceTypes: [_id]
        })

        for (const product of products) {
          const productId = toStringId(product)
          const productSpaceTypes = get(product, 'spaceTypes', [])

          await updateProduct(productId, {
            spaceTypes: without(productSpaceTypes, _id)
          })
        }

        const spaces = await getSpaces({
          spaceType: _id
        })

        for (const space of spaces) {
          const spaceId = toStringId(space)

          await updateSpace(spaceId, {
            spaceType: null
          })
        }

        const follows = await getFollows(_id)

        for (const follow of follows) {
          await updateUser(toStringId(get(follow, 'createdBy')), {
            $pull: { following: toObjectId(follow) }
          })

          await destroyFollow(toStringId(follow))
        }

        resolve()
      })
  })
)
