import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (parent) => {
  return new Promise(async (resolve, reject) => {
    const key = `like-all-${parent}`

    getFromCacheOrQuery(key, () => {
      mongoose
        .model('Like')
        .where({ parent })
        .populate('createdBy')
        .sort('createdAt')
        .exec(async (err, likes) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(likes)) {
            await saveToCache(key, toJSON(likes), [
              toIds(likes),
              toIdsFromPath(likes, 'createdBy')
            ])

            resolve(likes)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
