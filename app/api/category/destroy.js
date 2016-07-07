import mongoose from 'mongoose'

import parseError from '../utils/parseError'
import { invalidateFromCache } from '../cache'

export default (_id) => {
  return new Promise(async (resolve, reject) => {
    mongoose
      .model('Category')
      .findOneAndRemove({ _id }, async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(_id)
        resolve()
      })
  })
}
