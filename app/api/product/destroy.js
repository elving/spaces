import mongoose from 'mongoose'

import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { removeFromCache, invalidateFromCache } from '../../api/cache'

export default _id => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Product')
      .findOneAndRemove({ _id }, async (err, product) => {
        if (err) {
          return reject(parseError(err))
        }

        await removeFromCache('brand-all')
        await removeFromCache('color-all')
        await removeFromCache('category-all')
        await removeFromCache('spaceType-all')
        await removeFromCache('product-all')
        await removeFromCache('product-latest')
        await removeFromCache('product-popular-8')
        await removeFromCache(`product-related-${_id}`)
        await removeFromCache('product-popular-8-upcoming')

        await invalidateFromCache([
          _id,
          toIdsFromPath(product, 'brand'),
          toIdsFromPath(product, 'spaceTypes'),
          toIdsFromPath(product, 'colors'),
          toIdsFromPath(product, 'categories'),
        ])

        resolve(product)
      })
  })
)
