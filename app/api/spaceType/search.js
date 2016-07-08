import get from 'lodash/get'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import parseInt from 'lodash/parseInt'
import mongoose from 'mongoose'

import toStringId from '../utils/toStringId'
import parseError from '../utils/parseError'
import makeSearchQuery from '../utils/makeSearchQuery'

const getCount = (params) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('SpaceType')
      .where(params)
      .count((err, count) => {
        if (err) {
          return reject(err)
        }

        resolve(count)
      })
  })
}

const getProducts = (spaceType) => {
  return new Promise(async (resolve, reject) => {
    mongoose
      .model('Product')
      .where({ spaceTypes: { $in: [spaceType] }})
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
    const searchParams = makeSearchQuery(params)

    mongoose
      .model('SpaceType')
      .where(searchParams)
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 40)))
      .sort('name')
      .exec(async (err, spaceTypes) => {
        if (err) {
          return reject(parseError(err))
        }

        const count = await getCount(searchParams)

        for (let spaceType of spaceTypes) {
          const products = await getProducts(toStringId(spaceType))
          spaceType.set('products', products)
        }

        resolve({
          count: count || size(spaceTypes),
          results: spaceTypes
        })
      })
  })
}
