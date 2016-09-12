import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Like')
      .findOneAndRemove({ _id }, (err, like) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(like)
      })
  })
)
