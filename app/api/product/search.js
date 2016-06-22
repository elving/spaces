import get from 'lodash/get'
import parseInt from 'lodash/parseInt'
import mongoose from 'mongoose'

import { parseError, makeSearchQuery } from '../utils'

export default (params = {}) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Product')
      .where(makeSearchQuery(params))
      .sort('-createdAt')
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 40)))
      .populate('brand')
      .populate('colors')
      .populate('createdBy')
      .populate('categories')
      .populate('spaceTypes')
      .exec((err, products) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(products)
      })
  })
}
