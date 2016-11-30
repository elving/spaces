import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default params => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Notification')
      .where(params)
      .count((err, count = 0) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(count)
      })
  })
)
