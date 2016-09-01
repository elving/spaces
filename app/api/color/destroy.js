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
      .model('Color')
      .findOneAndRemove({ _id }, async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(_id)

        const products = await getProducts({
          colors: [_id]
        })

        for (const product of products) {
          const productId = toStringId(product)
          const productColors = get(product, 'colors', [])

          await updateProduct(productId, {
            colors: without(productColors, _id)
          })
        }

        const spaces = await getSpaces({
          colors: [_id]
        })

        for (const space of spaces) {
          const spaceId = toStringId(space)
          const spaceColors = get(space, 'colors', [])

          await updateSpace(spaceId, {
            colors: without(spaceColors, _id)
          })
        }

        resolve()
      })
  })
)
