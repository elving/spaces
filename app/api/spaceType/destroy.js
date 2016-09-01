import get from 'lodash/get'
import without from 'lodash/without'
import mongoose from 'mongoose'

import getSpaces from '../space/where'
import updateSpace from '../space/update'

import getProducts from '../product/where'
import updateProduct from '../product/update'

import parseError from '../utils/parseError'
import toStringId from '../utils/toStringId'
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

        resolve()
      })
  })
)
