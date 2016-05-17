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

export default () => {
  return new Promise(async (resolve, reject) => {
    const key = 'product-all'

    getFromCacheOrQuery(key, () => {
      mongoose
        .model('Product')
        .find()
        .populate('brand')
        .populate('colors')
        .populate('categories')
        .populate('spaceTypes')
        .exec(async (err, products) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(products)) {
            await saveToCache(key, toJSON(products), [
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
