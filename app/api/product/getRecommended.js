import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default createdBy => (
  new Promise(async (resolve, reject) => {
    const query = isEmpty(createdBy) ? {
      isPendingApproval: true
    } : {
      createdBy,
      isPendingApproval: true
    }

    const cacheKey = isEmpty(createdBy)
      ? `product-recommended-${createdBy}`
      : 'product-recommended'

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('Product')
        .find(query)
        .populate('brand')
        .populate('colors')
        .populate('createdBy')
        .populate('categories')
        .populate('spaceTypes')
        .sort('-createdAt')
        .exec(async (err, products = []) => {
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
          }

          resolve(products)
        })
    })
  })
)