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
    const cacheKey = `space-popular-${limit}`

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('Space')
        .find()
        .limit(limit)
        .populate({
          path: 'products',
          options: {
            populate: 'colors categories'
          }
        })
        .populate('createdBy')
        .populate('spaceType')
        .populate('originalSpace')
        .sort('-likesCount -productsCount -updatedAt')
        .exec(async (err, spaces) => {
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
