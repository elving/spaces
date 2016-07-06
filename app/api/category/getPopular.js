import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toStringId from '../../utils/toStringId'
import getProducts from './getProducts'
import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default (limit = 8) => {
  return new Promise(async (resolve, reject) => {
    const cacheKey = `category-popular-${limit}`

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('Category')
        .find()
        .limit(limit)
        .sort('-followersCount -productsCount -updatedAt')
        .exec(async (err, categories) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(categories)) {
            for (let category of categories) {
              const products = await getProducts(toStringId(category))
              category.set('products', products)
            }

            await saveToCache(cacheKey, toJSON(categories), toIds(categories))
            resolve(categories)
          } else {
            resolve([])
          }
        })
    }, resolve)
  })
}
