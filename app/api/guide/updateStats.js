import get from 'lodash/get'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import { removeFromCache, invalidateFromCache } from '../cache'

export default (_id, props) => (
  new Promise(async (resolve, reject) => {
    const updates = sanitize(props)

    const options = {
      new: true,
      runValidators: true
    }

    mongoose
      .model('Guide')
      .findOneAndUpdate({ _id }, updates, options, async (err, guide) => {
        if (err) {
          return reject(parseError(err))
        }

        await removeFromCache(`guide-${get(guide, 'sid', '')}`)
        await invalidateFromCache([_id])

        resolve(guide)
      })
  })
)
