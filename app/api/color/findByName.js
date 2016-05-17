import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default (name, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `color-${kebabCase(name)}`
    const query = () => {
      mongoose
        .model('Color')
        .findOne({ name })
        .exec(async (err, color) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(color)) {
            await saveToCache(key, toJSON(color), toIds(color))
            resolve(color)
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
