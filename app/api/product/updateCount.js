import mongoose from 'mongoose'
import { parseError } from '../utils'

export default (_id, changes = {}) => {
  return new Promise(async (resolve, reject) => {
    mongoose
      .model('Product')
      .findOneAndUpdate({ _id }, changes, {
        new: true,
        runValidators: true
      }, (err, product) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(product)
      })
  })
}
