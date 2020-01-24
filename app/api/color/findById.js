import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Color')
      .findOne({ _id })
      .exec((err, color = {}) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(color)
      })
  })
}
