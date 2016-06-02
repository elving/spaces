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

export default (sid, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `space-${sid}`
    const query = () => {
      mongoose
        .model('Space')
        .findOne({ sid })
        .populate({
          path: 'products',
          options: {
            populate: 'brand colors createdBy categories spaceTypes'
          }
        })
        .populate('redesigns')
        .populate('spaceType')
        .populate('createdBy')
        .populate('originalSpace')
        .exec(async (err, space) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(space)) {
            await saveToCache(key, toJSON(space), [
              toIds(space),
              toIdsFromPath(space, 'products'),
              toIdsFromPath(space, 'spaceType'),
              toIdsFromPath(space, 'redesigns'),
              toIdsFromPath(space, 'createdBy'),
              toIdsFromPath(space, 'originalSpace')
            ])

            resolve(space)
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
