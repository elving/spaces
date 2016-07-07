import get from 'lodash/get'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import parseError from '../utils/parseError'
import { invalidateFromCache } from '../cache'

export default (_id) => {
  return new Promise(async (resolve, reject) => {
    mongoose
      .model('Product')
      .findOneAndRemove({ _id }, async (err, product) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache([
          _id,
          toIds(get(product, 'brand')),
          toIds(get(product, 'colors')),
          toIds(get(product, 'categories')),
          toIds(get(product, 'spaceTypes'))
        ])

        resolve()
      })
  })
}
