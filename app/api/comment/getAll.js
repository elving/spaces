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
    const key = `comment-all-${parent}`

    getFromCacheOrQuery(key, () => {
      mongoose
        .model('Comment')
        .where({ parent })
        .populate('createdBy')
        .sort('createdAt')
        .exec(async (err, comments) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(comments)) {
            await saveToCache(key, toJSON(comments), [
              toIds(comments),
              toIdsFromPath(comments, 'createdBy')
            ])

            resolve(comments)
          } else {
            resolve()
          }
        })
    }, resolve)
  })
}
