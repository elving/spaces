import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Product')
      .findOne({ _id })
      .exec((err, product = {}) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(product)
      })
  })
}
