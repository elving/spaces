import get from 'lodash/get'
import size from 'lodash/size'
import parseInt from 'lodash/parseInt'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'
import makeSearchQuery from '../utils/makeSearchQuery'

const getCount = (params) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Product')
      .where(params)
      .count((err, count) => {
        if (err) {
          return reject(err)
        }

        resolve(count)
      })
  })
}

export default (params = {}) => {
  return new Promise((resolve, reject) => {
    const searchParams = makeSearchQuery(params)

    mongoose
      .model('Product')
      .where(searchParams)
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 40)))
      .populate('brand')
      .populate('colors')
      .populate('createdBy')
      .populate('categories')
      .populate('spaceTypes')
      .sort('-createdAt')
      .exec(async (err, products) => {
        if (err) {
          return reject(parseError(err))
        }

        const count = await getCount(searchParams)

        resolve({
          count: count || size(products),
          results: products
        })
      })
  })
}
