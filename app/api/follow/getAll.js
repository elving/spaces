import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (parent) => (
  new Promise(async (resolve, reject) => {
    const key = `follow-all-${parent}`

    getFromCacheOrQuery(key, () => {
      mongoose
        .model('Follow')
        .where({ parent })
        .populate('createdBy')
        .sort('createdAt')
        .exec(async (err, follows) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(follows)) {
            await saveToCache(key, toJSON(follows), [
              toIds(follows),
              toIdsFromPath(follows, 'createdBy')
            ])

            return resolve(follows)
          }

          return resolve()
        })
    }, resolve)
  })
)
