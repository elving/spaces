import mongoose from 'mongoose'

import { parseError } from '../utils'

export default (category, limit = 3) => {
  return new Promise(async (resolve, reject) => {
    mongoose
      .model('Product')
      .where({ categories: { $in: [category] }})
      .limit(limit)
      .exec((err, products = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(products)
      })
  })
}
