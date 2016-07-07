import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (sid, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `product-${sid}`

    const query = () => {
      mongoose
        .model('Product')
        .findOne({ sid })
        .populate('brand')
        .populate('colors')
        .populate('categories')
        .populate('spaceTypes')
        .exec(async (err, product) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(product)) {
            await saveToCache(key, toJSON(product), [
              toIds(product),
              toIdsFromPath(product, 'brand'),
              toIdsFromPath(product, 'colors'),
              toIdsFromPath(product, 'categories'),
              toIdsFromPath(product, 'spaceTypes')
            ])

            resolve(product)
          } else {
            resolve()
          }
        })
    }

    if (returnDocument) {
      query()
    } else {
      getFromCacheOrQuery(key, query, resolve)
    }
  })
}
