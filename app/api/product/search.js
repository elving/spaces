import get from 'lodash/get'
import parseInt from 'lodash/parseInt'
import mongoose from 'mongoose'

import { parseError, makeSearchQuery } from '../utils'

export default (params = {}) => {
  return new Promise(async (resolve, reject) => {
    mongoose
      .model('Product')
      .where(makeSearchQuery(params))
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(30)
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
