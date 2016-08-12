import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import { invalidateFromCache } from '../cache'

export default (_id, props) => (
  new Promise((resolve, reject) => {
    const updates = sanitize(props, false)
    const options = {
      new: true,
      runValidators: true
    }

    mongoose
      .model('Color')
      .findOneAndUpdate({ _id }, updates, options, async (err, color) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(_id)
        resolve(color)
      })
  })
)
