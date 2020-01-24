import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (sid, returnDocument = false) => (
  new Promise((resolve, reject) => {
    const key = `follow-${sid}`
    const query = () => {
      mongoose
        .model('Follow')
        .findOne({ sid })
        .exec(async (err, follow) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(follow)) {
            await saveToCache(key, toJSON(follow), toIds(follow))
            return resolve(follow)
          }

          return resolve()
        })
    }

    if (returnDocument) {
      query()
    } else {
      getFromCacheOrQuery(key, query, resolve)
    }
  })
)
