import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (limit = 8) => {
  return new Promise(async (resolve, reject) => {
    const cacheKey = `space-popular-${limit}`

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('Space')
        .find()
        .limit(limit)
        .populate('colors')
        .populate('products')
        .populate('createdBy')
        .populate('spaceType')
        .populate('categories')
        .populate('originalSpace')
        .sort('-likesCount -productsCount -updatedAt')
        .exec(async (err, spaces = []) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(spaces)) {
            await saveToCache(cacheKey, toJSON(spaces), [
              toIds(spaces),
              toIdsFromPath(spaces, 'products'),
              toIdsFromPath(spaces, 'createdBy'),
              toIdsFromPath(spaces, 'spaceType'),
              toIdsFromPath(spaces, 'originalSpace')
            ])

            resolve(spaces)
          } else {
            resolve([])
          }
        })
    }, resolve)
  })
}
