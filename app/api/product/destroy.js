import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default _id => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Product')
      .findOneAndRemove({ _id }, async (err, product) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(product)
      })
  })
)
