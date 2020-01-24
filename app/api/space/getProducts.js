import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default productIds => (
  new Promise(async (resolve, reject) => {
    mongoose
      .model('Product')
      .where({
        _id: { $in: productIds }
      })
      .exec((err, products = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(products)
      })
  })
)
