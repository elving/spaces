import get from 'lodash/get'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { removeFromCache, invalidateFromCache } from '../cache'

export default (_id, props) => (
  new Promise(async (resolve, reject) => {
    const updates = sanitize(props)

    const options = {
      new: true,
      runValidators: true
    }

    mongoose
      .model('Comment')
      .findOneAndUpdate({ _id }, updates, options, async (err, comment) => {
        if (err) {
          return reject(parseError(err))
        }

        await removeFromCache(`comment-${get(comment, 'sid')}`)
        await removeFromCache(`comment-all-${get(comment, 'parent')}`)

        await invalidateFromCache([
          _id,
          toIdsFromPath(comment, 'parent')
        ])

        resolve(comment)
      })
  })
)
