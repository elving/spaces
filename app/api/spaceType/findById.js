import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('SpaceType')
      .findOne({ _id })
      .populate('categories')
      .exec((err, spaceType = {}) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(spaceType)
      })
  })
)
