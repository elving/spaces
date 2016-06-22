import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import parseInt from 'lodash/parseInt'
import mongoose from 'mongoose'

import { parseError } from '../utils'

const getProducts = (category) => {
  return new Promise(async (resolve, reject) => {
    mongoose
      .model('Product')
      .where({ categories: { $in: [category] }})
      .limit(3)
      .exec((err, product) => {
        if (err) {
          return reject(parseError(err))
        }

        if (!isEmpty(product)) {
          resolve(product)
        } else {
          resolve()
        }
      })
  })
}

export default (params = {}) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Category')
      .find()
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 40)))
      .sort('-createdAt')
      .exec(async (err, categories) => {
        if (err) {
          return reject(parseError(err))
        }

        for (let category of categories) {
          const products = await getProducts(category.get('id'))
          category.set('products', products)
        }

        resolve(isEmpty(categories) ? [] : categories)
      })
  })
}
