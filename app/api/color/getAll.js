import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default () => {
  return new Promise(async (resolve, reject) => {
    const key = 'color-all'

    getFromCacheOrQuery(key, () => {
      mongoose
        .model('Color')
        .find()
        .sort({ name: 'asc' })
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
