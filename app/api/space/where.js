import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (params = {}) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .where(params)
      .exec((err, products = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(products)
      })
  })
)
