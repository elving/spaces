import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (parent) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Like')
      .where({ parent })
      .count((err, count = 0) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(count)
      })
  })
)
