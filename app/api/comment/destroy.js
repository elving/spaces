import mongoose from 'mongoose'

import { parseError } from '../utils'

export default (_id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Comment')
      .findOneAndRemove({ _id }, (err, like) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(like)
      })
  })
}
