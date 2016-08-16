import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Category')
      .findOne({ _id })
      .exec((err, category) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(category || {})
      })
  })
}
