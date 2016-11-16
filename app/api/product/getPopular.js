import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (limit = 8, upcoming = false) => (
  new Promise(async (resolve, reject) => {
    const cacheKey = upcoming
      ? `product-popular-${limit}-upcoming`
      : `product-popular-${limit}`

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('Product')
        .where(upcoming
          ? { likesCount: { $gte: 1 } }
          : {}
        )
        .limit(limit)
        .populate('brand')
        .populate('colors')
        .populate('createdBy')
        .populate('categories')
        .populate('spaceTypes')
        .sort(upcoming
          ? '-createdAt -likesCount -commentsCount'
          : '-likesCount -commentsCount'
        )
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

            resolve(products)
          } else {
            resolve([])
          }
        })
    }, resolve)
  })
)
