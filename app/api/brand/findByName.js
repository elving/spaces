import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default (name, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `brand-${kebabCase(name)}`
    const query = () => {
      mongoose
        .model('Brand')
        .findOne({ name })
        .exec(async (err, brand) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(brand)) {
            await saveToCache(key, toJSON(brand), toIds(brand))
            resolve(brand)
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
