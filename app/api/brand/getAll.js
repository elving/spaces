import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default () => {
  return new Promise((resolve, reject) => {
    const cacheKey = 'brand-all'

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('Brand')
        .find()
        .sort({ name: 'asc' })
        .exec(async (err, brands) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(brands)) {
            await saveToCache(cacheKey, toJSON(brands), toIds(brands))
            resolve(brands)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
