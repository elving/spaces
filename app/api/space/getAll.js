import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default () => {
  return new Promise(async (resolve, reject) => {
    const cacheKey = 'space-all'

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('Space')
        .find()
        .sort({ name: 'asc' })
        .exec(async (err, spaces) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(spaces)) {
            await saveToCache(cacheKey, toJSON(spaces), toIds(spaces))
            resolve(spaces)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
