import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

import { saveToCache } from '../cache'

export default (_id) => (
  new Promise((resolve, reject) => {
    const key = `user-${_id}`

    const query = () => {
      mongoose
        .model('User')
        .findOne({ _id })
        .populate('following')
        .exec(async (err, user = {}) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(user)) {
            await saveToCache(key, toJSON(user), [
              toIds(user),
              toIdsFromPath(user, 'following')
            ])

            resolve(user)
          } else {
            resolve({})
          }
        })
    }

    getFromCacheOrQuery(key, query, resolve)
  })
)
