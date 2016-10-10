import mongoose from 'mongoose'

import parseError from '../utils/parseError'
import { removeFromCache, invalidateFromCache } from '../cache'

export default (_id) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Category')
      .findOneAndRemove({ _id }, async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await removeFromCache('category-all')
        await removeFromCache('category-popular-8')
        await invalidateFromCache(_id)

        resolve()
      })
  })
)
