import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Comment')
      .findOneAndRemove({ _id }, (err, comment) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(comment)
      })
  })
)
