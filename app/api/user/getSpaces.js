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

export default (createdBy) => {
  return new Promise(async (resolve, reject) => {
    const key = `space-all-${createdBy}`

    if (isEmpty(createdBy)) {
      return resolve([])
    }

    getFromCacheOrQuery(key, () => {
      mongoose
        .model('Space')
        .where({ createdBy })
        .populate('createdBy')
        .populate('products')
        .populate('redesigns')
        .sort({ name: 'asc' })
        .exec(async (err, spaces) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(spaces)) {
            await saveToCache(key, toJSON(spaces), [
              toIds(spaces),
              toIdsFromPath(spaces, 'products'),
              toIdsFromPath(spaces, 'redesigns')
            ])

            resolve(spaces)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
