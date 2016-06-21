import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'

import {
  toIds,
  toJSON,
  parseError,
  toIdsFromPath,
  getFromCacheOrQuery
} from '../utils'

export default (limit = 8) => {
  return new Promise(async (resolve, reject) => {
    const cacheKey = 'product-latest'

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('Product')
        .find()
        .limit(limit)
        .populate('brand')
        .populate('colors')
        .populate('createdBy')
        .populate('categories')
        .populate('spaceTypes')
        .sort('-createdAt')
        .exec(async (err, products) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(products)) {
            await saveToCache(cacheKey, toJSON(products), [
              toIds(products),
              toIdsFromPath(products, 'brand'),
              toIdsFromPath(products, 'colors'),
              toIdsFromPath(products, 'categories'),
              toIdsFromPath(products, 'spaceTypes')
            ])

            resolve(products)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
