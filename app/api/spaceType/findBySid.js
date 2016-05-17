import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default (sid, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `spaceType-${sid}`
    const query = () => {
      mongoose
        .model('SpaceType')
        .findOne({ sid })
        .exec(async (err, spaceType) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(spaceType)) {
            await saveToCache(key, toJSON(spaceType), toIds(spaceType))
            resolve(spaceType)
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
