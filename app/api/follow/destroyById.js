import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Follow')
      .findOneAndRemove({ _id }, (err, follow) => {
        if (err) {
          return reject(parseError(err))
        }

        return resolve(follow)
      })
  })
)
