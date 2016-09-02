import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default originalSpace => (
  new Promise((resolve, reject) => {
    const key = `redesigns-all-${originalSpace}`

    getFromCacheOrQuery(key, () => {
      mongoose
        .model('Space')
        .where({ originalSpace })
        .sort('createdAt')
        .populate('colors')
        .populate('products')
        .populate('createdBy')
        .populate('categories')
        .populate('spaceType')
        .populate('originalSpace')
        .exec(async (err, spaces = []) => {
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
)
