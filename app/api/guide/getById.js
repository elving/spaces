import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default _id => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Guide')
      .findOne({ _id })
      .exec(async (err, guide = {}) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(guide)
      })
  })
)
