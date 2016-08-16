import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('SpaceType')
      .findOne({ _id })
      .exec((err, spaceType = {}) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(spaceType)
      })
  })
}
