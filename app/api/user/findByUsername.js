import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toJSON from '../utils/toJSON'
import toStringId from '../utils/toStringId'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (username) => (
  new Promise((resolve, reject) => {
    const key = `user-${username}`

    const query = () => {
      mongoose
        .model('User')
        .findOne({ username })
        .exec(async (err, user) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(user)) {
            await saveToCache(key, toJSON(user), [toStringId(user)])
            resolve(user)
          } else {
            resolve()
          }
        })
    }

    getFromCacheOrQuery(key, query, resolve)
  })
)
