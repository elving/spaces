import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Brand')
      .findOne({ _id })
      .exec((err, brand) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(brand || {})
      })
  })
}
