import get from 'lodash/get'
import size from 'lodash/size'
import parseInt from 'lodash/parseInt'
import mongoose from 'mongoose'

import toStringId from '../utils/toStringId'
import parseError from '../utils/parseError'
import getProducts from './getProducts'
import makeSearchQuery from '../utils/makeSearchQuery'

const getCount = params => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Category')
      .where(params)
      .count((err, count) => {
        if (err) {
          return reject(err)
        }

        resolve(count)
      })
  })
)

export default (params = {}) => (
  new Promise((resolve, reject) => {
    const searchParams = makeSearchQuery(params)

    mongoose
      .model('Category')
      .where(searchParams)
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 50)))
      .sort(get(params, 'sort', 'name'))
      .exec(async (err, categories = []) => {
        if (err) {
          return reject(parseError(err))
        }

        const count = await getCount(searchParams)

        for (const category of categories) {
          const products = await getProducts(toStringId(category))
          category.set('products', products)
        }

        resolve({
          count: count || size(categories),
          results: categories
        })
      })
  })
)
