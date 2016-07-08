import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (spaceType, limit = 3) => {
  return new Promise(async (resolve, reject) => {
    mongoose
      .model('Product')
      .where({ spaceTypes: { $in: [spaceType] }})
      .limit(limit)
      .exec((err, products = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(products)
      })
  })
}
