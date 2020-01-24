import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import toStringId from '../utils/toStringId'
import parseError from '../utils/parseError'
import getProducts from './getProducts'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (limit = 8) => {
  return new Promise(async (resolve, reject) => {
    const cacheKey = `category-popular-${limit}`

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('Category')
        .find()
        .limit(limit)
        .sort('-followersCount -spacesCount -productsCount')
        .exec(async (err, categories) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(categories)) {
            for (const category of categories) {
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
