import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'
import { toIds, toJSON, parseError, getFromCacheOrQuery } from '../utils'

export default () => {
  return new Promise(async (resolve, reject) => {
    const key = 'color-all'

    getFromCacheOrQuery(key, () => {
      mongoose
        .model('Color')
        .find()
        .exec(async (err, colors) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(colors)) {
            await saveToCache(key, toJSON(colors), toIds(colors))
            resolve(colors)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
