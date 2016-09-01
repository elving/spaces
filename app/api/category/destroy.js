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
      .model('Category')
      .findOneAndRemove({ _id }, async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(_id)

        const products = await getProducts({
          categories: [_id]
        })

        for (const product of products) {
          const productId = toStringId(product)
          const productCategories = get(product, 'categories', [])

          await updateProduct(productId, {
            categories: without(productCategories, _id)
          })
        }

        const spaces = await getSpaces({
          categories: [_id]
        })

        for (const space of spaces) {
          const spaceId = toStringId(space)
          const spaceCategories = get(space, 'categories', [])

          await updateSpace(spaceId, {
            categories: without(spaceCategories, _id)
          })
        }

        resolve()
      })
  })
)
