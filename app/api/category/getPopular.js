import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

const getProducts = (category) => {
  return new Promise(async (resolve, reject) => {
    mongoose
      .model('Product')
      .where({ categories: { $in: [category] }})
      .limit(3)
      .exec((err, product) => {
        if (err) {
          return reject(parseError(err))
        }

        if (!isEmpty(product)) {
          resolve(product)
        } else {
          resolve()
        }
      })
  })
}

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
              const products = await getProducts(category.get('id'))
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
