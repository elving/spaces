import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (category, limit = 3) => (
  new Promise(async (resolve, reject) => {
    mongoose
      .model('Product')
      .where({ categories: { $in: [category] } })
      .sort('-createdAt')
      .limit(limit)
      .exec((err, products = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(products)
      })
  })
)
