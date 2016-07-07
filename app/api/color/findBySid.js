import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (sid, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `color-${sid}`
    const query = () => {
      mongoose
        .model('Color')
        .findOne({ sid })
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
