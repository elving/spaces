import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (sid, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `brand-${sid}`
    const query = () => {
      mongoose
        .model('Brand')
        .findOne({ sid })
        .exec(async (err, brand) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(brand)) {
            await saveToCache(key, toJSON(brand), toIds(brand))
            resolve(brand)
          } else {
            resolve({})
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
