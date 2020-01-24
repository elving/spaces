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
        .populate({
          path: 'originalSpace',
          options: {
            populate: 'createdBy'
          }
        })
        .exec(async (err, spaces = []) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(spaces)) {
            await saveToCache(key, toJSON(spaces), [
              toIds(spaces),
              toIdsFromPath(spaces, 'createdBy')
            ])

            resolve(spaces)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
)
