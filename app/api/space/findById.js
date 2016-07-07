import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .findOne({ _id })
      .exec((err, space) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(space)
      })
  })
}
