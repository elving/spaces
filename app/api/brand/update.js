import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import { invalidateFromCache } from '../cache'

export default (_id, props) => (
  new Promise((resolve, reject) => {
    const updates = sanitize(props)
    const options = {
      new: true,
      runValidators: true
    }

    mongoose
      .model('Brand')
      .findOneAndUpdate({ _id }, updates, options, async (err, brand) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(_id)
        resolve(brand)
      })
  })
)
