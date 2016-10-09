import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'

export default (_id, props) => (
  new Promise((resolve, reject) => {
    const updates = sanitize(props)
    const options = {
      new: true,
      runValidators: true
    }

    mongoose
      .model('Category')
      .findOneAndUpdate({ _id }, updates, options, async (err, category) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(category)
      })
  })
)
