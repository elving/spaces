import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default _id => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .findOneAndRemove({ _id }, async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve()
      })
  })
)
