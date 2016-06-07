import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { saveToCache } from '../cache'

import {
  toIds,
  toJSON,
  parseError,
  toIdsFromPath,
  getFromCacheOrQuery
} from '../utils'

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
