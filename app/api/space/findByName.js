import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (name, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `space-${kebabCase(name)}`
    const query = () => {
      mongoose
        .model('Space')
        .findOne({ name })
        .exec(async (err, space = {}) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(space)) {
            await saveToCache(key, toJSON(space), toIds(space))
            resolve(space)
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
