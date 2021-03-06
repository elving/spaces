import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (sid, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `comment-${sid}`
    const query = () => {
      mongoose
        .model('Comment')
        .findOne({ sid })
        .exec(async (err, comment) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(comment)) {
            await saveToCache(key, toJSON(comment), toIds(comment))
            resolve(comment)
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
