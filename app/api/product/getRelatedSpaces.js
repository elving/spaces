import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (product) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .where({ products: { $in: [product] } })
      .limit(8)
      .populate('colors')
      .populate('products')
      .populate('createdBy')
      .populate('spaceType')
      .populate('categories')
      .populate({
        path: 'originalSpace',
        options: {
          populate: 'createdBy'
        }
      })
      .exec((err, spaces = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(spaces)
      })
  })
)
